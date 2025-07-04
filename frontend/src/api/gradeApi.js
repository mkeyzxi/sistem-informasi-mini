import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

export const fetchGrades = (params = {}) => {
  const token = getToken();
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/grades?${queryString}`, {}, token);
};

export const addGrade = (gradeData) => {
  const token = getToken();
  return apiRequest('/grades', {
    method: 'POST',
    body: JSON.stringify(gradeData),
  }, token);
};

export const updateGrade = (id, gradeData) => {
  const token = getToken();
  return apiRequest(`/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(gradeData),
  }, token);
};

export const deleteGrade = (id) => {
    const token = getToken();
    return apiRequest(`/grades/${id}`, {
        method: 'DELETE',
    }, token);
};

export const fetchTranscript = (studentId) => {
  const token = getToken();
  return apiRequest(`/grades/transcript/${studentId}`, {}, token);
};

export const fetchGradesByCourse = (courseId) => {
    const token = getToken();
    return apiRequest(`/grades/course/${courseId}`, {}, token);
};