// import Login from '../pages/Login.js';
// import Register from '../pages/Register.js';
// import AdminDashboard from '../pages/admin/AdminDashboard.js';
// import Users from '../pages/admin/Users.js';
// import Courses from '../pages/admin/Courses.js';
// import Schedules from '../pages/admin/Schedules.js';
// import AuditLogs from '../pages/admin/AuditLogs.js';
// import DosenDashboard from '../pages/dosen/DosenDashboard.js';
// import KelolaNilai from '../pages/dosen/KelolaNilai.js';
// import LihatJadwalDosen from '../pages/dosen/LihatJadwalDosen.js';
// import MahasiswaDashboard from '../pages/mahasiswa/MahasiswaDashboard.js';
// import LihatJadwal from '../pages/mahasiswa/LihatJadwal.js';
// import TranskripNilai from '../pages/mahasiswa/TranskripNilai.js';
// import NotFoundPage from '../pages/404.js';
// import { getUser } from './auth.js';

// const routes = [
//     { path: '/', component: () => {
//         const user = getUser();
//         if (user) {
//             if (user.role === 'admin') return AdminDashboard;
//             if (user.role === 'dosen') return DosenDashboard;
//             if (user.role === 'mahasiswa') return MahasiswaDashboard;
//         }
//         return Login;
//     }},
//     { path: '/login', component: () => Login },
//     { path: '/register', component: () => Register },
//     // Admin Routes
//     { path: '/admin/dashboard', component: () => AdminDashboard },
//     { path: '/admin/users', component: () => Users },
//     { path: '/admin/courses', component: () => Courses },
//     { path: '/admin/schedules', component: () => Schedules },
//     { path: '/admin/audit-logs', component: () => AuditLogs },
//     // Dosen Routes
//     { path: '/dosen/dashboard', component: () => DosenDashboard },
//     { path: '/dosen/nilai', component: () => KelolaNilai },
//     { path: '/dosen/jadwal', component: () => LihatJadwalDosen },
//     // Mahasiswa Routes
//     { path: '/mahasiswa/dashboard', component: () => MahasiswaDashboard },
//     { path: '/mahasiswa/jadwal', component: () => LihatJadwal },
//     { path: '/mahasiswa/transkrip', component: () => TranskripNilai },
// ];

// export const navigateTo = url => {
//     history.pushState(null, null, url);
//     dispatchEvent(new PopStateEvent('popstate'));
// };

// export const resolveRoute = async () => {
//     const path = location.pathname;
    
//     // Handle redirect from root
//     if (path === '/') {
//         const user = getUser();
//         let redirectPath = '/login';
//         if (user) {
//             if (user.role === 'admin') redirectPath = '/admin/dashboard';
//             if (user.role === 'dosen') redirectPath = '/dosen/dashboard';
//             if (user.role === 'mahasiswa') redirectPath = '/mahasiswa/dashboard';
//         }
//         history.replaceState(null, null, redirectPath);
//         return resolveRoute(); // Recursive call for the new path
//     }

//     const route = routes.find(r => r.path === path);
    
//     if (route) {
//         const componentFactory = route.component;
//         return componentFactory();
//     }
    
//     return NotFoundPage; // Return 404 component if no route matches
// };



import Login from '../pages/Login.js';
import Register from '../pages/Register.js';
import AdminDashboard from '../pages/admin/AdminDashboard.js';
import Users from '../pages/admin/Users.js';
import Courses from '../pages/admin/Courses.js';
import Schedules from '../pages/admin/Schedules.js';
import AuditLogs from '../pages/admin/AuditLogs.js';
import DosenDashboard from '../pages/dosen/DosenDashboard.js';
import KelolaNilai from '../pages/dosen/KelolaNilai.js';
import LihatJadwalDosen from '../pages/dosen/LihatJadwalDosen.js';
import MahasiswaDashboard from '../pages/mahasiswa/MahasiswaDashboard.js';
import LihatJadwal from '../pages/mahasiswa/LihatJadwal.js';
import TranskripNilai from '../pages/mahasiswa/TranskripNilai.js';
import NotFoundPage from '../pages/404.js';
import { getUser } from './auth.js';

const routes = [
    { path: '/', component: () => {
        const user = getUser();
        if (user) {
            if (user.role === 'admin') return AdminDashboard;
            if (user.role === 'dosen') return DosenDashboard;
            if (user.role === 'mahasiswa') return MahasiswaDashboard;
        }
        return Login;
    }},
    { path: '/login', component: () => Login },
    { path: '/register', component: () => Register },
    // Admin Routes
    { path: '/admin/dashboard', component: () => AdminDashboard },
    { path: '/admin/users', component: () => Users },
    { path: '/admin/courses', component: () => Courses },
    { path: '/admin/schedules', component: () => Schedules },
    { path: '/admin/audit-logs', component: () => AuditLogs },
    // Dosen Routes
    { path: '/dosen/dashboard', component: () => DosenDashboard },
    { path: '/dosen/nilai', component: () => KelolaNilai },
    { path: '/dosen/jadwal', component: () => LihatJadwalDosen },
    // Mahasiswa Routes
    { path: '/mahasiswa/dashboard', component: () => MahasiswaDashboard },
    { path: '/mahasiswa/jadwal', component: () => LihatJadwal },
    { path: '/mahasiswa/transkrip', component: () => TranskripNilai },
];

export const navigateTo = url => {
    // Check if View Transitions API is supported
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            history.pushState(null, null, url);
            dispatchEvent(new PopStateEvent('popstate'));
        });
    } else {
        // Fallback for browsers that don't support View Transitions
        history.pushState(null, null, url);
        dispatchEvent(new PopStateEvent('popstate'));
    }
};

export const resolveRoute = async () => {
    const path = location.pathname;
    
    // Handle redirect from root
    if (path === '/') {
        const user = getUser();
        let redirectPath = '/login';
        if (user) {
            if (user.role === 'admin') redirectPath = '/admin/dashboard';
            if (user.role === 'dosen') redirectPath = '/dosen/dashboard';
            if (user.role === 'mahasiswa') redirectPath = '/mahasiswa/dashboard';
        }
        history.replaceState(null, null, redirectPath);
        return resolveRoute(); // Recursive call for the new path
    }

    const route = routes.find(r => r.path === path);
    
    if (route) {
        const componentFactory = route.component;
        return componentFactory();
    }
    
    return NotFoundPage; // Return 404 component if no route matches
};