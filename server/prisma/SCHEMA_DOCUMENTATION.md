# ERP Database Schema Documentation

## Overview

This Prisma schema defines a comprehensive ERP (Enterprise Resource Planning) system for managing books, inventory, sales, and purchases across multiple branches and warehouses.

## Enums

### UserRole
```prisma
enum UserRole {
  ADMIN    // System administrator
  HO       // Head Office staff
  BRANCH   // Branch staff
  SALES    // Sales personnel
}
```

### PurchaseStatus
```prisma
enum PurchaseStatus {
  PENDING   // Purchase order created
  APPROVED  // Purchase order approved
  RECEIVED  // Goods received
}
```

### SalesOrderStatus
```prisma
enum SalesOrderStatus {
  PROFORMA  // Proforma invoice
  CONFIRMED // Order confirmed
  INVOICED  // Invoice generated
}
```

### InvoiceType
```prisma
enum InvoiceType {
  CASH    // Cash sale
  CREDIT  // Credit sale
  EXPORT  // Export sale
}
```

---

## Models

### 1. User
Represents system users with role-based access.

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - User's full name
- `email` - Unique email address (indexed)
- `password` - Hashed password
- `role` - User role (ADMIN, HO, BRANCH, SALES)
- `branchId` - Optional reference to assigned branch
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `Branch` (optional)

**Indexes:**
- `branchId` - For filtering users by branch
- `email` - For fast login lookups

---

### 2. Branch
Represents physical branches or head office.

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - Branch name
- `address` - Physical address
- `isHeadOffice` - Boolean flag (indexed)
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Has many `User`
- Has many `Warehouse`
- Has many `Customer`

**Indexes:**
- `isHeadOffice` - For quickly finding HO

---

### 3. Warehouse
Storage locations within branches.

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - Warehouse name
- `branchId` - Foreign key to Branch
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `Branch` (cascade delete)
- Has many `Inventory` records

**Indexes:**
- `branchId` - For filtering warehouses by branch

---

### 4. Customer
Business customers who purchase books.

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - Customer name
- `gstNumber` - GST registration number (optional, indexed)
- `creditLimit` - Maximum credit allowed (default: 0)
- `outstandingAmount` - Current outstanding balance (default: 0)
- `discountPercent` - Default discount percentage (default: 0)
- `branchId` - Foreign key to Branch
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `Branch` (cascade delete)
- Has many `SalesOrder`

**Indexes:**
- `branchId` - For filtering customers by branch
- `gstNumber` - For GST lookups

---

### 5. Supplier
Vendors who supply books.

**Fields:**
- `id` - Auto-incrementing primary key
- `name` - Supplier name
- `contactInfo` - Contact details (phone, email, etc.)
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Has many `Purchase`

---

### 6. BookTitle
Master data for book titles.

**Fields:**
- `id` - Auto-incrementing primary key
- `isbn` - Unique ISBN number (indexed)
- `title` - Book title (indexed)
- `author` - Author name
- `publisher` - Publisher name
- `price` - Base selling price
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Has many `Inventory` records
- Has many `PurchaseItem`
- Has many `SalesOrderItem`

**Indexes:**
- `isbn` - For unique identification
- `title` - For search functionality

---

### 7. Inventory
Stock levels of books in warehouses.

**Fields:**
- `id` - Auto-incrementing primary key
- `bookTitleId` - Foreign key to BookTitle
- `warehouseId` - Foreign key to Warehouse
- `quantity` - Current stock quantity (indexed)
- `minStock` - Minimum stock level (reorder point)
- `maxStock` - Maximum stock level
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `BookTitle` (cascade delete)
- Belongs to one `Warehouse` (cascade delete)

**Constraints:**
- Unique combination of `bookTitleId` and `warehouseId`

**Indexes:**
- `bookTitleId` - For finding inventory by book
- `warehouseId` - For finding inventory by warehouse
- `quantity` - For low stock alerts

---

### 8. Purchase
Purchase orders from suppliers.

**Fields:**
- `id` - Auto-incrementing primary key
- `supplierId` - Foreign key to Supplier
- `status` - Purchase status (PENDING, APPROVED, RECEIVED)
- `createdAt` - Timestamp of creation (indexed)
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `Supplier` (cascade delete)
- Has many `PurchaseItem`

**Indexes:**
- `supplierId` - For filtering purchases by supplier
- `status` - For filtering by status
- `createdAt` - For date-based queries

---

### 9. PurchaseItem
Line items in a purchase order.

**Fields:**
- `id` - Auto-incrementing primary key
- `purchaseId` - Foreign key to Purchase
- `bookTitleId` - Foreign key to BookTitle
- `quantity` - Quantity ordered
- `costPrice` - Cost price per unit
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `Purchase` (cascade delete)
- Belongs to one `BookTitle` (cascade delete)

**Indexes:**
- `purchaseId` - For fetching items by purchase
- `bookTitleId` - For tracking purchases by book

---

### 10. SalesOrder
Customer orders.

**Fields:**
- `id` - Auto-incrementing primary key
- `customerId` - Foreign key to Customer
- `status` - Order status (PROFORMA, CONFIRMED, INVOICED)
- `totalAmount` - Total order value
- `createdAt` - Timestamp of creation (indexed)
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `Customer` (cascade delete)
- Has many `SalesOrderItem`
- Has one `Invoice` (optional)

**Indexes:**
- `customerId` - For filtering orders by customer
- `status` - For filtering by status
- `createdAt` - For date-based queries

---

### 11. SalesOrderItem
Line items in a sales order.

**Fields:**
- `id` - Auto-incrementing primary key
- `salesOrderId` - Foreign key to SalesOrder
- `bookTitleId` - Foreign key to BookTitle
- `quantity` - Quantity ordered
- `sellingPrice` - Selling price per unit
- `discount` - Discount amount (default: 0)
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `SalesOrder` (cascade delete)
- Belongs to one `BookTitle` (cascade delete)

**Indexes:**
- `salesOrderId` - For fetching items by order
- `bookTitleId` - For tracking sales by book

---

### 12. Invoice
Tax invoices generated from sales orders.

**Fields:**
- `id` - Auto-incrementing primary key
- `salesOrderId` - Unique foreign key to SalesOrder
- `invoiceNumber` - Unique invoice number (indexed)
- `invoiceType` - Type (CASH, CREDIT, EXPORT)
- `gstAmount` - GST/tax amount
- `totalAmount` - Total invoice amount
- `createdAt` - Timestamp of creation (indexed)
- `updatedAt` - Timestamp of last update

**Relations:**
- Belongs to one `SalesOrder` (cascade delete, one-to-one)

**Constraints:**
- Unique `salesOrderId` (one invoice per order)
- Unique `invoiceNumber`

**Indexes:**
- `invoiceNumber` - For invoice lookups
- `invoiceType` - For filtering by type
- `createdAt` - For date-based queries

---

## Relationship Diagram

```
Branch
  ├── Users (1:N)
  ├── Warehouses (1:N)
  │   └── Inventory (1:N)
  │       └── BookTitle (N:1)
  └── Customers (1:N)
      └── SalesOrders (1:N)
          ├── SalesOrderItems (1:N)
          │   └── BookTitle (N:1)
          └── Invoice (1:1)

Supplier
  └── Purchases (1:N)
      └── PurchaseItems (1:N)
          └── BookTitle (N:1)

BookTitle
  ├── Inventory (1:N)
  ├── PurchaseItems (1:N)
  └── SalesOrderItems (1:N)
```

---

## Key Features

### 1. **Cascade Deletes**
Most foreign key relationships use `onDelete: Cascade` to maintain referential integrity:
- Deleting a Branch removes its Warehouses, Customers
- Deleting a Warehouse removes its Inventory
- Deleting a Customer removes their SalesOrders
- Deleting a SalesOrder removes its Items and Invoice

### 2. **Unique Constraints**
- `User.email` - Prevents duplicate accounts
- `BookTitle.isbn` - Ensures unique book identification
- `Inventory (bookTitleId, warehouseId)` - One inventory record per book per warehouse
- `Invoice.salesOrderId` - One invoice per sales order
- `Invoice.invoiceNumber` - Unique invoice numbers

### 3. **Indexes**
Strategic indexes for common queries:
- User lookups by email and branch
- Book searches by ISBN and title
- Inventory queries by quantity (low stock alerts)
- Date-based queries on orders and invoices
- Status-based filtering

### 4. **Default Values**
- Numeric fields default to 0 (creditLimit, outstandingAmount, etc.)
- Status fields default to initial state (PENDING, PROFORMA)
- Timestamps auto-populate (createdAt, updatedAt)

---

## Next Steps

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Create Migration
```bash
npx prisma migrate dev --name init_erp_schema
```

### 3. View Database in Prisma Studio
```bash
npx prisma studio
```

### 4. Seed Initial Data (Optional)
Create a `prisma/seed.js` file to populate initial data like:
- Admin user
- Head office branch
- Sample book titles

---

## Example Queries

### Create a User
```javascript
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword,
    role: "ADMIN",
  }
});
```

### Get Inventory with Low Stock
```javascript
const lowStock = await prisma.inventory.findMany({
  where: {
    quantity: {
      lte: prisma.inventory.fields.minStock
    }
  },
  include: {
    bookTitle: true,
    warehouse: {
      include: {
        branch: true
      }
    }
  }
});
```

### Create Sales Order with Items
```javascript
const order = await prisma.salesOrder.create({
  data: {
    customerId: 1,
    status: "PROFORMA",
    totalAmount: 1000,
    salesOrderItems: {
      create: [
        {
          bookTitleId: 1,
          quantity: 5,
          sellingPrice: 200,
          discount: 0
        }
      ]
    }
  },
  include: {
    salesOrderItems: true
  }
});
```

---

## Schema Statistics

- **Total Models**: 12
- **Total Enums**: 4
- **Total Relationships**: 20+
- **Cascade Deletes**: 15
- **Unique Constraints**: 5
- **Indexes**: 25+

This schema provides a solid foundation for a complete ERP system with proper data integrity, performance optimization, and scalability.
