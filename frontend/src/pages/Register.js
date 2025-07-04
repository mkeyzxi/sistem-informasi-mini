import { registerUser } from '../api/authApi.js';
import { login } from '../utils/auth.js';
import { navigateTo } from '../utils/router.js';
import { showNotification } from '../utils/helpers.js';

const Register = {
  render: () => {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create a new account
            </h2>
          </div>
          <form id="register-form" class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm space-y-4">
              <input id="name" name="name" type="text" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full Name">
              <input id="email" name="email" type="email" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address">
              <input id="password" name="password" type="password" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password (min. 6 characters)">
              <select id="role" name="role" required class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="" disabled selected>Select a role</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
              </select>
              <div id="role-specific-fields"></div>
            </div>
            <div>
              <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Register
              </button>
            </div>
            <div class="text-sm text-center">
                <a href="/login" data-link class="font-medium text-indigo-600 hover:text-indigo-500">
                    Already have an account? Sign in
                </a>
            </div>
          </form>
        </div>
      </div>
    `;
  },
  after_render: () => {
    const roleSelect = document.getElementById('role');
    const roleSpecificFields = document.getElementById('role-specific-fields');

    roleSelect.addEventListener('change', (e) => {
        const role = e.target.value;
        if (role === 'mahasiswa') {
            roleSpecificFields.innerHTML = `<input id="studentId" name="studentId" type="text" required class="mt-4 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Student ID (NIM)">`;
        } else if (role === 'dosen') {
            roleSpecificFields.innerHTML = `<input id="lecturerId" name="lecturerId" type="text" required class="mt-4 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Lecturer ID (NIDN)">`;
        } else {
            roleSpecificFields.innerHTML = '';
        }
    });

    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;
      const studentId = document.getElementById('studentId')?.value;
      const lecturerId = document.getElementById('lecturerId')?.value;
      
      const userData = { name, email, password, role, studentId, lecturerId };

      try {
        const data = await registerUser(userData);
        login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
        navigateTo('/');
      } catch (error) {
        showNotification(error.message, true);
      }
    });
  },
};

export default Register;