// import { getUser } from '../utils/auth.js';

// const Sidebar = async () => {
//     const user = getUser();
//     const role = user ? user.role : null;

//     const adminLinks = `
//         <a href="/admin/dashboard" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Dashboard</a>
//         <a href="/admin/users" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Users</a>
//         <a href="/admin/courses" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Mata Kuliah</a>
//         <a href="/admin/schedules" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Jadwal</a>
//         <a href="/admin/audit-logs" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Audit Logs</a>
//     `;

//     const dosenLinks = `
//         <a href="/dosen/dashboard" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Dashboard</a>
//         <a href="/dosen/jadwal" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Jadwal Mengajar</a>
//         <a href="/dosen/nilai" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Kelola Nilai</a>
//     `;

//     const mahasiswaLinks = `
//         <a href="/mahasiswa/dashboard" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Dashboard</a>
//         <a href="/mahasiswa/jadwal" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Jadwal Kuliah</a>
//         <a href="/mahasiswa/transkrip" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">Transkrip Nilai</a>
//     `;

//     let navLinks = '';
//     if (role === 'admin') navLinks = adminLinks;
//     else if (role === 'dosen') navLinks = dosenLinks;
//     else if (role === 'mahasiswa') navLinks = mahasiswaLinks;

//     return `
//         <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
//             <div class="flex-1 flex flex-col min-h-0 bg-indigo-700">
//                 <div class="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-800">
//                     <h1 class="text-white text-2xl font-bold">SIAKAD</h1>
//                 </div>
//                 <div class="flex-1 flex flex-col overflow-y-auto">
//                     <nav class="flex-1 px-2 py-4 space-y-1">
//                         ${navLinks}
//                     </nav>
//                 </div>
//             </div>
//         </div>
//     `;
// };

// export default Sidebar;

import { getUser } from '../utils/auth.js';

const Sidebar = async () => {
    const user = getUser();
    const role = user ? user.role : null;

    const adminLinks = [
        { href: '/admin/dashboard', text: 'Dashboard', icon: 'home' },
        { href: '/admin/users', text: 'Users', icon: 'user' },
        { href: '/admin/courses', text: 'Mata Kuliah', icon: 'book' },
        { href: '/admin/schedules', text: 'Jadwal', icon: 'calendar' },
        { href: '/admin/audit-logs', text: 'Audit Logs', icon: 'clipboard' },
    ];

    const dosenLinks = [
        { href: '/dosen/dashboard', text: 'Dashboard', icon: 'home' },
        { href: '/dosen/jadwal', text: 'Jadwal Mengajar', icon: 'calendar' },
        { href: '/dosen/nilai', text: 'Kelola Nilai', icon: 'check' },
    ];

    const mahasiswaLinks = [
        { href: '/mahasiswa/dashboard', text: 'Dashboard', icon: 'home' },
        { href: '/mahasiswa/jadwal', text: 'Jadwal Kuliah', icon: 'calendar' },
        { href: '/mahasiswa/transkrip', text: 'Transkrip Nilai', icon: 'document' },
    ];

    let navData = [];
    if (role === 'admin') navData = adminLinks;
    else if (role === 'dosen') navData = dosenLinks;
    else if (role === 'mahasiswa') navData = mahasiswaLinks;

    const icons = {
        home: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9.75L12 3l9 6.75M4.5 10.5V20h5.25v-4.5a1.5 1.5 0 013 0V20h5.25V10.5"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 12c2.67 0 8 1.34 8 4v4H4v-4c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"/></svg>`,
        book: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 006.5 22H20V4H6.5A2.5 2.5 0 004 6.5v13z"/></svg>`,
        calendar: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3M16 7V3M3 11h18M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
        clipboard: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 2h6a1 1 0 011 1v1h1a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg>`,
        document: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 4h10l4 4v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>`,
    };

    const desktopLinks = navData.map(
        ({ href, text, icon }) => `
            <a href="${href}" data-link class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                ${icons[icon] || ''}<span>${text}</span>
            </a>`
    ).join('');

    const mobileLinks = navData.map(
        ({ href, text, icon }) => `
            <a href="${href}" data-link class="flex-1 flex flex-col items-center justify-center text-sm text-indigo-600 hover:text-indigo-800">
                ${icons[icon] || ''}<span class="text-xs">${text}</span>
            </a>`
    ).join('');

    return `
        <!-- Sidebar Desktop -->
        <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <div class="flex-1 flex flex-col min-h-0 bg-indigo-700">
                <div class="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-800">
                    <h1 class="text-white text-2xl font-bold">SIAKAD</h1>
                </div>
                <div class="flex-1 flex flex-col overflow-y-auto">
                    <nav class="flex-1 px-2 py-4 space-y-1">
                        ${desktopLinks}
                    </nav>
                </div>
            </div>
        </div>

        <!-- Bottom Nav for Mobile -->
        <div class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white shadow border-t flex justify-around py-2">
            ${mobileLinks}
        </div>
    `;
};

export default Sidebar;
