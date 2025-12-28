const { AuditLog } = require('../models');

const logAction = async (userId, action, entity, entityId, details = null) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId: String(entityId),
      details: typeof details === 'object' ? JSON.stringify(details) : details
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't crash the main flow if logging fails
  }
};

module.exports = { logAction };
