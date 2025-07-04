// import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../api/scheduleApi.js';
// import { fetchCourses } from '../../api/courseApi.js';
// import { showNotification } from '../../utils/helpers.js';
// import Modal from '../../components/Modal.js';

// const Schedules = {
//   render: () => {
//     return `
//       <div class="flex justify-between items-center mb-6">
//         <h1 class="text-2xl font-semibold text-gray-900">Manage Jadwal Kuliah</h1>
//         <button id="add-schedule-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
//           Add Jadwal
//         </button>
//       </div>
//       <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//         <table class="min-w-full divide-y divide-gray-200">
//           <thead class="bg-gray-50">
//             <tr>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Kuliah</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hari</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
//               <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
//               <th class="relative px-6 py-3"></th>
//             </tr>
//           </thead>
//           <tbody id="schedules-table-body" class="bg-white divide-y divide-gray-200">
//             <tr><td colspan="5" class="text-center py-4">Memuat jadwal...</td></tr>
//           </tbody>
//         </table>
//       </div>
//     `;
//   },
//   after_render: async () => {
//     const tableBody = document.getElementById('schedules-table-body');
//     let schedules = [];
//     let courses = [];

//     const refreshSchedules = async () => {
//         tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Memuat jadwal...</td></tr>`;
//         try {
//             [schedules, courses] = await Promise.all([
//                 fetchSchedules(),
//                 fetchCourses()
//             ]);
            
//             if (schedules.length > 0) {
//                 tableBody.innerHTML = schedules.map(schedule => `
//                   <tr data-id="${schedule._id}">
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.course ? schedule.course.name : 'N/A'}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.day}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.time}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.room}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button class="text-indigo-600 hover:text-indigo-900 edit-btn">Edit</button>
//                       <button class="text-red-600 hover:text-red-900 ml-4 delete-btn">Delete</button>
//                     </td>
//                   </tr>
//                 `).join('');
//             } else {
//                 tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Tidak ada jadwal.</td></tr>`;
//             }
//         } catch (error) {
//             showNotification(error.message, true);
//             tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat jadwal.</td></tr>`;
//         }
//     };

//     document.getElementById('add-schedule-btn').addEventListener('click', () => showScheduleModal(null, courses, refreshSchedules));

//     tableBody.addEventListener('click', (e) => {
//       const target = e.target;
//       const row = target.closest('tr');
//       if (!row) return;
//       const id = row.dataset.id;

//       if (target.classList.contains('edit-btn')) {
//         const schedule = schedules.find(s => s._id === id);
//         showScheduleModal(schedule, courses, refreshSchedules);
//       }
//       if (target.classList.contains('delete-btn')) {
//         showConfirmationModal('Are you sure you want to delete this schedule?', async () => {
//             try {
//                 await deleteSchedule(id);
//                 showNotification('Schedule deleted successfully');
//                 await refreshSchedules();
//             } catch (err) {
//                 showNotification(err.message, true);
//             }
//         });
//       }
//     });

//     await refreshSchedules();
//   },
// };

// const showScheduleModal = (schedule, courses, onSaveSuccess) => {
//     const title = schedule ? 'Edit Jadwal' : 'Add Jadwal';
//     const courseOptions = courses.map(course => 
//         `<option value="${course._id}" ${schedule && schedule.course && schedule.course._id === course._id ? 'selected' : ''}>
//         ${course.name} (${course.code})
//         </option>`
//     ).join('');

//     const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
//     const dayOptions = days.map(day => 
//         `<option value="${day}" ${schedule && schedule.day === day ? 'selected' : ''}>${day}</option>`
//     ).join('');

//     const content = `
//         <form id="schedule-form" class="space-y-4">
//         <input type="hidden" id="schedule-id" value="${schedule ? schedule._id : ''}">
//         <div>
//             <label for="course" class="block text-sm font-medium">Mata Kuliah</label>
//             <select id="course" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
//             <option value="">Select Mata Kuliah</option>
//             ${courseOptions}
//             </select>
//         </div>
//         <div>
//             <label for="day" class="block text-sm font-medium">Hari</label>
//             <select id="day" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
//             ${dayOptions}
//             </select>
//         </div>
//         <div>
//             <label for="time" class="block text-sm font-medium">Waktu (e.g., 08:00 - 10:00)</label>
//             <input type="text" id="time" value="${schedule ? schedule.time : ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
//         </div>
//         <div>
//             <label for="room" class="block text-sm font-medium">Ruangan</label>
//             <input type="text" id="room" value="${schedule ? schedule.room : ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
//         </div>
//         </form>
//     `;

//     const onSave = async () => {
//         const id = document.getElementById('schedule-id').value;
//         const scheduleData = {
//             course: document.getElementById('course').value,
//             day: document.getElementById('day').value,
//             time: document.getElementById('time').value,
//             room: document.getElementById('room').value,
//         };

//         try {
//             if (id) {
//                 await updateSchedule(id, scheduleData);
//                 showNotification('Schedule updated successfully');
//             } else {
//                 await createSchedule(scheduleData);
//                 showNotification('Schedule created successfully');
//             }
//             await onSaveSuccess();
//             return true;
//         } catch (error) {
//             showNotification(error.message, true);
//             return false;
//         }
//     };

//     Modal.show(title, content, onSave);
// };

// // FIX: Added missing function definition
// const showConfirmationModal = (message, onConfirm) => {
//     Modal.show('Confirmation', `<p>${message}</p>`, async () => {
//         await onConfirm();
//         return true;
//     }, 'Confirm');
// };

// export default Schedules;


import { fetchSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../api/scheduleApi.js';
import { fetchCourses } from '../../api/courseApi.js';
import { showNotification } from '../../utils/helpers.js';
import Modal from '../../components/Modal.js';

const Schedules = {
  render: () => {
    return `
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Manage Jadwal Kuliah</h1>
        <button id="add-schedule-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Add Jadwal
        </button>
      </div>

      <!-- Container untuk Tampilan Tabel (Desktop) -->
      <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Kuliah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hari</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
              <th class="relative px-6 py-3"></th>
            </tr>
          </thead>
          <tbody id="schedules-table-body" class="bg-white divide-y divide-gray-200">
            <!-- Konten tabel dimuat di sini -->
          </tbody>
        </table>
      </div>

      <!-- Container untuk Tampilan Card (Mobile) -->
      <div id="schedules-card-container" class="md:hidden space-y-4">
        <!-- Konten card dimuat di sini -->
      </div>
    `;
  },
  after_render: async () => {
    const pageContainer = document.querySelector('.px-4.sm\\:px-6.md\\:px-8');
    const tableBody = document.getElementById('schedules-table-body');
    const cardContainer = document.getElementById('schedules-card-container');
    let schedules = [];
    let courses = [];

    const renderSchedules = () => {
        if (schedules.length > 0) {
            // Render Tabel
            tableBody.innerHTML = schedules.map(schedule => `
                <tr data-id="${schedule._id}">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.course ? schedule.course.name : 'N/A'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.day}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.time}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.room}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 edit-btn">Edit</button>
                    <button class="text-red-600 hover:text-red-900 ml-4 delete-btn">Delete</button>
                  </td>
                </tr>
            `).join('');
            
            // Render Card (Desain Baru)
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
                <div class="bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${colorClass}" data-id="${schedule._id}">
                    <div class="p-4">
                        <p class="font-bold text-gray-800 text-lg truncate">${schedule.course ? schedule.course.name : 'N/A'}</p>
                        <p class="text-sm text-gray-500 mb-4">${schedule.course ? `(${schedule.course.code})` : ''}</p>
                        
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
                                <span>${schedule.room}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 flex justify-end space-x-4">
                        <button class="text-sm font-medium text-indigo-600 hover:text-indigo-900 edit-btn">Edit</button>
                        <button class="text-sm font-medium text-red-600 hover:text-red-900 delete-btn">Delete</button>
                    </div>
                </div>
                `;
            }).join('');
        } else {
            const noDataHTML = `<tr><td colspan="5" class="text-center py-4">Tidak ada jadwal.</td></tr>`;
            const noDataCardHTML = `<div class="text-center py-4">Tidak ada jadwal.</div>`;
            tableBody.innerHTML = noDataHTML;
            cardContainer.innerHTML = noDataCardHTML;
        }
    };
    
    const refreshSchedules = async () => {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Memuat jadwal...</td></tr>`;
        cardContainer.innerHTML = `<div class="text-center py-4">Memuat jadwal...</div>`;
        try {
            [schedules, courses] = await Promise.all([
                fetchSchedules(),
                fetchCourses()
            ]);
            renderSchedules();
        } catch (error) {
            showNotification(error.message, true);
            const errorHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat jadwal.</td></tr>`;
            const errorCardHTML = `<div class="text-center py-4 text-red-500">Gagal memuat jadwal.</div>`;
            tableBody.innerHTML = errorHTML;
            cardContainer.innerHTML = errorCardHTML;
        }
    };

    document.getElementById('add-schedule-btn').addEventListener('click', () => showScheduleModal(null, courses, refreshSchedules));

    pageContainer.addEventListener('click', (e) => {
        const target = e.target;
        const parentElement = target.closest('tr') || target.closest('[data-id]');
        if (!parentElement) return;
        
        const id = parentElement.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const schedule = schedules.find(s => s._id === id);
            showScheduleModal(schedule, courses, refreshSchedules);
        }
        if (target.classList.contains('delete-btn')) {
            showConfirmationModal('Are you sure you want to delete this schedule?', async () => {
                try {
                    await deleteSchedule(id);
                    showNotification('Schedule deleted successfully');
                    await refreshSchedules();
                } catch (err) {
                    showNotification(err.message, true);
                }
            });
        }
    });

    await refreshSchedules();
  },
};

const showScheduleModal = (schedule, courses, onSaveSuccess) => {
    const title = schedule ? 'Edit Jadwal' : 'Add Jadwal';
    const courseOptions = courses.map(course => 
        `<option value="${course._id}" ${schedule && schedule.course && schedule.course._id === course._id ? 'selected' : ''}>
        ${course.name} (${course.code})
        </option>`
    ).join('');

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayOptions = days.map(day => 
        `<option value="${day}" ${schedule && schedule.day === day ? 'selected' : ''}>${day}</option>`
    ).join('');

    const content = `
        <form id="schedule-form" class="space-y-4">
        <input type="hidden" id="schedule-id" value="${schedule ? schedule._id : ''}">
        <div>
            <label for="course" class="block text-sm font-medium text-gray-700">Mata Kuliah</label>
            <select id="course" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">Select Mata Kuliah</option>
            ${courseOptions}
            </select>
        </div>
        <div>
            <label for="day" class="block text-sm font-medium text-gray-700">Hari</label>
            <select id="day" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            ${dayOptions}
            </select>
        </div>
        <div>
            <label for="time" class="block text-sm font-medium text-gray-700">Waktu (e.g., 08:00 - 10:00)</label>
            <input type="text" id="time" value="${schedule ? schedule.time : ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="room" class="block text-sm font-medium text-gray-700">Ruangan</label>
            <input type="text" id="room" value="${schedule ? schedule.room : ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        </form>
    `;

    const onSave = async () => {
        const id = document.getElementById('schedule-id').value;
        const scheduleData = {
            course: document.getElementById('course').value,
            day: document.getElementById('day').value,
            time: document.getElementById('time').value,
            room: document.getElementById('room').value,
        };

        try {
            if (id) {
                await updateSchedule(id, scheduleData);
                showNotification('Schedule updated successfully');
            } else {
                await createSchedule(scheduleData);
                showNotification('Schedule created successfully');
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

const showConfirmationModal = (message, onConfirm) => {
    Modal.show('Confirmation', `<p>${message}</p>`, async () => {
        await onConfirm();
        return true;
    }, 'Confirm');
};

export default Schedules;