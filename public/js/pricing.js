/* -------------------------------------------------------------------------
 * Pricing engine — dynamic gold/silver market rate
 *   price = goldWeight × goldRate + silverWeight × silverRate + makingCharges
 *
 * Rates are set by the admin (pages/admin/dashboard.html) and stored in
 * localStorage so every visitor on this browser sees the latest rate.
 * ------------------------------------------------------------------------- */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  const RATES_KEY = 'pcc:rates:v1';
  const DEFAULTS = { gold: 7200, silver: 95, makingCharges: 5000, updatedAt: null };

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(RATES_KEY)) || {};
      return { ...DEFAULTS, ...saved };
    } catch { return { ...DEFAULTS }; }
  }

  function write(next) {
    const merged = { ...read(), ...next, updatedAt: new Date().toISOString() };
    localStorage.setItem(RATES_KEY, JSON.stringify(merged));
    document.dispatchEvent(new CustomEvent('pcc:rates:changed', { detail: merged }));
    return merged;
  }

  PCC.pricing = {
    rates: read,
    setRates: write,

    /** Compute the live price of a product using current rates. */
    priceOf(p) {
      if (!p) return 0;
      const r = read();
      const gold   = Number(p.goldWeight   || 0) * r.gold;
      const silver = Number(p.silverWeight || 0) * r.silver;
      const base   = gold + silver + Number(r.makingCharges || 0);
      // Fallback: legacy products with a fixed `price` and no weight.
      return Math.round(base || Number(p.price || 0));
    },

    /** Optional per-item breakdown for detail views. */
    breakdown(p) {
      const r = read();
      return {
        goldValue:   Math.round(Number(p.goldWeight   || 0) * r.gold),
        silverValue: Math.round(Number(p.silverWeight || 0) * r.silver),
        making:      Number(r.makingCharges || 0),
        rates:       r,
      };
    },
  };

  /* Re-render any element flagged with data-live-price when rates change.
     Elements can opt-in: <span data-live-price="1">₹42,500</span>          */
  document.addEventListener('pcc:rates:changed', () => {
    document.querySelectorAll('[data-product-price]').forEach((el) => {
      const id = Number(el.dataset.productPrice);
      const p = PCC.getProduct && PCC.getProduct(id);
      if (p) el.textContent = PCC.formatPrice(PCC.pricing.priceOf(p));
    });
  });
})(window);
