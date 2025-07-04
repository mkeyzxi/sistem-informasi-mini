import { getUser } from '../../utils/auth.js';
import { fetchUsers } from '../../api/userApi.js';
import { fetchCourses } from '../../api/courseApi.js';

const AdminDashboard = {
  /**
   * Merender komponen dashboard admin secara sinkron.
   * @returns {string} String HTML untuk dashboard admin.
   */
  render: () => {
    const user = getUser();
    // Pastikan ada user sebelum merender, untuk menghindari error.
    const userName = user ? user.name : 'Admin';

    return `
      <div class="py-4">
        <h1 class="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p class="mt-2 text-sm text-gray-700">Welcome, ${userName}! Here you can manage the entire academic system.</p>
        
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Card untuk Total Users -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197m0 0A4 4 0 004.75 8.25" /></svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                <dd id="total-users" class="text-lg font-medium text-gray-900">Loading...</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Card untuk Total Courses -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                                <dd id="total-courses" class="text-lg font-medium text-gray-900">Loading...</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
  },
  /**
   * Fungsi yang dieksekusi setelah komponen dirender.
   * Mengambil data statistik dan memperbarui DOM.
   */
  after_render: async () => {
    try {
        // Mengambil data user dan mata kuliah secara paralel
        const [users, courses] = await Promise.all([fetchUsers(), fetchCourses()]);
        
        const totalUsersEl = document.getElementById('total-users');
        const totalCoursesEl = document.getElementById('total-courses');

        if (totalUsersEl) {
            totalUsersEl.textContent = users.length;
        }
        if (totalCoursesEl) {
            totalCoursesEl.textContent = courses.length;
        }
    } catch(e) {
        console.error("Failed to fetch dashboard stats", e);
        const totalUsersEl = document.getElementById('total-users');
        const totalCoursesEl = document.getElementById('total-courses');
        if (totalUsersEl) totalUsersEl.textContent = 'Error';
        if (totalCoursesEl) totalCoursesEl.textContent = 'Error';
    }
  },
};

export default AdminDashboard;