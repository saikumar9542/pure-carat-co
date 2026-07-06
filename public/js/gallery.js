/* Category / gallery page renderer */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  PCC.renderCategoryPage = function ({ slug, titleEl, subtitleEl, breadcrumbEl, gridId, pagerId }) {
    const cat = PCC.getCategory(slug);
    if (!cat) {
      document.title = 'Category — Pure Carat Co';
      if (titleEl) titleEl.textContent = 'Collection not found';
      if (subtitleEl) subtitleEl.textContent = 'The collection you are looking for does not exist yet.';
      return;
    }
    document.title = `${cat.name} — Gold Works.`;
    if (breadcrumbEl) breadcrumbEl.textContent = `Home / ${cat.group} / ${cat.name}`;
    if (titleEl) titleEl.textContent = cat.name;
    if (subtitleEl) subtitleEl.textContent = `${cat.group} collection — crafted for the everyday and the extraordinary.`;

    const items = PCC.getProductsByCategory(slug);
    const grid = document.getElementById(gridId);
    const pager = document.getElementById(pagerId);

    if (!items.length) {
      grid.innerHTML = '';
      grid.appendChild(
        PCC.el('div', { class: 'empty-state', style: 'grid-column: 1/-1;' },
          PCC.el('i', { class: 'fa-solid fa-gem' }),
          PCC.el('h2', {}, 'New pieces coming soon'),
          PCC.el('p', {}, 'This collection is being curated. Check back shortly.')
        )
      );
      if (pager) pager.innerHTML = '';
      return;
    }

    PCC.paginate({
      items,
      perPage: 6,
      mountGrid: grid,
      mountPager: pager,
      renderItem: (p) => PCC.renderProductCard(p),
    });
  };
})(window);
