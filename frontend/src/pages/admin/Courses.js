import { fetchCourses, createCourse, updateCourse, deleteCourse, enrollStudentsInCourse } from '../../api/courseApi.js';
import { fetchUsers } from '../../api/userApi.js';
import { showNotification } from '../../utils/helpers.js';
import Modal from '../../components/Modal.js';

const Courses = {
  render: () => {
    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Manage Mata Kuliah</h1>
        <button id="add-course-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Add Mata Kuliah
        </button>
      </div>

      <!-- Container untuk Tampilan Tabel (Desktop) -->
      <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Mata Kuliah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKS</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosen</th>
              <th class="relative px-6 py-3"></th>
            </tr>
          </thead>
          <tbody id="courses-table-body" class="bg-white divide-y divide-gray-200">
            <!-- Konten tabel dimuat di sini -->
          </tbody>
        </table>
      </div>

      <!-- Container untuk Tampilan Card (Mobile) -->
      <div id="courses-card-container" class="md:hidden space-y-4">
        <!-- Konten card dimuat di sini -->
      </div>
    `;
  },
  after_render: async () => {
    const pageContainer = document.querySelector('.px-4.sm\\:px-6.md\\:px-8');
    const tableBody = document.getElementById('courses-table-body');
    const cardContainer = document.getElementById('courses-card-container');
    let courses = [];
    let lecturers = [];
    
    const renderCourses = () => {
      if (courses.length > 0) {
        // Render Tabel
        tableBody.innerHTML = courses.map(course => `
          <tr data-id="${course._id}">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${course.code}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.credits}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.lecturer ? course.lecturer.name : 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-green-600 hover:text-green-900 enroll-btn">Add Mahasiswa</button>
              <button class="text-indigo-600 hover:text-indigo-900 ml-4 edit-btn">Edit</button>
              <button class="text-red-600 hover:text-red-900 ml-4 delete-btn">Delete</button>
            </td>
          </tr>
        `).join('');
        // Render Card
        cardContainer.innerHTML = courses.map(course => `
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200" data-id="${course._id}">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-bold text-lg text-gray-900">${course.name}</p>
                    <p class="text-sm text-gray-600">${course.code}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">SKS</p>
                    <p class="font-semibold text-gray-800">${course.credits}</p>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t">
                <p class="text-xs font-medium text-gray-500">Dosen</p>
                <p class="text-sm text-gray-800">${course.lecturer ? course.lecturer.name : 'N/A'}</p>
            </div>
            <div class="mt-4 pt-4 border-t flex justify-end space-x-4">
                <button class="text-sm font-medium text-green-600 hover:text-green-900 enroll-btn">Add Mahasiswa</button>
                <button class="text-sm font-medium text-indigo-600 hover:text-indigo-900 edit-btn">Edit</button>
                <button class="text-sm font-medium text-red-600 hover:text-red-900 delete-btn">Delete</button>
            </div>
          </div>
        `).join('');
      } else {
        const noDataHTML = `<tr><td colspan="5" class="text-center py-4">Tidak ada mata kuliah.</td></tr>`;
        const noDataCardHTML = `<div class="text-center py-4">Tidak ada mata kuliah.</div>`;
        tableBody.innerHTML = noDataHTML;
        cardContainer.innerHTML = noDataCardHTML;
      }
    };

    const refreshCourses = async () => {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Memuat mata kuliah...</td></tr>`;
        cardContainer.innerHTML = `<div class="text-center py-4">Memuat mata kuliah...</div>`;
        try {
            [courses, lecturers] = await Promise.all([
                fetchCourses(),
                fetchUsers({ role: 'dosen' })
            ]);
            renderCourses();
        } catch (error) {
            showNotification(error.message, true);
            const errorHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat data.</td></tr>`;
            const errorCardHTML = `<div class="text-center py-4 text-red-500">Gagal memuat data.</div>`;
            tableBody.innerHTML = errorHTML;
            cardContainer.innerHTML = errorCardHTML;
        }
    };
    
    document.getElementById('add-course-btn').addEventListener('click', () => showCourseModal(null, lecturers, refreshCourses));

    pageContainer.addEventListener('click', (e) => {
      const target = e.target;
      const parentElement = target.closest('tr') || target.closest('[data-id]');
      if (!parentElement) return;
      
      const id = parentElement.dataset.id;
      const course = courses.find(c => c._id === id);

      if (target.classList.contains('enroll-btn')) {
        showEnrollmentModal(course);
      }
      if (target.classList.contains('edit-btn')) {
        showCourseModal(course, lecturers, refreshCourses);
      }
      if (target.classList.contains('delete-btn')) {
        showConfirmationModal('Are you sure you want to delete this course?', async () => {
            try {
                await deleteCourse(id);
                showNotification('Course deleted successfully');
                await refreshCourses();
            } catch (err) {
                showNotification(err.message, true);
            }
        });
      }
    });
    
    await refreshCourses();
  },
};

const showCourseModal = (course, lecturers, onSaveSuccess) => {
    const title = course ? 'Edit Mata Kuliah' : 'Add Mata Kuliah';
    const lecturerOptions = lecturers.map(lecturer => 
        `<option value="${lecturer._id}" ${course && course.lecturer && course.lecturer._id === lecturer._id ? 'selected' : ''}>
        ${lecturer.name}
        </option>`
    ).join('');

    const content = `
        <form id="course-form" class="space-y-4">
        <input type="hidden" id="course-id" value="${course ? course._id : ''}">
        <div>
            <label for="code" class="block text-sm font-medium text-gray-700">Kode</label>
            <input type="text" id="code" value="${course ? course.code : ''}" required class="mt-1 block w-full rounded-md h-10 ring-1 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nama Mata Kuliah</label>
            <input type="text" id="name" value="${course ? course.name : ''}" required class="mt-1 block w-full h-10 ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="credits" class="block text-sm font-medium text-gray-700">SKS</label>
            <input type="number" id="credits" value="${course ? course.credits : ''}" required class="mt-1 block w-full h-10 ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="lecturer" class="block text-sm font-medium text-gray-700">Dosen</label>
            <select id="lecturer" required class="h-10 ring-1 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">Select Dosen</option>
            ${lecturerOptions}
            </select>
        </div>
        </form>
    `;

    const onSave = async () => {
        const id = document.getElementById('course-id').value;
        const courseData = {
            code: document.getElementById('code').value,
            name: document.getElementById('name').value,
            credits: document.getElementById('credits').value,
            lecturer: document.getElementById('lecturer').value,
        };

        try {
            if (id) {
                await updateCourse(id, courseData);
                showNotification('Course updated successfully');
            } else {
                await createCourse(courseData);
                showNotification('Course created successfully');
            }
            await onSaveSuccess();
            return true;
        } catch (error) {
            showNotification(error.message, true);
            return false;
        }
    };

    Modal.show(title, content, onSave);
};

const showEnrollmentModal = (course) => {
    const title = `Add Mahasiswa ke ${course.name}`;
    const content = `
        <form id="enrollment-form">
            <p class="text-sm text-gray-600 mb-4">Masukkan satu atau lebih NIM, pisahkan dengan baris baru (Enter).</p>
            <div>
                <label for="student-nims-textarea" class="sr-only">NIM Mahasiswa</label>
                <textarea id="student-nims-textarea" rows="10" class="block w-full rounded-md border-gray-300 h-10 ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm " placeholder="2100018001\n2100018002\n2100018003"></textarea>
            </div>
        </form>
    `;

    const onSave = async () => {
        const textarea = document.getElementById('student-nims-textarea');
        const nims = textarea.value
            .split('\n')
            .map(nim => nim.trim())
            .filter(nim => nim !== '');

        if (nims.length === 0) {
            showNotification('Harap masukkan setidaknya satu NIM.', true);
            return false; // Jaga modal tetap terbuka
        }

        try {
            // Asumsi API endpoint menerima { studentNims: [...] }
            await enrollStudentsInCourse(course._id, { studentNims: nims });
            showNotification(`${nims.length} mahasiswa berhasil ditambahkan ke mata kuliah.`);
            return true; // Tutup modal jika berhasil
        } catch (error) {
            showNotification(error.message, true);
            return false; // Jaga modal tetap terbuka jika ada error
        }
    };

    Modal.show(title, content, onSave, 'Enroll');
};

const showConfirmationModal = (message, onConfirm) => {
    Modal.show('Confirmation', `<p>${message}</p>`, async () => {
        await onConfirm();
        return true;
    }, 'Confirm');
};

export default Courses;