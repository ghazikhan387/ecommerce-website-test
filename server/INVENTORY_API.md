# Inventory & Stock Management API

The system provides comprehensive APIs for managing books, stock, and procurement.

## 1. Book Management

### Create Book Title
- **Endpoint**: `POST /api/inventory/books`
- **Auth**: Admin/HO
- **Body**: 
  ```json
  { 
    "isbn": "978-123", 
    "title": "New Book", 
    "author": "Author Name", 
    "price": 19.99,
    "publisher": "Pub Co" 
  }
  ```

## 2. Stock Management

### View Stock
- **Endpoint**: `GET /api/inventory/stock`
- **Auth**: All Users
- **Query Params**: `?warehouseId=1&bookTitleId=5`
- **Description**: View inventory levels with filtering.

### Manual Stock Adjustment
- **Endpoint**: `POST /api/inventory/adjust-stock`
- **Auth**: Admin/HO/Branch
- **Body**:
  ```json
  {
    "warehouseId": 1,
    "bookTitleId": 5,
    "quantity": 10,   // Positive to add, negative to reduce
    "reason": "Stock Correction"
  }
  ```
- **Note**: Transactional update.

### Transfer Stock
- **Endpoint**: `POST /api/inventory/transfer`
- **Auth**: Admin/HO
- **Body**:
  ```json
  {
    "sourceWarehouseId": 1,
    "targetWarehouseId": 2,
    "bookTitleId": 5,
    "quantity": 50
  }
  ```
- **Logic**: Atomically reduces stock from source and increments in target. Fails if source has insufficient stock.

### Low Stock Alerts
- **Endpoint**: `GET /api/inventory/alerts/low-stock`
- **Auth**: All Authenticated Users
- **Query Params**: `?warehouseId=1`
- **Logic**: Returns items where `quantity <= minStock`.

## 3. Procurement (Purchases)

### Create Purchase Order (Auto-Create Book)
- **Endpoint**: `POST /api/purchases`
- **Auth**: Admin/HO
- **Feature**: If a book title doesn't exist (by ISBN), it is automatically created using the provided details.
- **Body**:
  ```json
  {
    "supplierId": 1,
    "items": [
      {
        "isbn": "NEW-ISBN-123",
        "title": "Auto Created Book",
        "author": "John Doe",
        "price": 25.00,
        "quantity": 100,
        "costPrice": 15.00
      }
    ]
  }
  ```

### Receive Goods (Update Inventory)
- **Endpoint**: `POST /api/purchases/:id/status`
- **Auth**: Admin/HO/Branch
- **Body**:
  ```json
  {
    "status": "RECEIVED",
    "warehouseId": 1
  }
  ```
- **Logic**: When status is set to `RECEIVED`, the system **automatically increments inventory** for all items in the purchase order at the specified warehouse. This is a transactional operation.
