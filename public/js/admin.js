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
            <img src="${p.image}" alt="" />
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
