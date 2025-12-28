const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define all models
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('ADMIN', 'HO', 'BRANCH', 'SALES', 'CUSTOMER'), allowNull: false },
  branchId: { type: DataTypes.INTEGER },
  customerId: { type: DataTypes.INTEGER },
  allowedIPs: { type: DataTypes.STRING }
}, { tableName: 'User', timestamps: true });

const Branch = sequelize.define('Branch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  isHeadOffice: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'Branch', timestamps: true });

const Warehouse = sequelize.define('Warehouse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  branchId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Warehouse', timestamps: true });

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  gstNumber: { type: DataTypes.STRING },
  creditLimit: { type: DataTypes.FLOAT, defaultValue: 0 },
  outstandingAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  discountPercent: { type: DataTypes.FLOAT, defaultValue: 0 },
  address: { type: DataTypes.STRING },
  branchId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Customer', timestamps: true });

const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  contactInfo: { type: DataTypes.STRING }
}, { tableName: 'Supplier', timestamps: true });

const BookTitle = sequelize.define('BookTitle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING },
  publisher: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'BookTitle', timestamps: true });

const Inventory = sequelize.define('Inventory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bookTitleId: { type: DataTypes.INTEGER, allowNull: false },
  warehouseId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'Inventory', timestamps: true });

const Purchase = sequelize.define('Purchase', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  supplierId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'RECEIVED'), defaultValue: 'PENDING' },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { tableName: 'Purchase', timestamps: true });

const PurchaseItem = sequelize.define('PurchaseItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  purchaseId: { type: DataTypes.INTEGER, allowNull: false },
  bookTitleId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'PurchaseItem', timestamps: true });

const SalesOrder = sequelize.define('SalesOrder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('PROFORMA', 'CONFIRMED', 'INVOICED'), defaultValue: 'PROFORMA' },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  requiresApproval: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'SalesOrder', timestamps: true });

const SalesOrderItem = sequelize.define('SalesOrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  salesOrderId: { type: DataTypes.INTEGER, allowNull: false },
  bookTitleId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  sellingPrice: { type: DataTypes.FLOAT, allowNull: false },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { tableName: 'SalesOrderItem', timestamps: true });

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  salesOrderId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  invoiceType: { type: DataTypes.ENUM('CASH', 'CREDIT', 'EXPORT'), allowNull: false },
  gstAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'Invoice', timestamps: true });

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false },
  entity: { type: DataTypes.STRING, allowNull: false },
  entityId: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'AuditLog', timestamps: true, updatedAt: false });

// Define associations
User.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
User.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });

Branch.hasMany(User, { foreignKey: 'branchId', as: 'users' });
Branch.hasMany(Warehouse, { foreignKey: 'branchId', as: 'warehouses' });
Branch.hasMany(Customer, { foreignKey: 'branchId', as: 'customers' });

Warehouse.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Warehouse.hasMany(Inventory, { foreignKey: 'warehouseId', as: 'inventory' });

Customer.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
Customer.hasMany(User, { foreignKey: 'customerId', as: 'users' });
Customer.hasMany(SalesOrder, { foreignKey: 'customerId', as: 'salesOrders' });

BookTitle.hasMany(Inventory, { foreignKey: 'bookTitleId', as: 'inventory' });
BookTitle.hasMany(PurchaseItem, { foreignKey: 'bookTitleId', as: 'purchaseItems' });
BookTitle.hasMany(SalesOrderItem, { foreignKey: 'bookTitleId', as: 'salesOrderItems' });

Inventory.belongsTo(BookTitle, { foreignKey: 'bookTitleId', as: 'bookTitle' });
Inventory.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

Purchase.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Purchase.hasMany(PurchaseItem, { foreignKey: 'purchaseId', as: 'purchaseItems' });

PurchaseItem.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' });
PurchaseItem.belongsTo(BookTitle, { foreignKey: 'bookTitleId', as: 'bookTitle' });

SalesOrder.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
SalesOrder.hasMany(SalesOrderItem, { foreignKey: 'salesOrderId', as: 'salesOrderItems' });
SalesOrder.hasOne(Invoice, { foreignKey: 'salesOrderId', as: 'invoice' });

SalesOrderItem.belongsTo(SalesOrder, { foreignKey: 'salesOrderId', as: 'salesOrder' });
SalesOrderItem.belongsTo(BookTitle, { foreignKey: 'bookTitleId', as: 'bookTitle' });

Invoice.belongsTo(SalesOrder, { foreignKey: 'salesOrderId', as: 'salesOrder' });

AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Branch,
  Warehouse,
  Customer,
  Supplier,
  BookTitle,
  Inventory,
  Purchase,
  PurchaseItem,
  SalesOrder,
  SalesOrderItem,
  Invoice,
  AuditLog
};
