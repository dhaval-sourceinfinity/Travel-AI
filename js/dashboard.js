// dashboard.js — interactive behaviors for the Agents Overview Dashboard
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initSidebar();
  initModals();
  initExportLogs();
  initMobileDrawer();
});

/** Live search filtering for Agent Directory */
function initSearch() {
  const searchInput = document.getElementById('agent-search-input');
  const tableRows = document.querySelectorAll('.agent-table__row');
  const emptyRow = document.getElementById('table-empty-row');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    tableRows.forEach((row) => {
      const name = row.querySelector('.agent-name')?.textContent.toLowerCase() || '';
      const email = row.querySelector('.agent-email')?.textContent.toLowerCase() || '';
      const status = row.querySelector('.status-pill')?.textContent.toLowerCase() || '';

      const matches = name.includes(query) || email.includes(query) || status.includes(query);
      if (matches) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (emptyRow) {
      emptyRow.style.display = visibleCount === 0 ? 'table-row' : 'none';
    }
  });
}

/** Sidebar menu item toggle */
function initSidebar() {
  const sidebarBtns = document.querySelectorAll('.dashboard-sidebar__btn');
  sidebarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
}

/** Modals for Add & Edit Agent */
function initModals() {
  const addModal = document.getElementById('modal-add-agent');
  const editModal = document.getElementById('modal-edit-agent');
  const btnOpenAdd = document.getElementById('btn-add-agent');
  const formAdd = document.getElementById('form-add-agent');
  const formEdit = document.getElementById('form-edit-agent');

  if (window.initCustomSelects) {
    window.initCustomSelects(document);
  }

  if (btnOpenAdd && addModal) {
    btnOpenAdd.addEventListener('click', () => {
      const addStatus = document.getElementById('add-agent-status');
      if (addStatus) {
        addStatus.value = 'Active';
        addStatus.dispatchEvent(new Event('change', { bubbles: true }));
      }
      addModal.showModal();
    });
  }

  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      addModal?.close();
      editModal?.close();
    });
  });

  // Edit buttons on rows
  document.querySelectorAll('.btn-action-edit').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.agent-table__row');
      if (!row || !editModal) return;

      const name = row.querySelector('.agent-name')?.textContent || '';
      const email = row.querySelector('.agent-email')?.textContent || '';
      const status = row.querySelector('.status-pill')?.textContent.trim() || 'Active';
      const packages = row.querySelector('.agent-packages-count')?.textContent || '0';

      const editName = document.getElementById('edit-agent-name');
      const editEmail = document.getElementById('edit-agent-email');
      const editStatus = document.getElementById('edit-agent-status');
      const editPackages = document.getElementById('edit-agent-packages');

      if (editName) editName.value = name;
      if (editEmail) editEmail.value = email;
      if (editStatus) {
        editStatus.value = status;
        editStatus.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (editPackages) editPackages.value = packages;

      editModal.showModal();
    });
  });

  // Handle Add Agent submit
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('add-agent-name')?.value || 'New Agent';
      const email = document.getElementById('add-agent-email')?.value || 'agent@travelai.com';
      const status = document.getElementById('add-agent-status')?.value || 'Active';
      const packages = document.getElementById('add-agent-packages')?.value || '0';

      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AG';
      const statusClass = status.toLowerCase() === 'active' ? 'status-pill--active' :
                          status.toLowerCase() === 'suspended' ? 'status-pill--suspended' : 'status-pill--expired';

      const tbody = document.querySelector('.agent-table__body');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'agent-table__row';
        tr.innerHTML = `
          <td class="agent-table__td">
            <div class="agent-profile-cell">
              <span class="agent-initials-avatar">${initials}</span>
              <span class="agent-name">${name}</span>
            </div>
          </td>
          <td class="agent-table__td agent-email">${email}</td>
          <td class="agent-table__td">
            <span class="status-pill ${statusClass}">${status}</span>
          </td>
          <td class="agent-table__td agent-table__td--center agent-packages-count">${packages}</td>
          <td class="agent-table__td agent-meta-text">Just now</td>
          <td class="agent-table__td agent-meta-text">Today</td>
          <td class="agent-table__td agent-table__td--right">
            <button type="button" class="btn-action-edit" aria-label="Edit agent ${name}">
              <img src="assets/icons/dashboard/icon-edit.svg" alt="" width="16" height="16" />
            </button>
          </td>
        `;
        tbody.prepend(tr);
        // Wire up edit button for newly added row
        tr.querySelector('.btn-action-edit')?.addEventListener('click', () => {
          const editStatus = document.getElementById('edit-agent-status');
          document.getElementById('edit-agent-name').value = name;
          document.getElementById('edit-agent-email').value = email;
          if (editStatus) {
            editStatus.value = status;
            editStatus.dispatchEvent(new Event('change', { bubbles: true }));
          }
          document.getElementById('edit-agent-packages').value = packages;
          editModal?.showModal();
        });
      }

      showToast(`Agent ${name} created successfully`);
      addModal.close();
      formAdd.reset();
      const addStatus = document.getElementById('add-agent-status');
      if (addStatus) {
        addStatus.value = 'Active';
        addStatus.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  // Handle Edit Agent submit
  if (formEdit) {
    formEdit.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-agent-name')?.value;
      showToast(`Agent profile updated`);
      editModal.close();
    });
  }
}

/** Export Logs feedback toast */
function initExportLogs() {
  const btnExport = document.getElementById('btn-export-logs');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      showToast('Exporting activity logs... Download will start shortly.');
    });
  }
}

/** Toast helper */
function showToast(message) {
  let toast = document.getElementById('dashboard-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dashboard-toast';
    toast.className = 'dashboard-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3500);
}

/** Mobile menu drawer toggle */
function initMobileDrawer() {
  const burger = document.getElementById('dashboard-burger');
  const drawer = document.getElementById('dashboard-mobile-drawer');
  if (!burger || !drawer) return;

  burger.addEventListener('click', () => {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isExpanded));
    drawer.classList.toggle('is-active', !isExpanded);
  });
}
