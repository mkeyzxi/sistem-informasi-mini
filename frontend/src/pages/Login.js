import { loginUser } from '../api/authApi.js';
import { login } from '../utils/auth.js';
import { navigateTo } from '../utils/router.js';
import { showNotification } from '../utils/helpers.js';

const Login = {
  render: () => {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form id="login-form" class="mt-8 space-y-6 flex flex-col">
            <div class="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
              <div>
                <label for="email-address" class="sr-only">Email address</label>
                <input id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address">
              </div>
              <div>
                <label for="password" class="sr-only">Password</label>
                <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password">
              </div>
            </div>
            <div>
              <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Sign in
              </button>
            </div>
            <!-- <div class="text-sm text-center">
                <a href="/register" data-link class="font-medium text-indigo-600 hover:text-indigo-500">
                    Don't have an account? Register
                </a>
            </div> -->
          </form>
        </div>
      </div>
    `;
  },
  after_render: () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email-address').value;
      const password = document.getElementById('password').value;
      try {
        const data = await loginUser(email, password);
        login({ _id: data._id, name: data.name, email: data.email, role: data.role }, data.token);
        navigateTo('/'); // Router akan redirect berdasarkan role
      } catch (error) {
        showNotification(error.message, true);
      }
    });
  },
};

export default Login;