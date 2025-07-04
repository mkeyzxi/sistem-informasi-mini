import { getUser, logout } from '../utils/auth.js';
import { navigateTo } from '../utils/router.js';

const Header = async () => {
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigateTo('/login');
    };

    // Event listener harus didelegasikan karena header dirender ulang
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'logout-button') {
            handleLogout();
        }
    });

    return `
        <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <div class="flex-1 px-4 flex justify-between">
                <div class="flex-1 flex">
                    <!-- Placeholder for search or other header items -->
                </div>
                <div class="ml-4 flex items-center md:ml-6">
                    <div class="ml-3 relative">
                        <div>
                            <button type="button" class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                <span class="sr-only">Open user menu</span>
                                <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                                    <span class="text-sm font-medium leading-none text-white">${user ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="ml-3">
                        <span class="text-gray-700 text-sm font-medium">${user ? user.name : 'User'}</span>
                        <button id="logout-button" class="ml-4 text-sm text-gray-500 hover:text-gray-700">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export default Header;