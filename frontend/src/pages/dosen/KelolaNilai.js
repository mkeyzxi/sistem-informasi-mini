



// import { fetchCourses } from '../../api/courseApi.js';
// import { fetchGradesByCourse, addGrade, updateGrade } from '../../api/gradeApi.js';
// import { getUser } from '../../utils/auth.js';
// import { showNotification } from '../../utils/helpers.js';
// import Modal from '../../components/Modal.js';

// let myCourses = [];

// const KelolaNilai = {
//   /**
//    * Merender struktur statis halaman.
//    */
//   render: () => {
//     return `
//       <div class="mb-6">
//         <h1 class="text-2xl font-semibold text-gray-900">Kelola Nilai Mahasiswa</h1>
//         <div class="mt-4">
//           <label for="course-select" class="block text-sm font-medium text-gray-700">Pilih Mata Kuliah:</label>
//           <select id="course-select" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
//             <option value="">-- Memuat mata kuliah... --</option>
//           </select>
//         </div>
//       </div>
      
//       <div id="grades-container" class="hidden">
//         <div class="flex justify-between items-center mb-4">
//             <h2 id="table-title" class="text-xl font-semibold text-gray-800"></h2>
//             <button id="add-grade-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
//               Input Nilai Baru
//             </button>
//         </div>
//         <!-- Container Tabel (Desktop) -->
//         <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//           <table class="min-w-full divide-y divide-gray-200">
//             <thead class="bg-gray-50">
//               <tr>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mahasiswa</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai (A-E)</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
//               </tr>
//             </thead>
//             <tbody id="grades-table-body" class="bg-white divide-y divide-gray-200">
//               <!-- Rows will be injected here -->
//             </tbody>
//           </table>
//         </div>
//         <!-- Container Card (Mobile) -->
//         <div id="grades-card-container" class="md:hidden space-y-4">
//             <!-- Cards will be injected here -->
//         </div>
//       </div>
//     `;
//   },
//   /**
//    * Mengambil data dan menambahkan event listener setelah halaman dirender.
//    */
//   after_render: async () => {
//     const user = getUser();
//     if (!user) return;

//     const pageContainer = document.querySelector('.px-4.sm\\:px-6.md\\:px-8');
//     const courseSelect = document.getElementById('course-select');
//     const gradesContainer = document.getElementById('grades-container');
//     const tableBody = document.getElementById('grades-table-body');
//     const cardContainer = document.getElementById('grades-card-container');
//     const tableTitle = document.getElementById('table-title');
//     const addGradeBtn = document.getElementById('add-grade-btn');

//     const renderGrades = (existingGrades) => {
//         if (existingGrades.length === 0) {
//             tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Belum ada nilai yang diinput untuk mata kuliah ini.</td></tr>`;
//             cardContainer.innerHTML = `<div class="text-center py-4">Belum ada nilai yang diinput untuk mata kuliah ini.</div>`;
//             return;
//         }

//         const gradeOptions = (score) => ['A', 'B', 'C', 'D', 'E']
//             .map(g => `<option value="${g}" ${score === g ? 'selected' : ''}>${g}</option>`).join('');

//         // Render Tabel
//         tableBody.innerHTML = existingGrades.map(grade => `
//             <tr data-student-id="${grade.student._id}" data-grade-id="${grade._id}">
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.student.studentId}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${grade.student.name}</td>
//               <td class="px-6 py-4">
//                   <input type="number" value="${grade.semester || ''}" placeholder="e.g. 1" class="semester-input w-20 p-1 border rounded-md">
//               </td>
//               <td class="px-6 py-4">
//                 <select class="grade-select p-1 border rounded-md">${gradeOptions(grade.score)}</select>
//               </td>
//               <td class="px-6 py-4">
//                 <button class="save-grade-btn text-indigo-600 hover:text-indigo-900">Update</button>
//               </td>
//             </tr>
//         `).join('');
        
//         // Render Card
//         cardContainer.innerHTML = existingGrades.map(grade => `
//             <div class="bg-white rounded-lg shadow border border-gray-200" data-student-id="${grade.student._id}" data-grade-id="${grade._id}">
//                 <div class="p-4">
//                     <div>
//                         <p class="font-bold text-gray-800">${grade.student.name}</p>
//                         <p class="text-sm text-gray-500">${grade.student.studentId}</p>
//                     </div>
//                     <div class="mt-4 grid grid-cols-2 gap-4">
//                         <div>
//                             <label class="block text-xs font-medium text-gray-600">Semester</label>
//                             <input type="number" value="${grade.semester || ''}" placeholder="e.g. 1" class="semester-input mt-1 w-full p-1 border rounded-md">
//                         </div>
//                         <div>
//                             <label class="block text-xs font-medium text-gray-600">Nilai</label>
//                             <select class="grade-select mt-1 w-full p-1 border rounded-md">${gradeOptions(grade.score)}</select>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="bg-gray-50 px-4 py-3 flex justify-end">
//                     <button class="save-grade-btn text-sm font-medium text-indigo-600 hover:text-indigo-900">Update</button>
//                 </div>
//             </div>
//         `).join('');
//     };
    
//     const loadAndRenderGrades = async (courseId) => {
//         tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Memuat data nilai...</td></tr>`;
//         cardContainer.innerHTML = `<div class="text-center py-4">Memuat data nilai...</div>`;
//         gradesContainer.classList.remove('hidden');
//         tableTitle.textContent = `Nilai untuk: ${courseSelect.options[courseSelect.selectedIndex].text}`;

//         try {
//             const existingGrades = await fetchGradesByCourse(courseId);
//             renderGrades(existingGrades);
//         } catch (error) {
//             showNotification(error.message, true);
//             tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat data nilai.</td></tr>`;
//             cardContainer.innerHTML = `<div class="text-center py-4 text-red-500">Gagal memuat data nilai.</div>`;
//         }
//     };
    
//     // Mengisi dropdown mata kuliah
//     try {
//         const allCourses = await fetchCourses();
//         myCourses = allCourses.filter(c => c.lecturer && c.lecturer._id === user._id);
//         courseSelect.innerHTML = `
//             <option value="">-- Pilih Mata Kuliah --</option>
//             ${myCourses.map(c => `<option value="${c._id}">${c.name}</option>`).join('')}
//         `;
//     } catch (error) {
//         showNotification(error.message, true);
//         courseSelect.innerHTML = `<option value="">Gagal memuat data</option>`;
//     }

//     courseSelect.addEventListener('change', (e) => {
//       const courseId = e.target.value;
//       if (!courseId) {
//         gradesContainer.classList.add('hidden');
//         return;
//       }
//       loadAndRenderGrades(courseId);
//     });

//     addGradeBtn.addEventListener('click', () => {
//         const courseId = courseSelect.value;
//         if (!courseId) {
//             showNotification('Pilih mata kuliah terlebih dahulu.', true);
//             return;
//         }
//         showAddGradeModal(courseId, () => loadAndRenderGrades(courseId));
//     });

//     pageContainer.addEventListener('click', async (e) => {
//       if (e.target.classList.contains('save-grade-btn')) {
//         const parentElement = e.target.closest('[data-grade-id]');
//         if (!parentElement) return;

//         const gradeId = parentElement.dataset.gradeId;
//         const score = parentElement.querySelector('.grade-select').value;
//         const semester = parentElement.querySelector('.semester-input').value;

//         if (!score || !semester) {
//           showNotification('Harap isi semester dan nilai.', true);
//           return;
//         }

//         try {
//           e.target.textContent = 'Updating...';
//           e.target.disabled = true;
//           await updateGrade(gradeId, { score, semester });
//           showNotification('Nilai berhasil diperbarui.');
//         } catch (error) {
//           showNotification(error.message, true);
//         } finally {
//             e.target.textContent = 'Update';
//             e.target.disabled = false;
//         }
//       }
//     });
//   }
// };

// const showAddGradeModal = (courseId, onSaveSuccess) => {
//     const title = 'Input Nilai Baru';
//     const content = `
//         <form id="add-grade-form" class="space-y-4">
//             <div>
//                 <label for="student-id-input" class="block text-sm font-medium text-gray-700">ID Mahasiswa (NIM)</label>
//                 <input type="text" id="student-id-input" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Masukkan NIM mahasiswa">
//             </div>
//             <div>
//                 <label for="semester-input-modal" class="block text-sm font-medium text-gray-700">Semester</label>
//                 <input type="number" id="semester-input-modal" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="e.g. 1">
//             </div>
//             <div>
//                 <label for="grade-select-modal" class="block text-sm font-medium text-gray-700">Nilai</label>
//                 <select id="grade-select-modal" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
//                     <option value="">Pilih Nilai</option>
//                     <option value="A">A</option>
//                     <option value="B">B</option>
//                     <option value="C">C</option>
//                     <option value="D">D</option>
//                     <option value="E">E</option>
//                 </select>
//             </div>
//         </form>
//     `;

//     const onSave = async () => {
//         const studentId = document.getElementById('student-id-input').value; // Ini adalah NIM, bukan _id
//         const semester = document.getElementById('semester-input-modal').value;
//         const score = document.getElementById('grade-select-modal').value;

//         if (!studentId || !semester || !score) {
//             showNotification('Semua field wajib diisi.', true);
//             return false; // Prevent modal from closing
//         }

//         // PERHATIAN: Backend perlu disesuaikan untuk bisa
//         // mencari user._id berdasarkan studentId (NIM) yang diinput.
//         const gradeData = { student: studentId, course: courseId, score, semester };
        
//         try {
//             await addGrade(gradeData);
//             showNotification('Nilai berhasil ditambahkan.');
//             onSaveSuccess(); // Panggil callback untuk refresh tabel
//             return true; // Close modal
//         } catch (error) {
//             showNotification(`Gagal menambahkan nilai. Pastikan ID Mahasiswa (NIM) benar. Error: ${error.message}`, true);
//             return false; // Keep modal open
//         }
//     };

//     Modal.show(title, content, onSave);
// };


// export default KelolaNilai;






// import { fetchCourses } from '../../api/courseApi.js';
// import { fetchGradesByCourse, addGrade, updateGrade } from '../../api/gradeApi.js';
// import { getUser } from '../../utils/auth.js';
// import { showNotification } from '../../utils/helpers.js';
// import Modal from '../../components/Modal.js';

// let myCourses = [];

// const KelolaNilai = {
//   /**
//    * Merender struktur statis halaman.
//    */
//   render: () => {
//     return `
//       <div class="mb-6">
//         <h1 class="text-2xl font-semibold text-gray-900">Kelola Nilai Mahasiswa</h1>
//         <div class="mt-4">
//           <label for="course-select" class="block text-sm font-medium text-gray-700">Pilih Mata Kuliah:</label>
//           <select id="course-select" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
//             <option value="">-- Memuat mata kuliah... --</option>
//           </select>
//         </div>
//       </div>
      
//       <div id="grades-container" class="hidden">
//         <div class="flex justify-between items-center mb-4">
//             <h2 id="table-title" class="text-xl font-semibold text-gray-800"></h2>
//             <button id="add-grade-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
//               Input Nilai Baru
//             </button>
//         </div>
//         <!-- Container Tabel (Desktop) -->
//         <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//           <table class="min-w-full divide-y divide-gray-200">
//             <thead class="bg-gray-50">
//               <tr>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mahasiswa</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai (A-E)</th>
//                 <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
//               </tr>
//             </thead>
//             <tbody id="grades-table-body" class="bg-white divide-y divide-gray-200">
//               <!-- Rows will be injected here -->
//             </tbody>
//           </table>
//         </div>
//         <!-- Container Card (Mobile) -->
//         <div id="grades-card-container" class="md:hidden space-y-4">
//             <!-- Cards will be injected here -->
//         </div>
//       </div>
//     `;
//   },
//   /**
//    * Mengambil data dan menambahkan event listener setelah halaman dirender.
//    */
//   after_render: async () => {
//     const user = getUser();
//     if (!user) return;

//     const pageContainer = document.querySelector('.px-4.sm\\:px-6.md\\:px-8');
//     const courseSelect = document.getElementById('course-select');
//     const gradesContainer = document.getElementById('grades-container');
//     const tableBody = document.getElementById('grades-table-body');
//     const cardContainer = document.getElementById('grades-card-container');
//     const tableTitle = document.getElementById('table-title');
//     const addGradeBtn = document.getElementById('add-grade-btn');

//     const renderGrades = (existingGrades) => {
//         if (existingGrades.length === 0) {
//             tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Belum ada nilai yang diinput untuk mata kuliah ini.</td></tr>`;
//             cardContainer.innerHTML = `<div class="text-center py-4">Belum ada nilai yang diinput untuk mata kuliah ini.</div>`;
//             return;
//         }

//         const gradeOptions = (score) => ['A', 'B', 'C', 'D', 'E']
//             .map(g => `<option value="${g}" ${score === g ? 'selected' : ''}>${g}</option>`).join('');

//         // Render Tabel
//         tableBody.innerHTML = existingGrades.map(grade => `
//             <tr data-student-id="${grade.student._id}" data-grade-id="${grade._id}">
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${grade.student.studentId}</td>
//               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${grade.student.name}</td>
//               <td class="px-6 py-4">
//                 <select class="grade-select p-1 border rounded-md">${gradeOptions(grade.score)}</select>
//               </td>
//               <td class="px-6 py-4">
//                 <button class="save-grade-btn text-indigo-600 hover:text-indigo-900">Update</button>
//               </td>
//             </tr>
//         `).join('');
        
//         // Render Card
//         cardContainer.innerHTML = existingGrades.map(grade => `
//             <div class="bg-white rounded-lg shadow border border-gray-200" data-student-id="${grade.student._id}" data-grade-id="${grade._id}">
//                 <div class="p-4">
//                     <div>
//                         <p class="font-bold text-gray-800">${grade.student.name}</p>
//                         <p class="text-sm text-gray-500">${grade.student.studentId}</p>
//                     </div>
//                     <div class="mt-4">
//                         <label class="block text-xs font-medium text-gray-600">Nilai</label>
//                         <select class="grade-select mt-1 w-full p-1 border rounded-md">${gradeOptions(grade.score)}</select>
//                     </div>
//                 </div>
//                 <div class="bg-gray-50 px-4 py-3 flex justify-end">
//                     <button class="save-grade-btn text-sm font-medium text-indigo-600 hover:text-indigo-900">Update</button>
//                 </div>
//             </div>
//         `).join('');
//     };
    
//     const loadAndRenderGrades = async (courseId) => {
//         tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Memuat data nilai...</td></tr>`;
//         cardContainer.innerHTML = `<div class="text-center py-4">Memuat data nilai...</div>`;
//         gradesContainer.classList.remove('hidden');
//         tableTitle.textContent = `Nilai untuk: ${courseSelect.options[courseSelect.selectedIndex].text}`;

//         try {
//             const existingGrades = await fetchGradesByCourse(courseId);
//             renderGrades(existingGrades);
//         } catch (error) {
//             showNotification(error.message, true);
//             tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Gagal memuat data nilai.</td></tr>`;
//             cardContainer.innerHTML = `<div class="text-center py-4 text-red-500">Gagal memuat data nilai.</div>`;
//         }
//     };
    
//     // Mengisi dropdown mata kuliah
//     try {
//         const allCourses = await fetchCourses();
//         myCourses = allCourses.filter(c => c.lecturer && c.lecturer._id === user._id);
//         courseSelect.innerHTML = `
//             <option value="">-- Pilih Mata Kuliah --</option>
//             ${myCourses.map(c => `<option value="${c._id}">${c.name}</option>`).join('')}
//         `;
//     } catch (error) {
//         showNotification(error.message, true);
//         courseSelect.innerHTML = `<option value="">Gagal memuat data</option>`;
//     }

//     courseSelect.addEventListener('change', (e) => {
//       const courseId = e.target.value;
//       if (!courseId) {
//         gradesContainer.classList.add('hidden');
//         return;
//       }
//       loadAndRenderGrades(courseId);
//     });

//     addGradeBtn.addEventListener('click', () => {
//         const courseId = courseSelect.value;
//         if (!courseId) {
//             showNotification('Pilih mata kuliah terlebih dahulu.', true);
//             return;
//         }
//         showAddGradeModal(courseId, () => loadAndRenderGrades(courseId));
//     });

//     pageContainer.addEventListener('click', async (e) => {
//       if (e.target.classList.contains('save-grade-btn')) {
//         const parentElement = e.target.closest('[data-grade-id]');
//         if (!parentElement) return;

//         const gradeId = parentElement.dataset.gradeId;
//         const score = parentElement.querySelector('.grade-select').value;

//         if (!score) {
//           showNotification('Harap pilih nilai.', true);
//           return;
//         }

//         try {
//           e.target.textContent = 'Updating...';
//           e.target.disabled = true;
//           await updateGrade(gradeId, { score });
//           showNotification('Nilai berhasil diperbarui.');
//         } catch (error) {
//           showNotification(error.message, true);
//         } finally {
//             e.target.textContent = 'Update';
//             e.target.disabled = false;
//         }
//       }
//     });
//   }
// };

// const showAddGradeModal = (courseId, onSaveSuccess) => {
//     const title = 'Input Nilai Baru';
//     const content = `
//         <form id="add-grade-form" class="space-y-4">
//             <div>
//                 <label for="student-id-input" class="block text-sm font-medium text-gray-700">ID Mahasiswa (NIM)</label>
//                 <input type="text" id="student-id-input" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="Masukkan NIM mahasiswa">
//             </div>
//             <div>
//                 <label for="grade-select-modal" class="block text-sm font-medium text-gray-700">Nilai</label>
//                 <select id="grade-select-modal" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
//                     <option value="">Pilih Nilai</option>
//                     <option value="A">A</option>
//                     <option value="B">B</option>
//                     <option value="C">C</option>
//                     <option value="D">D</option>
//                     <option value="E">E</option>
//                 </select>
//             </div>
//         </form>
//     `;

//     const onSave = async () => {
//         const studentId = document.getElementById('student-id-input').value;
//         const score = document.getElementById('grade-select-modal').value;

//         if (!studentId || !score) {
//             showNotification('Semua field wajib diisi.', true);
//             return false;
//         }

//         const gradeData = { student: studentId, course: courseId, score };
        
//         try {
//             await addGrade(gradeData);
//             showNotification('Nilai berhasil ditambahkan.');
//             onSaveSuccess();
//             return true;
//         } catch (error) {
//             showNotification(`Gagal menambahkan nilai. Pastikan ID Mahasiswa (NIM) benar. Error: ${error.message}`, true);
//             return false;
//         }
//     };

//     Modal.show(title, content, onSave);
// };


// export default KelolaNilai;









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
