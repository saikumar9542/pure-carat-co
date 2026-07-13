/* Product & category rendering — uses live pricing engine */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  PCC.getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
  PCC.getProductsByCategory = (slug) => PRODUCTS.filter((p) => p.category === slug);
  PCC.getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
  PCC.getFeatured = (limit = 8) =>
    FEATURED_IDS.map((id) => PCC.getProduct(id)).filter(Boolean).slice(0, limit);

  PCC.renderCategoryGrid = function (mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const base = PCC.base();
    mount.innerHTML = '';
    CATEGORIES.forEach((c) => {
      const a = PCC.el('a', {
        class: 'category-card',
        href: `${base}pages/category.html?cat=${c.slug}`,
        'aria-label': c.name,
      });
      a.appendChild(PCC.el('img', {
        class: 'category-card__img',
        src: c.image,
        alt: c.name,
        loading: 'lazy',
      }));
      const overlay = PCC.el('div', { class: 'category-card__overlay' });
      overlay.appendChild(PCC.el('span', { class: 'category-card__meta' }, c.group));
      overlay.appendChild(PCC.el('h3', { class: 'category-card__title' }, c.name));
      a.appendChild(overlay);
      mount.appendChild(a);
    });
  };

  PCC.renderProductCard = function (p) {
    const price = PCC.pricing.priceOf(p);
    const card = PCC.el('article', { class: 'product-card', 'data-id': p.id });
    const media = PCC.el('div', { class: 'product-card__media' });
    media.appendChild(PCC.el('img', { src: p.image, alt: p.name, loading: 'lazy' }));
    const body = PCC.el('div', { class: 'product-card__body' });
    body.appendChild(PCC.el('h3', { class: 'product-card__name' }, p.name));
    body.appendChild(PCC.el('p', { class: 'product-card__desc' }, p.description));
    if (p.goldWeight) {
      body.appendChild(PCC.el('p', { class: 'product-card__weight' },
        `${p.goldWeight} g gold${p.silverWeight ? ` · ${p.silverWeight} g silver` : ''}`));
    }
    body.appendChild(PCC.el('div', {
      class: 'product-card__price',
      'data-product-price': p.id,
    }, PCC.formatPrice(price)));
    const actions = PCC.el('div', { class: 'product-card__actions' });
    const addBtn = PCC.el('button', {
      class: 'btn btn--dark btn--sm',
      'data-add-cart': p.id,
      type: 'button',
    }, 'Add to Cart');
    actions.appendChild(addBtn);
    body.appendChild(actions);
    card.appendChild(media);
    card.appendChild(body);
    return card;
  };

  PCC.renderFeatured = function (mountId, limit) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = '';
    PCC.getFeatured(limit).forEach((p) => mount.appendChild(PCC.renderProductCard(p)));
  };
})(window);
