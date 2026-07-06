/* -------------------------------------------------------------------------
 * Google Apps Script integration + LocalStorage helpers.
 *
 * To connect Google Sheets:
 * 1. Create an Apps Script Web App bound to your spreadsheet.
 * 2. Deploy it as a Web App (execute as: Me, access: Anyone).
 * 3. Paste the resulting URL below into SCRIPT_URL.
 * ------------------------------------------------------------------------- */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGBzriktaptjOYDnjObbeTtCO7YXKzHCgFY-S-U-bCBuOBh6njCLoLJmI2GFRE8me1nA/exec'; // <-- paste your deployed Apps Script Web App URL here

  const CART_KEY = 'pcc:cart:v1';
  const CUSTOMER_KEY = 'pcc:customer:v1';

  PCC.storage = {
    getCart() {
      try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
      catch { return []; }
    },
    setCart(items) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent('pcc:cart:changed'));
    },
    clearCart() { this.setCart([]); },
    saveCustomer(c) { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c)); },
    getCustomer() {
      try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY)); }
      catch { return null; }
    },
  };

  /* ------- Google Sheets submission ------- */
  PCC.submitOrder = async function (order) {
    if (!SCRIPT_URL) {
      console.warn('[PCC] SCRIPT_URL is empty — order saved locally only.');
      return { ok: true, offline: true };
    }
    try {
      // Apps Script Web Apps accept text/plain to avoid CORS preflight.
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'createOrder', payload: order }),
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, data };
    } catch (err) {
      console.error('[PCC] Order submit failed', err);
      return { ok: false, error: err.message };
    }
  };
})(window);
