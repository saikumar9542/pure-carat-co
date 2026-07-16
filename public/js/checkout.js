/* Checkout page logic */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  PCC.initCheckout = function () {
    const form = document.getElementById('checkoutForm');
    const summary = document.getElementById('orderSummary');
    const items = PCC.cart.items();

    if (!items.length) {
      document.getElementById('checkoutMain').innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-bag-shopping"></i>
          <h2>Your cart is empty</h2>
          <p>Add pieces you love before checking out.</p>
          <a class="btn btn--gold" href="../index.html">Continue shopping</a>
        </div>`;
      return;
    }

    const subtotal = PCC.cart.subtotal();
    const shipping = subtotal >= 20000 ? 0 : 250;
    const total = subtotal + shipping;

    summary.innerHTML = `
      <h3>Order Summary</h3>
      ${items.map((i) => `
        <div class="order-summary__item">
          <span>${i.name} × ${i.qty}</span>
          <span>${PCC.formatPrice(i.price * i.qty)}</span>
        </div>`).join('')}
      <div class="order-summary__item"><span>Subtotal</span><span>${PCC.formatPrice(subtotal)}</span></div>
      <div class="order-summary__item"><span>Shipping</span><span>${shipping ? PCC.formatPrice(shipping) : 'Free'}</span></div>
      <div class="order-summary__item" style="font-weight:600;font-size:16px;">
        <span>Total</span><span>${PCC.formatPrice(total)}</span>
      </div>
    `;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('checkoutError');
      if (errEl) errEl.textContent = '';

      // Native constraint validation first.
      if (!form.checkValidity()) {
        const first = form.querySelector(':invalid');
        if (first) first.focus();
        if (errEl) errEl.textContent = 'Please fill all required fields correctly.';
        return;
      }

      const fd = new FormData(form);
      const customer = Object.fromEntries(fd.entries());

      // Explicit checks for mobile & pincode.
      const mobile = String(customer.mobile || '').replace(/\D/g, '');
      const pincode = String(customer.pincode || '').replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        if (errEl) errEl.textContent = 'Enter a valid 10-digit Indian mobile number.';
        form.mobile.focus(); return;
      }
      if (!/^[1-9]\d{5}$/.test(pincode)) {
        if (errEl) errEl.textContent = 'Enter a valid 6-digit pincode.';
        form.pincode.focus(); return;
      }
      customer.mobile = mobile; customer.pincode = pincode;

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Placing order…';

      const order = {
        orderId: PCC.uid(),
        date: new Date().toISOString(),
        customer,
        items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
        subtotal, shipping, total,
      };

      PCC.storage.saveCustomer(customer);
      const result = await PCC.submitOrder(order);

      if (result.ok) {
        PCC.cart.clear();
        document.getElementById('checkoutMain').innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-circle-check" style="color:var(--gold)"></i>
            <h2>Order confirmed</h2>
            <p>Order ID: <strong>${order.orderId}</strong></p>
            <p>${result.offline ? 'Saved locally — connect your Apps Script URL to sync with Google Sheets.' : "We've saved your order and will be in touch shortly."}</p>
            <a class="btn btn--gold" href="../index.html">Back to home</a>
          </div>`;
      } else {
        PCC.toast('Something went wrong. Please try again.');
        btn.disabled = false; btn.textContent = 'Confirm Order';
      }
    });
  };
})(window);
