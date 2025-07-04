// // File: frontend/src/api/authApi.js
// import { apiRequest } from '../utils/helpers.js';
// import { getToken } from '../utils/auth.js';

// export const loginUser = (email, password) => {
//   return apiRequest('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password }),
//   });
// };

// export const registerUser = (userData) => {
//   return apiRequest('/auth/register', {
//     method: 'POST',
//     body: JSON.stringify(userData),
//   });
// };

// export const getProfile = () => {
//   const token = getToken();
//   return apiRequest('/auth/me', {}, token);
// };


import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

/**
 * Mengirim permintaan login ke API.
 * @param {string} email - Email pengguna.
 * @param {string} password - Password pengguna.
 */
export const loginUser = (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Mengirim permintaan registrasi ke API.
 * @param {object} userData - Data pengguna baru.
 */
export const registerUser = (userData) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Mengambil profil pengguna yang sedang login.
 */
export const getProfile = () => {
  const token = getToken();
  return apiRequest('/auth/me', {}, token);
};