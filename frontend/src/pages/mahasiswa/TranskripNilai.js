// import { fetchTranscript } from '../../api/gradeApi.js';
// import { getUser } from '../../utils/auth.js';
// import { showNotification } from '../../utils/helpers.js';

// const TranskripNilai = {
//   /**
//    * Merender struktur statis halaman.
//    */
//   render: () => {
//     return `
//       <div class="flex justify-between items-center mb-6">
//         <h1 class="text-2xl font-semibold text-gray-900">Transkrip Nilai</h1>
//       </div>
//       <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//         <table class="min-w-full divide-y divide-gray-200">
//           <thead class="bg-gray-50">
//             <tr>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode MK</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mata Kuliah</th>
//               <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">SKS</th>
//               <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai</th>
//             </tr>
//           </thead>
//           <tbody id="transkrip-body" class="bg-white divide-y divide-gray-200">
//             <tr><td colspan="5" class="text-center py-4">Memuat transkrip...</td></tr>
//           </tbody>
//         </table>
//       </div>
//       <div class="mt-4 p-4 bg-gray-50 rounded-lg flex justify-end space-x-8">
//           <div>
//               <p class="text-sm font-medium text-gray-500">Total SKS</p>
//               <p id="total-credits" class="text-2xl font-bold text-gray-900">...</p>
//           </div>
//           <div>
//               <p class="text-sm font-medium text-gray-500">Indeks Prestasi Kumulatif (IPK)</p>
//               <p id="gpa-summary" class="text-2xl font-bold text-indigo-600">...</p>
//           </div>
//       </div>
//     `;
//   },
//   /**
//    * Mengambil dan menampilkan data transkrip setelah halaman dirender.
//    */
//   after_render: async () => {
//     const user = getUser();
//     if (!user) return;

//     const tableBody = document.getElementById('transkrip-body');
//     const totalCreditsEl = document.getElementById('total-credits');
//     const gpaSummaryEl = document.getElementById('gpa-summary');

//     try {
//       const transcriptData = await fetchTranscript(user._id);
      
//       if (transcriptData && transcriptData.transcript.length > 0) {
//         tableBody.innerHTML = transcriptData.transcript.map(grade => `
//           <tr>
//             <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.semester}</td>
//             <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.course.code}</td>
//             <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${grade.course.name}</td>
//             <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">${grade.course.credits}</td>
//             <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">${grade.score}</td>
//           </tr>
//         `).join('');
//       } else {
//         tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Belum ada nilai di transkrip.</td></tr>`;
//       }

//       totalCreditsEl.textContent = transcriptData.totalCredits || 0;
//       gpaSummaryEl.textContent = transcriptData.gpa ? transcriptData.gpa.toFixed(2) : '0.00';

//     } catch (error) {
//       showNotification(error.message, true);
//       tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat transkrip.</td></tr>`;
//       totalCreditsEl.textContent = 'N/A';
//       gpaSummaryEl.textContent = 'N/A';
//     }
//   }
// };

// export default TranskripNilai;



import { fetchTranscript } from '../../api/gradeApi.js';
import { getUser } from '../../utils/auth.js';
import { showNotification } from '../../utils/helpers.js';

const TranskripNilai = {
  /**
   * Merender struktur statis halaman.
   */
  render: () => {
    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Transkrip Nilai</h1>
      </div>

      <!-- Container untuk Tampilan Tabel (Desktop) -->
      <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode MK</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mata Kuliah</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">SKS</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai</th>
            </tr>
          </thead>
          <tbody id="transkrip-table-body" class="bg-white divide-y divide-gray-200">
            <!-- Konten tabel dimuat di sini -->
          </tbody>
        </table>
      </div>

      <!-- Container untuk Tampilan Card (Mobile) -->
      <div id="transkrip-card-container" class="md:hidden space-y-4">
        <!-- Konten card dimuat di sini -->
      </div>

      <!-- Ringkasan IPK dan SKS -->
      <div class="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 class="text-lg font-semibold text-gray-800">Ringkasan Akademik</h2>
            <div class="flex items-center justify-between sm:justify-end sm:space-x-8">
                <div class="text-center sm:text-right">
                    <p class="text-sm font-medium text-gray-500">Total SKS</p>
                    <p id="total-credits" class="text-2xl font-bold text-gray-900">...</p>
                </div>
                <div class="text-center sm:text-right">
                    <p class="text-sm font-medium text-gray-500">IPK</p>
                    <p id="gpa-summary" class="text-2xl font-bold text-indigo-600">...</p>
                </div>
            </div>
        </div>
      </div>
    `;
  },
  /**
   * Mengambil dan menampilkan data transkrip setelah halaman dirender.
   */
  after_render: async () => {
    const user = getUser();
    if (!user) return;

    const tableBody = document.getElementById('transkrip-table-body');
    const cardContainer = document.getElementById('transkrip-card-container');
    const totalCreditsEl = document.getElementById('total-credits');
    const gpaSummaryEl = document.getElementById('gpa-summary');

    // Menampilkan pesan loading awal
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Memuat transkrip...</td></tr>`;
    cardContainer.innerHTML = `<div class="text-center py-4">Memuat transkrip...</div>`;

    const getGradeColor = (grade) => {
        if (grade === 'A') return 'text-green-600';
        if (grade === 'B') return 'text-blue-600';
        if (grade === 'C') return 'text-yellow-600';
        if (grade === 'D') return 'text-orange-600';
        if (grade === 'E') return 'text-red-600';
        return 'text-gray-800';
    };

    try {
      const transcriptData = await fetchTranscript(user._id);
      
      if (transcriptData && transcriptData.transcript.length > 0) {
        // Render Tabel
        tableBody.innerHTML = transcriptData.transcript.map(grade => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.semester}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.course.code}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${grade.course.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">${grade.course.credits}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold ${getGradeColor(grade.score)}">${grade.score}</td>
          </tr>
        `).join('');

        // Render Card
        cardContainer.innerHTML = transcriptData.transcript.map(grade => `
            <div class="bg-white rounded-lg shadow border border-gray-200 flex items-center p-4">
                <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-800 truncate">${grade.course.name}</p>
                    <p class="text-sm text-gray-500">${grade.course.code} &bull; Semester ${grade.semester}</p>
                </div>
                <div class="text-right ml-4 flex-shrink-0">
                    <p class="text-2xl font-bold ${getGradeColor(grade.score)}">${grade.score}</p>
                    <p class="text-xs text-gray-500">${grade.course.credits} SKS</p>
                </div>
            </div>
        `).join('');

      } else {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Belum ada nilai di transkrip.</td></tr>`;
        cardContainer.innerHTML = `<div class="text-center py-4">Belum ada nilai di transkrip.</div>`;
      }

      totalCreditsEl.textContent = transcriptData.totalCredits || 0;
      gpaSummaryEl.textContent = transcriptData.gpa ? transcriptData.gpa.toFixed(2) : '0.00';

    } catch (error) {
      showNotification(error.message, true);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat transkrip.</td></tr>`;
      cardContainer.innerHTML = `<div class="text-center py-4 text-red-500">Gagal memuat transkrip.</div>`;
      totalCreditsEl.textContent = 'N/A';
      gpaSummaryEl.textContent = 'N/A';
    }
  }
};

export default TranskripNilai;
