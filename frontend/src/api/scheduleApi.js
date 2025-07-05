import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

export const fetchSchedules = (params = {}) => {
  const token = getToken();
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/schedules?${queryString}`, {}, token);
};

export const createSchedule = (scheduleData) => {
  const token = getToken();
  return apiRequest('/schedules', {
    method: 'POST',
    body: JSON.stringify(scheduleData),
  }, token);
};

export const updateSchedule = (id, scheduleData) => {
  const token = getToken();
  return apiRequest(`/schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(scheduleData),
  }, token);
};

export const deleteSchedule = (id) => {
  const token = getToken();
  return apiRequest(`/schedules/${id}`, {
    method: 'DELETE',
  }, token);
};