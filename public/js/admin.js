/* Admin login + dashboard (rate updater, orders table) */
(function (global) {
  const PCC = global.PCC || (global.PCC = {});

  /* ============ LOGIN ============ */
  PCC.initAdminLogin = function () {
    const form = document.getElementById('adminLoginForm');
    const err  = document.getElementById('adminLoginError');
    if (!form) return;

    // Already logged in? Skip straight to dashboard.
    if (PCC.storage.getAdmin()) { location.href = 'dashboard.html'; return; }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.textContent = '';
      const fd = new FormData(form);
      const username = String(fd.get('username') || '').trim();
      const password = String(fd.get('password') || '');
      if (!username || !password) { err.textContent = 'Enter username and password'; return; }

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Signing in…';

      let res = await PCC.api.login({ username, password }).catch((e) => ({ ok: false, error: String(e) }));

      // Only allow local admin/admin123 fallback when the backend is completely
      // unreachable (network / not deployed). If the server responded with
      // "invalid credentials", respect that answer.
      const backendReachable = res && (res.ok || res.error === 'Invalid credentials' || (res.error || '').toLowerCase().includes('admin sheet'));
      if (!res.ok && !backendReachable && username.toLowerCase() === 'admin' && password === 'admin123') {
        res = { ok: true, token: 'local-fallback', username: 'admin', role: 'admin', local: true };
      }
      if (res.ok) {
        PCC.storage.saveAdmin({ token: res.token, username: res.username, role: res.role, local: !!res.local });
        location.href = 'dashboard.html';
      } else {
        err.textContent = res.error || 'Login failed.';
        btn.disabled = false; btn.textContent = 'Sign in';
      }
    });
  };

  /* ============ DASHBOARD ============ */
  PCC.initAdminDashboard = function () {
    const admin = PCC.storage.getAdmin();
    if (!admin) { location.href = 'login.html'; return; }

    document.getElementById('adminWho').textContent = admin.username;
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.textContent = admin.username;
    document.getElementById('adminLogout').addEventListener('click', () => {
      PCC.storage.clearAdmin();
      location.href = 'login.html';
    });

    const tabsNav = document.getElementById('adminTabs');
    function activateTab(name) {
      document.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
      document.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
      if (tabsNav) tabsNav.hidden = (name === 'welcome');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });
    document.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => activateTab(btn.dataset.goto));
    });
    activateTab('welcome');

    initRatesTab();
    initOrdersTab(admin.token);
  };

  /* ---- Product manager ---- */
  PCC.initAdminProducts = async function () {
    const admin = PCC.storage.getAdmin();
    if (!admin) { location.href = 'login.html'; return; }

    const form = document.getElementById('productForm');
    const list = document.getElementById('adminProductsList');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('productImagePreview');
    const formTitle = document.getElementById('productFormTitle');
    const cancelBtn = document.getElementById('productCancel');
    const error = document.getElementById('productFormError');
    let editingId = null;
    let selectedImage = '';

    document.getElementById('adminWho').textContent = admin.username;
    document.getElementById('adminLogout').addEventListener('click', () => {
      PCC.storage.clearAdmin(); location.href = 'login.html';
    });
    document.getElementById('adminProductsBack').addEventListener('click', () => { location.href = 'dashboard.html'; });

    CATEGORIES.forEach((category) => {
      document.getElementById('productCategory').appendChild(PCC.el('option', { value: category.slug }, category.name));
    });

    imageInput.addEventListener('input', () => {
      selectedImage = imageInput.value.trim();
      imagePreview.src = PCC.asset(selectedImage);
      imagePreview.hidden = !selectedImage;
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault(); error.textContent = '';
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const description = String(data.get('description') || '').trim();
      const weight = Number(data.get('weight'));
      const image = selectedImage || (editingId ? PCC.getProduct(editingId)?.image : '');
      if (!name || !description || !image || !Number.isFinite(weight) || weight <= 0) {
        error.textContent = 'Add a name, description, image, and weight greater than zero.'; return;
      }
      const metal = data.get('metal');
      const product = { id: editingId || '', category: data.get('category'), name, description, image, metal, weight };
      try {
        const result = await PCC.api.saveProduct(admin.token, product);
        if (!result?.ok) throw new Error(result?.error || 'Could not save product');
        PCC.setSharedProducts(result.products || []);
        resetForm(); renderList(result.products);
        PCC.toast(editingId ? 'Product updated' : 'Product uploaded', 'gold');
      } catch (saveError) {
        error.textContent = saveError.message === 'Unknown action: saveProduct'
          ? 'The Apps Script deployment is outdated. Save and redeploy apps-script/Code.gs, then try again.'
          : saveError.message === 'Product image must be a public HTTPS URL'
            ? 'The Apps Script deployment is outdated. Redeploy the latest apps-script/Code.gs to allow assets/... image paths.'
          : saveError.message === 'Product image must be a public HTTPS URL or a relative asset path'
            ? 'Use an HTTPS image URL or a relative asset path such as assets/products/rings/item.jpg.'
          : (saveError.message || 'Could not save this product.');
      }
    });

    cancelBtn.addEventListener('click', resetForm);
    await PCC.loadSharedProducts();
    renderList();

    function renderList(items = PCC.getProducts()) {
      document.getElementById('adminProductsMeta').textContent = `${items.length} uploaded item${items.length === 1 ? '' : 's'}`;
      list.innerHTML = '';
      if (!items.length) { list.appendChild(PCC.el('p', { class: 'admin-products-empty' }, 'No uploaded products yet.')); return; }
      items.forEach((item) => {
        const category = PCC.getCategory(item.category);
        const card = PCC.el('article', { class: 'admin-product-row' });
        card.appendChild(PCC.el('img', { src: PCC.asset(item.image), alt: item.name }));
        const meta = PCC.el('div', { class: 'admin-product-row__meta' });
        meta.appendChild(PCC.el('h3', {}, item.name));
        meta.appendChild(PCC.el('p', {}, `${category?.name || item.category} · ${item.goldWeight ? item.goldWeight + ' g gold' : item.silverWeight + ' g silver'}`));
        card.appendChild(meta);
        const actions = PCC.el('div', { class: 'admin-product-row__actions' });
        const edit = PCC.el('button', { type: 'button', class: 'btn btn--outline btn--sm' }, 'Edit');
        edit.addEventListener('click', () => startEdit(item));
        const remove = PCC.el('button', { type: 'button', class: 'btn btn--dark btn--sm' }, 'Delete');
        remove.addEventListener('click', () => {
          if (!confirm(`Delete ${item.name}?`)) return;
          PCC.api.deleteProduct(admin.token, item.id).then((result) => {
            if (!result?.ok) throw new Error(result?.error || 'Could not delete product');
            PCC.setSharedProducts(result.products || []);
            renderList(result.products); PCC.toast('Product deleted');
          }).catch((deleteError) => { error.textContent = deleteError.message; });
        });
        actions.append(edit, remove); card.appendChild(actions); list.appendChild(card);
      });
    }

    function startEdit(item) {
      editingId = item.id; selectedImage = item.image;
      formTitle.textContent = 'Edit product';
      form.name.value = item.name; form.description.value = item.description;
      form.category.value = item.category;
      form.metal.value = item.productMetal || (item.silverWeight ? 'silver' : 'gold');
      form.weight.value = item.productWeight || item.silverWeight || item.goldWeight;
      imageInput.value = item.image || '';
      imagePreview.src = PCC.asset(item.image); imagePreview.hidden = false; cancelBtn.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function resetForm() {
      editingId = null; selectedImage = ''; form.reset(); formTitle.textContent = 'Upload a product';
      imagePreview.hidden = true; imagePreview.removeAttribute('src'); cancelBtn.hidden = true; error.textContent = '';
    }
  };

  /* ---- Rates tab ---- */
  function initRatesTab() {
    const form  = document.getElementById('ratesForm');
    const gold  = document.getElementById('rateGold');
    const silv  = document.getElementById('rateSilver');
    const make  = document.getElementById('rateMaking');
    const meta  = document.getElementById('ratesMeta');
    const prev  = document.getElementById('ratesPreview');

    // Pull latest server-side rates so admin always edits the shared value.
    PCC.pricing.refreshFromServer().then(() => {
      const r = PCC.pricing.rates();
      gold.value = r.gold; silv.value = r.silver; make.value = r.makingCharges;
      renderMeta(r); renderPreview();
    });

    const r = PCC.pricing.rates();
    gold.value = r.gold; silv.value = r.silver; make.value = r.makingCharges;
    renderMeta(r); renderPreview();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Saving…';
      const admin = PCC.storage.getAdmin() || {};
      const payload = {
        gold:          Number(gold.value) || 0,
        silver:        Number(silv.value) || 0,
        makingCharges: Number(make.value) || 0,
      };
      try {
        await PCC.pricing.setRates(payload, admin.token);
        renderMeta(PCC.pricing.rates()); renderPreview();
        if (admin.token === 'local-fallback') {
          PCC.toast('Saved locally — deploy Apps Script for cross-device sync', 'gold');
        } else {
          PCC.toast('Rates updated for all visitors', 'gold');
        }
      } catch (err2) {
        PCC.toast('Saved locally only: ' + err2.message);
      } finally {
        btn.disabled = false; btn.textContent = 'Save & apply';
      }
    });

    [gold, silv, make].forEach((i) => i.addEventListener('input', renderPreview));

    function renderMeta(r) {
      meta.textContent = r.updatedAt
        ? `Last updated: ${new Date(r.updatedAt).toLocaleString()}`
        : 'Not yet saved on this browser — using defaults.';
    }

    function renderPreview() {
      const overrideRates = {
        gold:          Number(gold.value) || 0,
        silver:        Number(silv.value) || 0,
        makingCharges: Number(make.value) || 0,
      };
      const sample = PRODUCTS.slice(0, 6);
      prev.innerHTML = sample.map((p) => {
        const gv = (p.goldWeight   || 0) * overrideRates.gold;
        const sv = (p.silverWeight || 0) * overrideRates.silver;
        const total = Math.round(gv + sv + overrideRates.makingCharges);
        return `
          <div class="rate-preview__row">
            <img src="${PCC.asset(p.image)}" alt="" />
            <div class="rate-preview__meta">
              <strong>${p.name}</strong>
              <small>${p.goldWeight || 0}g gold${p.silverWeight ? ` · ${p.silverWeight}g silver` : ''}</small>
            </div>
            <div class="rate-preview__price">${PCC.formatPrice(total)}</div>
          </div>`;
      }).join('');
    }
  }

  /* ---- Orders tab ---- */
  function initOrdersTab(token) {
    const refresh = document.getElementById('ordersRefresh');
    const search  = document.getElementById('ordersSearch');
    const tbody   = document.getElementById('ordersBody');
    const meta    = document.getElementById('ordersMeta');
    const exportBtn = document.getElementById('ordersExport');
    let rows = [];

    async function load() {
      tbody.innerHTML = `<tr><td colspan="8" class="orders-empty">Loading…</td></tr>`;
      const res = await PCC.api.getOrders(token).catch((e) => ({ ok: false, error: String(e) }));
      if (!res.ok) {
        const hint = token === 'local-fallback'
          ? 'You are signed in with the local fallback. Deploy the Apps Script and run seedAdmin() to load real orders.'
          : (res.error || 'failed');
        tbody.innerHTML = `<tr><td colspan="8" class="orders-empty">Could not load orders — ${hint}</td></tr>`;
        meta.textContent = ''; return;
      }
      rows = res.rows || [];
      meta.textContent = `${rows.length} order${rows.length === 1 ? '' : 's'} · fetched ${new Date().toLocaleTimeString()}`;
      draw();
    }

    function draw() {
      const q = (search.value || '').trim().toLowerCase();
      const filtered = q
        ? rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)))
        : rows;
      if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="orders-empty">No orders${q ? ' match your search' : ' yet'}.</td></tr>`;
        return;
      }
      tbody.innerHTML = filtered.map((r) => {
        const mobile = String(r['Mobile'] ?? '').replace(/\s+/g, '');
        const qty = Number(r['Quantity']) || 0;
        const total = Number(r['Total']) || 0;
        return `
        <tr>
          <td data-label="Order ID">${escape(r['Order ID'])}</td>
          <td data-label="Date">${formatDate(r['Date'])}</td>
          <td data-label="Customer">${escape(r['Customer Name'])}</td>
          <td data-label="Mobile" class="orders-mobile"><a href="tel:${escape(mobile)}">${escape(mobile)}</a></td>
          <td data-label="Products" class="orders-products" title="${escape(r['Products'])}">${escape(r['Products'])}</td>
          <td data-label="Qty" class="num">${qty}</td>
          <td data-label="Total" class="num">${PCC.formatPrice(total)}</td>
          <td data-label="Status"><span class="badge badge--${statusClass(r['Status'])}">${escape(r['Status'] || 'Pending')}</span></td>
        </tr>`;
      }).join('');
    }

    function exportCsv() {
      if (!rows.length) { PCC.toast('Nothing to export'); return; }
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(',')].concat(
        rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
    }

    refresh.addEventListener('click', load);
    exportBtn.addEventListener('click', exportCsv);
    search.addEventListener('input', PCC.debounce(draw, 120));
    load();
  }

  function statusClass(s) {
    s = String(s || '').toLowerCase();
    if (s.includes('deliver')) return 'ok';
    if (s.includes('ship'))    return 'info';
    if (s.includes('cancel'))  return 'err';
    return 'warn';
  }
  function escape(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function formatDate(v) {
    if (!v) return '';
    const d = new Date(v);
    return isNaN(d) ? escape(v) : d.toLocaleString();
  }
})(window);
