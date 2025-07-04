// File: backend/controllers/auditLogController.js
import asyncHandler from 'express-async-handler';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
const getAuditLogs = asyncHandler(async (req, res) => {
  const { user, action, search } = req.query;
  const query = {};

  if (user) query.user = user;
  if (action) query.action = { $regex: action, $options: 'i' };
  
  const logs = await AuditLog.find(query)
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .limit(200); // Batasi hasil untuk performa

  res.json(logs);
});

export { getAuditLogs };