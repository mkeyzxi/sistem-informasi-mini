import { fetchCourses } from '../../api/courseApi.js';
import { fetchGradesByCourse, addGrade, updateGrade } from '../../api/gradeApi.js';
import { getUser } from '../../utils/auth.js';
import { showNotification } from '../../utils/helpers.js';
import Modal from '../../components/Modal.js';

let myCourses = [];

const KelolaNilai = {
  /**
   * Merender struktur statis halaman.
   */
  render: () => {
    return `
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Kelola Nilai Mahasiswa</h1>
        <div class="mt-4">
          <label for="course-select" class="block text-sm font-medium text-gray-700">Pilih Mata Kuliah:</label>
          <select id="course-select" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="">-- Memuat mata kuliah... --</option>
          </select>
        </div>
      </div>
      
      <div id="grades-container" class="hidden">
        <div class="flex justify-between items-center mb-4">
            <h2 id="table-title" class="text-xl font-semibold text-gray-800"></h2>
        </div>
        <!-- Container Tabel (Desktop) -->
        <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mahasiswa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai (A-E)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody id="grades-table-body" class="bg-white divide-y divide-gray-200">
              <!-- Rows will be injected here -->
            </tbody>
          </table>
        </div>
        <!-- Container Card (Mobile) -->
        <div id="grades-card-container" class="md:hidden space-y-4">
            <!-- Cards will be injected here -->
        </div>
      </div>
    `;
  },
  /**
   * Mengambil data dan menambahkan event listener setelah halaman dirender.
   */
  after_render: async () => {
    const user = getUser();
    if (!user) return;

    const pageContainer = document.querySelector('.px-4.sm\\:px-6.md\\:px-8');
    const courseSelect = document.getElementById('course-select');
    const gradesContainer = document.getElementById('grades-container');
    const tableBody = document.getElementById('grades-table-body');
    const cardContainer = document.getElementById('grades-card-container');
    const tableTitle = document.getElementById('table-title');

    const renderGrades = (studentGrades) => {
        if (studentGrades.length === 0) {
            const noDataMsg = `<tr><td colspan="4" class="text-center py-4">Tidak ada mahasiswa terdaftar di mata kuliah ini.</td></tr>`;
            tableBody.innerHTML = noDataMsg;
            cardContainer.innerHTML = `<div class="text-center py-4">Tidak ada mahasiswa terdaftar di mata kuliah ini.</div>`;
            return;
        }

        const gradeOptions = (score) => {
            const options = ['A', 'B', 'C', 'D', 'E'];
            // Tambahkan opsi kosong jika belum ada nilai
            if (!score) {
                options.unshift("");
            }
            return options.map(g => `<option value="${g}" ${score === g ? 'selected' : ''}>${g || 'Pilih Nilai'}</option>`).join('');
        }

        // Render Tabel
        tableBody.innerHTML = studentGrades.map(grade => `
            <tr data-student-id="${grade.student._id}" data-grade-id="${grade._id || ''}">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.student.studentId}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${grade.student.name}</td>
              <td class="px-6 py-4">
                <select class="grade-select p-1 border rounded-md">${gradeOptions(grade.score)}</select>
              </td>
              <td class="px-6 py-4">
                <button class="save-grade-btn text-indigo-600 hover:text-indigo-900">Simpan</button>
              </td>
            </tr>
        `).join('');
        
        // Render Card
        cardContainer.innerHTML = studentGrades.map(grade => `
            <div class="bg-white rounded-lg shadow border border-gray-200" data-student-id="${grade.student._id}" data-grade-id="${grade._id || ''}">
                <div class="p-4">
                    <div>
                        <p class="font-bold text-gray-800">${grade.student.name}</p>
                        <p class="text-sm text-gray-500">${grade.student.studentId}</p>
                    </div>
                    <div class="mt-4">
                        <label class="block text-xs font-medium text-gray-600">Nilai</label>
                        <select class="grade-select mt-1 w-full p-1 border rounded-md">${gradeOptions(grade.score)}</select>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 flex justify-end">
                    <button class="save-grade-btn text-sm font-medium text-indigo-600 hover:text-indigo-900">Simpan</button>
                </div>
            </div>
        `).join('');
    };
    
    const loadAndRenderGrades = async (courseId) => {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Memuat data nilai...</td></tr>`;
        cardContainer.innerHTML = `<div class="text-center py-4">Memuat data nilai...</div>`;
        gradesContainer.classList.remove('hidden');
        tableTitle.textContent = `Nilai untuk: ${courseSelect.options[courseSelect.selectedIndex].text}`;

        try {
            const studentGrades = await fetchGradesByCourse(courseId);
            renderGrades(studentGrades);
        } catch (error) {
            showNotification(error.message, true);
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Gagal memuat data nilai.</td></tr>`;
            cardContainer.innerHTML = `<div class="text-center py-4 text-red-500">Gagal memuat data nilai.</div>`;
        }
    };
    
    // Mengisi dropdown mata kuliah
    try {
        const allCourses = await fetchCourses();
        myCourses = allCourses.filter(c => c.lecturer && c.lecturer._id === user._id);
        courseSelect.innerHTML = `
            <option value="">-- Pilih Mata Kuliah --</option>
            ${myCourses.map(c => `<option value="${c._id}">${c.name}</option>`).join('')}
        `;
    } catch (error) {
        showNotification(error.message, true);
        courseSelect.innerHTML = `<option value="">Gagal memuat data</option>`;
    }

    courseSelect.addEventListener('change', (e) => {
      const courseId = e.target.value;
      if (!courseId) {
        gradesContainer.classList.add('hidden');
        return;
      }
      loadAndRenderGrades(courseId);
    });

    pageContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('save-grade-btn')) {
        const parentElement = e.target.closest('[data-student-id]');
        if (!parentElement) return;

        const gradeId = parentElement.dataset.gradeId;
        const studentId = parentElement.dataset.studentId;
        const score = parentElement.querySelector('.grade-select').value;
        const courseId = courseSelect.value;

        if (!score) {
          showNotification('Harap pilih nilai untuk disimpan.', true);
          return;
        }

        try {
          e.target.textContent = 'Menyimpan...';
          e.target.disabled = true;

          if (gradeId) {
            // Jika gradeId ada, perbarui nilai yang sudah ada
            await updateGrade(gradeId, { score });
            showNotification('Nilai berhasil diperbarui.');
          } else {
            // Jika gradeId tidak ada, buat nilai baru
            const gradeData = { student: studentId, course: courseId, score };
            await addGrade(gradeData);
            showNotification('Nilai berhasil ditambahkan.');
            // Muat ulang data untuk mendapatkan gradeId yang baru
            await loadAndRenderGrades(courseId);
          }
        } catch (error) {
          showNotification(error.message, true);
        } finally {
            e.target.textContent = 'Simpan';
            e.target.disabled = false;
        }
      }
    });
  }
};

export default KelolaNilai;
