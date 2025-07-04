// import { apiRequest } from '../utils/helpers.js';
// import { getToken } from '../utils/auth.js';

// export const fetchGrades = (params = {}) => {
//   const token = getToken();
//   const queryString = new URLSearchParams(params).toString();
//   return apiRequest(`/grades?${queryString}`, {}, token);
// };

// export const addGrade = (gradeData) => {
//   const token = getToken();
//   return apiRequest('/grades', {
//     method: 'POST',
//     body: JSON.stringify(gradeData),
//   }, token);
// };

// export const updateGrade = (id, gradeData) => {
//   const token = getToken();
//   return apiRequest(`/grades/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(gradeData),
//   }, token);
// };

// export const deleteGrade = (id) => {
//     const token = getToken();
//     return apiRequest(`/grades/${id}`, {
//         method: 'DELETE',
//     }, token);
// };

// export const fetchTranscript = (studentId) => {
//   const token = getToken();
//   return apiRequest(`/grades/transcript/${studentId}`, {}, token);
// };

// export const fetchGradesByCourse = (courseId) => {
//     const token = getToken();
//     return apiRequest(`/grades/course/${courseId}`, {}, token);
// };








import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

/**
 * Mengambil semua nilai untuk mata kuliah tertentu.
 * @param {string} courseId - ID mata kuliah.
 */
export const fetchGradesByCourse = (courseId) => {
  const token = getToken();
  // Asumsi endpoint ini ada di backend Anda
  return apiRequest(`/grades/course/${courseId}`, {}, token);
};

/**
 * Menambahkan nilai baru untuk seorang mahasiswa.
 * @param {object} gradeData - Data nilai { student, course, score }.
 */
export const addGrade = (gradeData) => {
  const token = getToken();
  return apiRequest('/grades', {
    method: 'POST',
    body: JSON.stringify(gradeData),
  }, token);
};

/**
 * Memperbarui nilai yang sudah ada.
 * @param {string} gradeId - ID nilai.
 * @param {object} gradeData - Data pembaruan { score }.
 */
export const updateGrade = (gradeId, gradeData) => {
  const token = getToken();
  return apiRequest(`/grades/${gradeId}`, {
    method: 'PUT',
    body: JSON.stringify(gradeData),
  }, token);
};

/**
 * Mengambil transkrip nilai untuk seorang mahasiswa.
 * @param {string} studentId - ID mahasiswa.
 */
export const fetchTranscript = (studentId) => {
    const token = getToken();
    return apiRequest(`/grades/transcript/${studentId}`, {}, token);
};
