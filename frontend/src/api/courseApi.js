// // File: frontend/src/api/courseApi.js
// import { apiRequest } from '../utils/helpers.js';
// import { getToken } from '../utils/auth.js';

// export const fetchCourses = (params = {}) => {
//   const token = getToken();
//   const queryString = new URLSearchParams(params).toString();
//   return apiRequest(`/courses?${queryString}`, {}, token);
// };

// export const createCourse = (courseData) => {
//   const token = getToken();
//   return apiRequest('/courses', {
//     method: 'POST',
//     body: JSON.stringify(courseData),
//   }, token);
// };

// export const updateCourse = (id, courseData) => {
//   const token = getToken();
//   return apiRequest(`/courses/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(courseData),
//   }, token);
// };

// export const deleteCourse = (id) => {
//   const token = getToken();
//   return apiRequest(`/courses/${id}`, {
//     method: 'DELETE',
//   }, token);
// };

import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

/**
 * Mengambil semua mata kuliah.
 */
export const fetchCourses = () => {
  // FIX: Menambahkan pengambilan dan pengiriman token untuk otentikasi
  const token = getToken();
  return apiRequest('/courses', {}, token);
};

/**
 * Membuat mata kuliah baru.
 * @param {object} courseData - Data untuk mata kuliah baru.
 */
export const createCourse = (courseData) => {
  const token = getToken();
  return apiRequest('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  }, token);
};

/**
 * Memperbarui mata kuliah yang sudah ada.
 * @param {string} id - ID mata kuliah.
 * @param {object} courseData - Data pembaruan.
 */
export const updateCourse = (id, courseData) => {
  const token = getToken();
  return apiRequest(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  }, token);
};

/**
 * Menghapus mata kuliah.
 * @param {string} id - ID mata kuliah.
 */
export const deleteCourse = (id) => {
  const token = getToken();
  return apiRequest(`/courses/${id}`, {
    method: 'DELETE',
  }, token);
};

/**
 * Mendaftarkan mahasiswa ke dalam sebuah mata kuliah.
 * @param {string} courseId - ID mata kuliah.
 * @param {object} data - Data berisi array NIM mahasiswa, contoh: { studentNims: ["nim1", "nim2"] }.
 */
export const enrollStudentsInCourse = (courseId, data) => {
  const token = getToken();
  // PENTING: Endpoint ini perlu Anda buat di backend.
  // Endpoint ini harus menerima request POST dengan body seperti { studentNims: ["nim1", "nim2", ...] }
  return apiRequest(`/courses/${courseId}/enroll`, {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
};
