/* Dynamic pagination — used by category pages */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  PCC.paginate = function ({ items, perPage = 6, mountGrid, mountPager, renderItem }) {
    const grid = typeof mountGrid === 'string' ? document.getElementById(mountGrid) : mountGrid;
    const pager = typeof mountPager === 'string' ? document.getElementById(mountPager) : mountPager;
    if (!grid) return;
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    let current = 1;

    const draw = () => {
      grid.innerHTML = '';
      const start = (current - 1) * perPage;
      items.slice(start, start + perPage).forEach((it) => grid.appendChild(renderItem(it)));
      drawPager();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const drawPager = () => {
      if (!pager) return;
      pager.innerHTML = '';
      if (totalPages <= 1) return;

      const mkBtn = (label, page, opts = {}) => {
        const b = PCC.el('button', { type: 'button' }, label);
        if (opts.active) b.classList.add('active');
        if (opts.disabled) b.disabled = true;
        b.addEventListener('click', () => { current = page; draw(); });
        return b;
      };

      pager.appendChild(mkBtn('Previous', Math.max(1, current - 1), { disabled: current === 1 }));

      const pages = [];
      const push = (n) => pages.push(n);
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) push(i);
      } else {
        push(1);
        if (current > 3) push('…');
        for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) push(i);
        if (current < totalPages - 2) push('…');
        push(totalPages);
      }
      pages.forEach((p) => {
        if (p === '…') {
          pager.appendChild(PCC.el('button', { type: 'button', disabled: '' }, '…'));
        } else {
          pager.appendChild(mkBtn(String(p), p, { active: p === current }));
        }
      });

      pager.appendChild(mkBtn('Next', Math.min(totalPages, current + 1), { disabled: current === totalPages }));
    };

    draw();
  };
})(window);
