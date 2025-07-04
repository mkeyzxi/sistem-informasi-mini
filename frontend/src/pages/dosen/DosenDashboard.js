import { getUser } from '../../utils/auth.js';
import { fetchCourses } from '../../api/courseApi.js';

const DosenDashboard = {
  /**
   * Merender komponen dashboard dosen secara sinkron.
   * @returns {string} String HTML untuk dashboard dosen.
   */
  render: () => {
    const user = getUser();
    const userName = user ? user.name : 'Dosen';

    return `
      <div class="py-4">
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard Dosen</h1>
        <p class="mt-2 text-sm text-gray-700">Selamat datang, ${userName}!</p>
        <p class="mt-1 text-sm text-gray-700">Anda dapat mengelola jadwal mengajar dan nilai mahasiswa melalui menu di samping.</p>
        
        <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900">Ringkasan Anda</h3>
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">Mata Kuliah Diampu</dt>
                    <dd id="total-courses-dosen" class="mt-1 text-3xl font-semibold text-gray-900">Loading...</dd>
                </div>
            </dl>
        </div>
      </div>
    `;
  },
  /**
   * Fungsi yang dieksekusi setelah komponen dirender.
   * Mengambil data mata kuliah yang diampu oleh dosen.
   */
  after_render: async () => {
    const user = getUser();
    if (!user) return; // Keluar jika tidak ada user

    const coursesEl = document.getElementById('total-courses-dosen');
    if (!coursesEl) return; // Keluar jika elemen tidak ditemukan

    try {
        const allCourses = await fetchCourses();
        // Filter mata kuliah berdasarkan ID dosen
        const myCourses = allCourses.filter(c => c.lecturer && c.lecturer._id === user._id);
        coursesEl.textContent = myCourses.length;
    } catch(e) {
        console.error("Failed to fetch lecturer courses", e);
        coursesEl.textContent = 'N/A';
    }
  },
};

export default DosenDashboard;
