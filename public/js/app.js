/* App shell — header, footer, search, mobile nav */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  const NAV_LINKS = [
    { href: 'index',       label: 'Home' },
    { href: 'categories', label: 'Categories' },
    { href: 'products',   label: 'Products' },
    { href: 'about',      label: 'About' },
    { href: 'contact',    label: 'Contact' },
  ];

  function resolveHref(key) {
    const base = PCC.base();
    switch (key) {
      case 'index':       return `${base}index.html`;
      case 'categories': return `${base}index.html#categories`;
      case 'products':   return `${base}index.html#categories`;
      case 'about':      return `${base}pages/about.html`;
      case 'contact':    return `${base}pages/contact.html`;
      case 'cart':       return `${base}pages/cart.html`;
      default:           return '#';
    }
  }

  function renderHeader() {
    const host = document.getElementById('siteHeader');
    if (!host) return;
    const base = PCC.base();
    host.innerHTML = `
      <div class="header-inner">
        <a class="brand" href="${base}index.html" aria-label="Pure Carat Co index">
          <span class="brand__mark">P</span>
          <span>
            <span class="brand__name">PURE CARAT</span><br />
            <span class="brand__tag">Gold Works.</span>
          </span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${NAV_LINKS.map((l) => `<a href="${resolveHref(l.href)}">${l.label}</a>`).join('')}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" id="openSearch" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
          <a class="icon-btn" href="${resolveHref('cart')}" aria-label="Cart">
            <i class="fa-solid fa-bag-shopping"></i>
            <span class="cart-count" data-cart-count style="display:none">0</span>
          </a>
          <button class="icon-btn" aria-label="Account"><i class="fa-regular fa-user"></i></button>
          <!--
          <button class="icon-btn hamburger" id="openMenu" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
          -->
        </div>
      </div>
      <!-- 
      <div class="mobile-nav" id="mobileNav" aria-hidden="true">
        ${NAV_LINKS.map((l) => `<a href="${resolveHref(l.href)}">${l.label}</a>`).join('')}
        <a href="${resolveHref('cart')}">Cart</a>
      </div>
       -->
    `;

    document.getElementById('openMenu')?.addEventListener('click', () => {
      document.getElementById('mobileNav').classList.toggle('open');
    });
    document.getElementById('openSearch')?.addEventListener('click', openSearch);
  }

  function renderFooter() {
    const host = document.getElementById('siteFooter');
    if (!host) return;
    const base = PCC.base();
    host.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>Pure Carat Co</h4>
            <p>Handcrafted heirlooms, forged with intention. Every piece tells a timeless story.</p>
            <div class="socials">
              <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Pinterest"><i class="fa-brands fa-pinterest-p"></i></a>
              <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="${base}index.html">index</a>
            <a href="${base}pages/about.html">About</a>
            <a href="${base}pages/contact.html">Contact</a>
            <a href="${base}pages/cart.html">Cart</a>
          </div>
          <div>
            <h4>Categories</h4>
            <a href="${base}pages/category.html?cat=rings">Rings</a>
            <a href="${base}pages/category.html?cat=necklaces">Necklaces</a>
            <a href="${base}pages/category.html?cat=studs">Earrings</a>
            <a href="${base}pages/category.html?cat=bracelets">Bracelets</a>
          </div>
          <div>
            <h4>Contact</h4>
            <p><i class="fa-solid fa-envelope"></i> hello@purecarat.co</p>
            <p><i class="fa-solid fa-phone"></i> +91 98765 43210</p>
            <form class="newsletter" onsubmit="event.preventDefault(); PCC.toast('Subscribed — thank you!', 'gold'); this.reset();">
              <input type="email" placeholder="Your email" required aria-label="Email address" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div class="footer-bottom">© ${new Date().getFullYear()} Pure Carat Co. All rights reserved.</div>
      </div>
    `;
  }

  /* ------- Search ------- */
  function openSearch() {
    const ov = document.getElementById('searchOverlay');
    if (!ov) return;
    ov.classList.add('open');
    ov.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.getElementById('searchInput')?.focus(), 60);
  }
  function closeSearch() {
    const ov = document.getElementById('searchOverlay');
    if (!ov) return;
    ov.classList.remove('open');
    ov.setAttribute('aria-hidden', 'true');
  }
  function initSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const closeBtn = document.getElementById('searchClose');
    if (!input || !results) return;
    closeBtn?.addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
    input.addEventListener('input', PCC.debounce(() => {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = '';
      if (!q) return;
      const matches = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 8);
      if (!matches.length) {
        results.appendChild(PCC.el('div', { class: 'empty-state', style: 'padding:24px' }, 'No results found.'));
        return;
      }
      matches.forEach((p) => {
        const row = PCC.el('a', {
          class: 'search-result',
          href: `${PCC.base()}pages/category.html?cat=${p.category}`,
        });
        row.appendChild(PCC.el('img', { src: p.image, alt: p.name, loading: 'lazy' }));
        const meta = PCC.el('div', {});
        meta.appendChild(PCC.el('h4', { class: 'search-result__name' }, p.name));
        meta.appendChild(PCC.el('div', { class: 'search-result__price' }, PCC.formatPrice(p.price)));
        row.appendChild(meta);
        results.appendChild(row);
      });
    }, 150));
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    initSearch();
    PCC.updateCartCount();
  });
})(window);
