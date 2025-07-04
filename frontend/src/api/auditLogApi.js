import { apiRequest } from '../utils/helpers.js';
import { getToken } from '../utils/auth.js';

export const fetchAuditLogs = (params = {}) => {
  const token = getToken();
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/audit-logs?${queryString}`, {}, token);
};