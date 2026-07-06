/* Small utility helpers used across the app */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  PCC.formatPrice = (n) =>
    '₹' + Number(n || 0).toLocaleString('en-IN');

  PCC.qs = (sel, root = document) => root.querySelector(sel);
  PCC.qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  PCC.el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, v);
    });
    children.flat().forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  };

  PCC.debounce = (fn, wait = 200) => {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  PCC.toast = (msg, variant) => {
    let n = document.querySelector('.toast');
    if (!n) {
      n = document.createElement('div');
      n.className = 'toast';
      document.body.appendChild(n);
    }
    n.textContent = msg;
    n.classList.toggle('toast--gold', variant === 'gold');
    requestAnimationFrame(() => n.classList.add('show'));
    clearTimeout(n._t);
    n._t = setTimeout(() => n.classList.remove('show'), 2200);
  };

  PCC.uid = () => 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

  /* Resolve relative path depending on whether we're in /pages/ or root */
  PCC.base = () => (location.pathname.includes('/pages/') ? '../' : '');
})(window);
