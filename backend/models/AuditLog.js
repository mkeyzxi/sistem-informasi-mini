// File: backend/models/AuditLog.js
import mongoose from 'mongoose';

const auditLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., 'CREATE_USER', 'UPDATE_COURSE', 'DELETE_GRADE'
    },
    entity: { // Nama model yang terpengaruh
      type: String,
      required: true, // e.g., 'User', 'Course'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    before: { // Keadaan sebelum (untuk update/delete)
      type: Object,
    },
    after: { // Keadaan sesudah (untuk create/update)
      type: Object,
    },
    ipAddress: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;