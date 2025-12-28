# Sales & Order Management API

The sales system handles the full lifecycle from proforma to invoicing, with strict financial and inventory controls.

## 1. Sales Cycle

### Create Proforma Order
- **Endpoint**: `POST /api/sales`
- **Auth**: Sales/Branch/HO/Admin
- **Body**:
  ```json
  {
    "customerId": 1,
    "items": [
      { "bookTitleId": 1, "quantity": 10, "discountPercent": 5 } 
      // discountPercent is optional; customer default used if missing
    ]
  }
  ```
- **Logic**: Creates valid order with status `PROFORMA`. Calculates totals based on selling price - discount.

### Confirm Order
- **Endpoint**: `POST /api/sales/:id/confirm`
- **Auth**: Branch/HO/Admin
- **Logic**: Updates status to `CONFIRMED`. Locks the order for processing.

### Generate Invoice
- **Endpoint**: `POST /api/sales/:id/invoice`
- **Auth**: Branch/HO/Admin
- **Body**:
  ```json
  {
    "invoiceType": "CREDIT", // CASH, CREDIT, EXPORT
    "warehouseId": 1         // Warehouse to deduct stock from
  }
  ```
- **Critical Logic (Transactional)**:
  1.  **Credit Check**: If `CREDIT`, checks `(Outstanding + OrderTotal) <= CreditLimit`. Fails if exceeded.
  2.  **Inventory Check**: Verifies warehouse has sufficient stock. Fails if insufficient.
  3.  **Deduct Inventory**: Reduces stock for all items.
  4.  **Update Balance**: If `CREDIT`, adds amount to Customer's `outstandingAmount`.
  5.  **Create Invoice**: Generates invoice record with taxes.
  6.  **Update Status**: Sets order to `INVOICED`.

### View Delivery Challan
- **Endpoint**: `GET /api/sales/:id/challan`
- **Auth**: All Users
- **Logic**: Returns simplified payload (Items + Quantities + Address) suitable for printing delivery slips.

## 2. Business Rules
- **Discount Priority**: Item-level discount > Customer-level discount.
- **Branch Restriction**: Sales staff can only create orders for customers in their own branch (if enforced).
- **Credit Control**: Strict blocking of invoices if credit limit is breached.
- **Inventory integrity**: Cannot invoice if stock is physically missing (prevents negative stock).
