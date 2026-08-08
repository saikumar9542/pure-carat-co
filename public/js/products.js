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
        src: PCC.asset(c.image),
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
    media.appendChild(PCC.el('img', { src: PCC.asset(p.image), alt: p.name, loading: 'lazy' }));
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

  PCC.renderFeatured = function (mountId, limit = 3, expanded = false) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    const initialLimit = Math.max(1, Number(limit) || 3);
    const allProducts = PCC.getFeatured(FEATURED_IDS.length);
    const visibleCount = expanded ? allProducts.length : Math.min(initialLimit, allProducts.length);

    mount.innerHTML = '';
    allProducts.slice(0, visibleCount).forEach((p) => mount.appendChild(PCC.renderProductCard(p)));

    const existingToggle = mount.parentElement.querySelector('.featured-toggle');
    if (existingToggle) existingToggle.remove();

    if (allProducts.length > initialLimit) {
      const toggleWrap = PCC.el('div', { class: 'featured-toggle' });
      const toggleBtn = PCC.el('button', {
        class: 'btn btn--outline featured-toggle__btn',
        type: 'button',
      }, expanded ? 'View Less' : 'View More');

      toggleBtn.addEventListener('click', () => {
        PCC.renderFeatured(mountId, initialLimit, !expanded);
      });

      toggleWrap.appendChild(toggleBtn);
      mount.insertAdjacentElement('afterend', toggleWrap);
    }
  };

  PCC.renderProductList = function (mountId, products = PRODUCTS) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = '';
    products.forEach((p) => mount.appendChild(PCC.renderProductCard(p)));
  };

  PCC.injectProductJsonLD = function (products = []) {
    if (!products || !products.length) return;
    const graph = products.map((p) => {
      const price = Number(PCC.pricing.priceOf ? PCC.pricing.priceOf(p) : 0);
      return {
        "@type": "Product",
        "@id": `${PCC.base()}pages/product.html?id=${p.id}`,
        "sku": String(p.id),
        "name": p.name,
        "description": p.description,
        "image": [PCC.asset(p.image)],
        "brand": { "@type": "Brand", "name": "Gold Works" },
        "offers": {
          "@type": "Offer",
          "url": `${PCC.base()}pages/product.html?id=${p.id}`,
          "priceCurrency": "INR",
          "price": price,
          "availability": "https://schema.org/InStock"
        }
      };
    });
    const payload = { "@context": "https://schema.org", "@graph": graph };
    const existing = document.getElementById('pcc-product-jsonld');
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'pcc-product-jsonld';
    s.textContent = JSON.stringify(payload, null, 2);
    document.head.appendChild(s);
  };
})(window);
