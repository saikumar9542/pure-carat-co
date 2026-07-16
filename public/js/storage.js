/* -------------------------------------------------------------------------
 * Google Apps Script integration + LocalStorage helpers.
 * ------------------------------------------------------------------------- */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  // Deployed Web App URL (execute as Me, access Anyone).
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgBdRKzFxnH4aTpCpYQlFFh0HEsDNLK5vLfaIFuEozNTH2XJq1ya7xDRHmkWKef1N4ng/exec';

  const CART_KEY     = 'pcc:cart:v1';
  const CUSTOMER_KEY = 'pcc:customer:v1';
  const ADMIN_KEY    = 'pcc:admin:v1';

  PCC.storage = {
    getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } },
    setCart(items) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent('pcc:cart:changed'));
    },
    clearCart() { this.setCart([]); },

    saveCustomer(c) { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c)); },
    getCustomer()   { try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY)); } catch { return null; } },

    saveAdmin(a)    { sessionStorage.setItem(ADMIN_KEY, JSON.stringify(a)); },
    getAdmin()      { try { return JSON.parse(sessionStorage.getItem(ADMIN_KEY)); } catch { return null; } },
    clearAdmin()    { sessionStorage.removeItem(ADMIN_KEY); },
  };

  /* ------- Apps Script transport (text/plain to avoid CORS preflight) ------- */
  async function post(body) {
    if (!SCRIPT_URL) return { ok: false, error: 'SCRIPT_URL not configured' };
    try {
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
        redirect: 'follow',
      });
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch { data = { ok: false, error: 'Bad response', raw: text }; }
      return data;
    } catch (err) {
      console.error('[PCC] request failed', err);
      return { ok: false, error: err.message };
    }
  }

  PCC.api = {
    submitOrder: (order)      => post({ action: 'createOrder', payload: order }),
    login:       (creds)      => post({ action: 'login', payload: creds }),
    getOrders:   (token)      => post({ action: 'getOrders', token }),
    updateStatus:(token, o)   => post({ action: 'updateOrderStatus', token, payload: o }),
    setRates:    (token, r)   => post({ action: 'setRates', token, payload: r }),
    // GET so any visitor can read the shared rate without a token / preflight.
    async getRates() {
      if (!SCRIPT_URL) return { ok: false, error: 'SCRIPT_URL not configured' };
      try {
        const res = await fetch(SCRIPT_URL + '?action=getRates', { method: 'GET', redirect: 'follow' });
        return await res.json();
      } catch (err) { return { ok: false, error: err.message }; }
    },
  };

  /* Back-compat alias used by checkout.js */
  PCC.submitOrder = async function (order) {
    if (!SCRIPT_URL) {
      console.warn('[PCC] SCRIPT_URL is empty — order saved locally only.');
      return { ok: true, offline: true };
    }
    const data = await PCC.api.submitOrder(order);
    return { ok: !!data.ok, data, offline: false };
  };
})(window);
