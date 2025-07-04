import { fetchUsers, createUser, updateUser, deleteUser } from '../../api/userApi.js';
import { showNotification } from '../../utils/helpers.js';
import Modal from '../../components/Modal.js';

let allUsers = []; // Menyimpan semua pengguna yang diambil dari API

const Users = {
  render: () => {
    return `
      <div class="mb-10">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 class="text-2xl font-semibold text-gray-900">Manage Users</h1>
          <button id="add-user-btn" class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Add User
          </button>
        </div>

        <!-- Fitur Pencarian -->
        <div class="mb-6">
            <label for="search-user-input" class="sr-only">Search by name</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input type="text" id="search-user-input" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search by name...">
            </div>
        </div>
        
        <!-- Container untuk Tampilan Tabel (Desktop) -->
        <div class="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody id="users-table-body" class="bg-white divide-y divide-gray-200">
              <!-- Konten tabel dimuat di sini -->
            </tbody>
          </table>
        </div>

        <!-- Container untuk Tampilan Card (Mobile) -->
        <div id="users-card-container" class="md:hidden space-y-4">
          <!-- Konten card dimuat di sini -->
        </div>
      </div>
    `;
  },
  after_render: async () => {
    const pageContainer = document.querySelector('.px-4.sm\\:px-6.md\\:px-8');
    const tableBody = document.getElementById('users-table-body');
    const cardContainer = document.getElementById('users-card-container');
    const searchInput = document.getElementById('search-user-input');

    const getRoleClass = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'dosen': return 'bg-blue-100 text-blue-800';
            case 'mahasiswa': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderUsers = (usersToRender) => {
        if (usersToRender.length > 0) {
            // Render Tabel
            tableBody.innerHTML = usersToRender.map(user => `
                <tr data-id="${user._id}">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${user.name}</div>
                    <div class="text-sm text-gray-500">${user.email}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)} capitalize">
                      ${user.role}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.studentId || user.lecturerId || 'N/A'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 edit-btn">Edit</button>
                    <button class="text-red-600 hover:text-red-900 ml-4 delete-btn">Delete</button>
                  </td>
                </tr>
            `).join('');
            
            // Render Card
            cardContainer.innerHTML = usersToRender.map(user => `
                <div class="bg-white rounded-lg shadow border border-gray-200" data-id="${user._id}">
                    <div class="p-4">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="font-bold text-gray-800">${user.name}</p>
                                <p class="text-sm text-gray-500">${user.email}</p>
                            </div>
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.role)} capitalize">
                                ${user.role}
                            </span>
                        </div>
                        <div class="mt-4 pt-4 border-t">
                            <p class="text-xs text-gray-500">ID Number</p>
                            <p class="text-sm text-gray-700">${user.studentId || user.lecturerId || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 flex justify-end space-x-4">
                        <button class="text-sm font-medium text-indigo-600 hover:text-indigo-900 edit-btn">Edit</button>
                        <button class="text-sm font-medium text-red-600 hover:text-red-900 delete-btn">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            const noDataHTML = `<tr><td colspan="4" class="text-center py-4">Pengguna tidak ditemukan.</td></tr>`;
            const noDataCardHTML = `<div class="text-center py-4">Pengguna tidak ditemukan.</div>`;
            tableBody.innerHTML = noDataHTML;
            cardContainer.innerHTML = noDataCardHTML;
        }
    };

    const filterAndRenderUsers = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    };

    const refreshUsers = async () => {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Memuat data pengguna...</td></tr>`;
        cardContainer.innerHTML = `<div class="text-center py-4">Memuat data pengguna...</div>`;
        try {
            allUsers = await fetchUsers();
            filterAndRenderUsers(); // Render dengan filter (awal kosong)
        } catch (error) {
            showNotification(error.message, true);
            const errorHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Gagal memuat data pengguna.</td></tr>`;
            const errorCardHTML = `<div class="text-center py-4 text-red-500">Gagal memuat data pengguna.</div>`;
            tableBody.innerHTML = errorHTML;
            cardContainer.innerHTML = errorCardHTML;
        }
    };

    document.getElementById('add-user-btn').addEventListener('click', () => showUserModal(null, refreshUsers));
    
    searchInput.addEventListener('input', filterAndRenderUsers);

    pageContainer.addEventListener('click', (e) => {
        const target = e.target;
        const parentElement = target.closest('tr') || target.closest('[data-id]');
        if (!parentElement) return;
        const id = parentElement.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const user = allUsers.find(u => u._id === id);
            showUserModal(user, refreshUsers);
        }
        if (target.classList.contains('delete-btn')) {
            showConfirmationModal('Are you sure you want to delete this user?', async () => {
                try {
                    await deleteUser(id);
                    showNotification('User deleted successfully');
                    await refreshUsers();
                } catch (err) {
                    showNotification(err.message, true);
                }
            });
        }
    });

    await refreshUsers();
  },
};

const showUserModal = (user, onSaveSuccess) => {
    const title = user ? 'Edit User' : 'Add User';
    const content = `
        <form id="user-form" class="space-y-4">
            <input type="hidden" id="user-id" value="${user ? user._id : ''}">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" value="${user ? user.name : ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
            </div>
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value="${user ? user.email : ''}" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password ${!user ? '' : '(Leave blank to keep current)'}</label>
                <input type="password" id="password" ${!user ? 'required' : ''} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
            </div>
            <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                    <option value="mahasiswa" ${user && user.role === 'mahasiswa' ? 'selected' : ''}>Mahasiswa</option>
                    <option value="dosen" ${user && user.role === 'dosen' ? 'selected' : ''}>Dosen</option>
                    <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </div>
            <div id="role-specific-fields-modal"></div>
        </form>
    `;

    const onSave = async () => {
        const id = document.getElementById('user-id').value;
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value,
            studentId: document.getElementById('studentId-modal')?.value,
            lecturerId: document.getElementById('lecturerId-modal')?.value,
        };

        if (!userData.password) delete userData.password;

        try {
            if (id) {
                await updateUser(id, userData);
                showNotification('User updated successfully');
            } else {
                await createUser(userData);
                showNotification('User created successfully');
            }
            await onSaveSuccess();
            return true; // Close modal
        } catch (error) {
            showNotification(error.message, true);
            return false; // Keep modal open
        }
    };

    Modal.show(title, content, onSave);

    const roleSelect = document.getElementById('role');
    const roleFieldsContainer = document.getElementById('role-specific-fields-modal');
    
    const updateRoleFields = () => {
        const role = roleSelect.value;
        if (role === 'mahasiswa') {
            roleFieldsContainer.innerHTML = `
                <div>
                    <label for="studentId-modal" class="block text-sm font-medium text-gray-700">Student ID (NIM)</label>
                    <input type="text" id="studentId-modal" value="${user && user.studentId ? user.studentId : ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                </div>`;
        } else if (role === 'dosen') {
            roleFieldsContainer.innerHTML = `
                <div>
                    <label for="lecturerId-modal" class="block text-sm font-medium text-gray-700">Lecturer ID (NIDN)</label>
                    <input type="text" id="lecturerId-modal" value="${user && user.lecturerId ? user.lecturerId : ''}" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                </div>`;
        } else {
            roleFieldsContainer.innerHTML = '';
        }
    };
    
    roleSelect.addEventListener('change', updateRoleFields);
    updateRoleFields();
};

const showConfirmationModal = (message, onConfirm) => {
    Modal.show('Confirmation', `<p>${message}</p>`, async () => {
        await onConfirm();
        return true;
    }, 'Confirm');
};

export default Users;
