import { getUser } from '../../utils/auth.js';
import { fetchTranscript } from '../../api/gradeApi.js';

const MahasiswaDashboard = {
  /**
   * [FIXED] Merender komponen dashboard mahasiswa secara sinkron.
   * Keyword 'async' dihapus agar fungsi ini mengembalikan string HTML, bukan Promise.
   * @returns {string} String HTML untuk dashboard mahasiswa.
   */
  render: () => {
    const user = getUser();
    const userName = user ? user.name : 'Mahasiswa';

    return `
      <div class="py-4">
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard Mahasiswa</h1>
        <p class="mt-2 text-sm text-gray-700">Selamat datang, ${userName}!</p>
        
        <div class="mt-6">
            <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                    <dt class="text-sm font-medium text-gray-500 truncate">IPK (GPA)</dt>
                    <dd id="gpa-value" class="mt-1 text-3xl font-semibold text-gray-900">Loading...</dd>
                </div>
            </dl>
        </div>
      </div>
    `;
  },
  /**
   * Fungsi yang dieksekusi setelah komponen dirender.
   * Mengambil data transkrip untuk menghitung IPK.
   */
  after_render: async () => {
    const user = getUser();
    if (!user) return; // Keluar jika tidak ada user

    const gpaEl = document.getElementById('gpa-value');
    if (!gpaEl) return; // Keluar jika elemen tidak ditemukan

    try {
        const transcriptData = await fetchTranscript(user._id);
        // Menampilkan IPK atau '0.00' jika tidak ada data
        gpaEl.textContent = transcriptData.gpa ? transcriptData.gpa.toFixed(2) : '0.00';
    } catch(error) {
        console.error("Failed to fetch GPA:", error);
        gpaEl.textContent = 'N/A';
    }
  }
};

export default MahasiswaDashboard;
