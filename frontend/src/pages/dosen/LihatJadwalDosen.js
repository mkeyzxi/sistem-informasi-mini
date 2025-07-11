import { fetchSchedules } from '../../api/scheduleApi.js';
import { getUser } from '../../utils/auth.js';
import { showNotification } from '../../utils/helpers.js';

const LihatJadwalDosen = {
  /**
   * Merender struktur statis halaman.
   */
  render: () => {
    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Jadwal Mengajar Anda</h1>
      </div>
      
      <!-- Container untuk Tampilan Tabel (Desktop) -->
      <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hari</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Kuliah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
            </tr>
          </thead>
          <tbody id="jadwal-dosen-table-body" class="bg-white divide-y divide-gray-200">
            <!-- Konten tabel dimuat di sini -->
          </tbody>
        </table>
      </div>

      <!-- Container untuk Tampilan Card (Mobile) -->
      <div id="jadwal-dosen-card-container" class="md:hidden space-y-4">
        <!-- Konten card dimuat di sini -->
      </div>
    `;
  },
  /**
   * Mengambil dan menampilkan jadwal setelah halaman dirender.
   */
  after_render: async () => {
    const user = getUser();
    if (!user) return;
    
    const tableBody = document.getElementById('jadwal-dosen-table-body');
    const cardContainer = document.getElementById('jadwal-dosen-card-container');

    tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Memuat jadwal...</td></tr>`;
    cardContainer.innerHTML = `<div class="text-center py-4">Memuat jadwal...</div>`;

    try {
      const allSchedules = await fetchSchedules();
      const schedules = allSchedules.filter(s => s.course && s.course.lecturer && s.course.lecturer._id === user._id);
      
      if (schedules.length > 0) {
        // Render Tabel
        tableBody.innerHTML = schedules.map(schedule => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${schedule.day}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.time}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.course.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.room}</td>
          </tr>
        `).join('');

        // Render Card
        cardContainer.innerHTML = schedules.map(schedule => {
            const dayColors = {
                'Senin': 'border-blue-400',
                'Selasa': 'border-green-400',
                'Rabu': 'border-yellow-400',
                'Kamis': 'border-purple-400',
                'Jumat': 'border-pink-400',
                'Sabtu': 'border-red-400',
            };
            const colorClass = dayColors[schedule.day] || 'border-gray-400';

            return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${colorClass}">
                <div class="p-4">
                    <p class="font-bold text-gray-800 text-lg truncate">${schedule.course.name}</p>
                    <p class="text-sm text-gray-500 mb-4">${schedule.course.code}</p>
                    
                    <div class="space-y-3 text-sm">
                        <div class="flex items-center text-gray-700">
                            <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span class="font-semibold">${schedule.day}</span>
                        </div>
                        <div class="flex items-center text-gray-700">
                            <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>${schedule.time}</span>
                        </div>
                        <div class="flex items-center text-gray-700">
                            <svg class="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>Ruangan: ${schedule.room}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
      } else {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Tidak ada jadwal mengajar.</td></tr>`;
        cardContainer.innerHTML = `<div class="text-center py-4">Tidak ada jadwal mengajar.</div>`;
      }
    } catch (error) {
      showNotification(error.message, true);
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Gagal memuat jadwal.</td></tr>`;
      cardContainer.innerHTML = `<div class="text-center py-4 text-red-500">Gagal memuat jadwal.</div>`;
    }
  }
};

export default LihatJadwalDosen;
