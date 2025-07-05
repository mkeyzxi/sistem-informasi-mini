import { fetchAuditLogs } from '../../api/auditLogApi.js';
import { formatDate, showNotification } from '../../utils/helpers.js';

const AuditLogs = {
  render: () => {
    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Audit Logs</h1>
      </div>

      <!-- Container untuk Tampilan Tabel (Desktop) -->
      <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody id="logs-table-body" class="bg-white divide-y divide-gray-200">
            <!-- Konten tabel akan dimuat di sini -->
          </tbody>
        </table>
      </div>

      <!-- Container untuk Tampilan Card (Mobile) -->
      <div id="logs-card-container" class="md:hidden space-y-4">
        <!-- Konten card akan dimuat di sini -->
      </div>
    `;
  },
  after_render: async () => {
    const tableBody = document.getElementById('logs-table-body');
    const cardContainer = document.getElementById('logs-card-container');
    
    // Menampilkan pesan loading awal untuk kedua view
    const loadingHTML = `<tr><td colspan="5" class="text-center py-4">Memuat logs...</td></tr>`;
    const loadingCardHTML = `<div class="text-center py-4">Memuat logs...</div>`;
    tableBody.innerHTML = loadingHTML;
    cardContainer.innerHTML = loadingCardHTML;

    try {
      const logs = await fetchAuditLogs();
      
      if (logs.length > 0) {
        // 1. Render untuk Tampilan Tabel (Desktop)
        tableBody.innerHTML = logs.map(log => `
          <tr data-id="${log._id}">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(log.createdAt)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${log.user ? log.user.name : 'System'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                ${log.action}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${log.entity} (${log.entityId})</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                IP: ${log.ipAddress || 'N/A'}
            </td>
          </tr>
        `).join('');

        // 2. Render untuk Tampilan Card (Mobile)
        cardContainer.innerHTML = logs.map(log => `
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div class="flex justify-between items-start mb-2">
                <p class="text-sm text-gray-600">${formatDate(log.createdAt)}</p>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  ${log.action}
                </span>
            </div>
            <div class="space-y-2">
                <div>
                    <p class="text-xs font-medium text-gray-500">User</p>
                    <p class="text-sm font-semibold text-gray-900">${log.user ? log.user.name : 'System'}</p>
                </div>
                 <div>
                    <p class="text-xs font-medium text-gray-500">Entity</p>
                    <p class="text-sm text-gray-700">${log.entity} (${log.entityId})</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500">Details</p>
                    <p class="text-sm text-gray-700">IP: ${log.ipAddress || 'N/A'}</p>
                </div>
            </div>
          </div>
        `).join('');

      } else {
        // Menampilkan pesan jika tidak ada data
        const noDataHTML = `<tr><td colspan="5" class="text-center py-4">Tidak ada log ditemukan.</td></tr>`;
        const noDataCardHTML = `<div class="text-center py-4">Tidak ada log ditemukan.</div>`;
        tableBody.innerHTML = noDataHTML;
        cardContainer.innerHTML = noDataCardHTML;
      }
    } catch (error) {
      showNotification(error.message, true);
      // Menampilkan pesan error
      const errorHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat logs.</td></tr>`;
      const errorCardHTML = `<div class="text-center py-4 text-red-500">Gagal memuat logs.</div>`;
      tableBody.innerHTML = errorHTML;
      cardContainer.innerHTML = errorCardHTML;
    }
  },
};

export default AuditLogs;
