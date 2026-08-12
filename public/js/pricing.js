/* -------------------------------------------------------------------------
 * Pricing engine — dynamic gold/silver market rate
 *   Gold item   : price = goldWeight   × goldRate   + makingCharges
 *   Silver item : price = silverWeight × silverRate + makingCharges
 *
 * Rates are stored server-side (Apps Script Script Properties) so every
 * visitor on every device sees the same live rate. A localStorage copy is
 * used as a synchronous cache so priceOf(p) stays cheap.
 * ------------------------------------------------------------------------- */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  const RATES_KEY = 'pcc:rates:v1';
  const DEFAULTS  = { gold: 7200, silver: 95, makingCharges: 5000, updatedAt: null };

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(RATES_KEY)) || {};
      return { ...DEFAULTS, ...saved };
    } catch { return { ...DEFAULTS }; }
  }

  function writeLocal(next) {
    const merged = { ...read(), ...next };
    localStorage.setItem(RATES_KEY, JSON.stringify(merged));
    document.dispatchEvent(new CustomEvent('pcc:rates:changed', { detail: merged }));
    return merged;
  }

  PCC.pricing = {
    rates: read,

    /** Cache-only write (used after a successful server save). */
    _cacheRates: writeLocal,

    /** Save rates to the server (admin only) and update the cache. */
    async setRates(next, token) {
      if (PCC.api && token && token !== 'local-fallback') {
        const res = await PCC.api.setRates(token, next).catch((e) => ({ ok: false, error: String(e) }));
        if (res && res.ok) return writeLocal(res.rates || { ...next, updatedAt: new Date().toISOString() });
        // Fall through to local cache so admin still sees a preview, but flag the failure.
        writeLocal({ ...next, updatedAt: new Date().toISOString() });
        throw new Error(res && res.error ? res.error : 'Could not save rates to server');
      }
      // No API / offline: local-only.
      return writeLocal({ ...next, updatedAt: new Date().toISOString() });
    },

    /** Fetch shared rates from the server and refresh the cache. */
    async refreshFromServer() {
      if (!PCC.api || !PCC.api.getRates) return read();
      const res = await PCC.api.getRates().catch(() => null);
      if (res && res.ok && res.rates) {
        const current = read();
        // Only broadcast if something actually changed.
        const changed = ['gold','silver','makingCharges','updatedAt'].some((k) => res.rates[k] !== current[k]);
        if (changed) writeLocal(res.rates);
        return res.rates;
      }
      return read();
    },

    priceOf(p) {
      if (!p) return 0;
      const r = read();
      const gw = Number(p.goldWeight   || 0);
      const sw = Number(p.silverWeight || 0);
      const making = Number(r.makingCharges || 0);
      let total = 0;
      if (gw > 0) total += gw * r.gold   + making;
      if (sw > 0) total += sw * r.silver + making;
      return Math.round(total || Number(p.price || 0));
    },

    breakdown(p) {
      const r = read();
      const gw = Number(p.goldWeight   || 0);
      const sw = Number(p.silverWeight || 0);
      const making = Number(r.makingCharges || 0);
      return {
        goldValue:   Math.round(gw * r.gold),
        silverValue: Math.round(sw * r.silver),
        goldMaking:  gw > 0 ? making : 0,
        silverMaking:sw > 0 ? making : 0,
        rates: r,
      };
    },
  };

  /* Refresh prices on the current page when rates change. */
  document.addEventListener('pcc:rates:changed', () => {
    document.querySelectorAll('[data-product-price]').forEach((el) => {
      const id = Number(el.dataset.productPrice);
      const p = PCC.getProduct && PCC.getProduct(id);
      if (p) el.textContent = PCC.formatPrice(PCC.pricing.priceOf(p));
    });
  });

  /* Pull the latest shared rate as soon as the page loads, then re-render. */
  document.addEventListener('DOMContentLoaded', () => {
    PCC.pricing.refreshFromServer().catch(() => {});
  });
})(window);
