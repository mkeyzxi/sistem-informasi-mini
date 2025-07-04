// File: frontend/src/api/userApi.js
import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

export const fetchUsers = (params = {}) => {
  const token = getToken();
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/users?${queryString}`, {}, token);
};

export const fetchUserById = (id) => {
  const token = getToken();
  return apiRequest(`/users/${id}`, {}, token);
};

// PERBAIKAN: Menambahkan 'export' di sini
export const createUser = (userData) => {
  const token = getToken();
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }, token);
};

// PERBAIKAN: Menambahkan 'export' di sini
export const updateUser = (id, userData) => {
  const token = getToken();
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }, token);
};

// PERBAIKAN: Menambahkan 'export' di sini
export const deleteUser = (id) => {
  const token = getToken();
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }, token);
};