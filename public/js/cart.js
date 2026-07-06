/* Cart logic — LocalStorage backed */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  PCC.cart = {
    items() { return PCC.storage.getCart(); },
    count() { return this.items().reduce((n, i) => n + i.qty, 0); },
    subtotal() { return this.items().reduce((n, i) => n + i.price * i.qty, 0); },

    add(productId, qty = 1) {
      const p = PCC.getProduct(productId);
      if (!p) return;
      const items = this.items();
      const existing = items.find((i) => i.id === p.id);
      if (existing) existing.qty += qty;
      else items.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty });
      PCC.storage.setCart(items);
      PCC.toast(`${p.name} added to cart`, 'gold');
    },

    setQty(id, qty) {
      const items = this.items().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
      PCC.storage.setCart(items);
    },

    remove(id) {
      PCC.storage.setCart(this.items().filter((i) => i.id !== id));
    },

    clear() { PCC.storage.clearCart(); },
  };

  PCC.updateCartCount = function () {
    const el = document.querySelector('[data-cart-count]');
    if (!el) return;
    const c = PCC.cart.count();
    el.textContent = c;
    el.style.display = c > 0 ? 'grid' : 'none';
  };

  document.addEventListener('pcc:cart:changed', PCC.updateCartCount);

  /* Delegated add-to-cart handler */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-cart]');
    if (!btn) return;
    e.preventDefault();
    PCC.cart.add(Number(btn.dataset.addCart));
  });
})(window);
