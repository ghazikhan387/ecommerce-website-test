# Accounting & Reporting API

The system provides essential financial reports for tracking business health.

## 1. Credit & Receivables

### Customer Outstanding Report
- **Endpoint**: `GET /api/reports/outstanding`
- **Auth**: Admin/HO/Branch/Sales
- **Query**: `?branchId=1` (Optional for Admin/HO)
- **Output**: List of all customers with `outstandingAmount > 0`, sorted by highest debt.

### Receivables Aging Report
- **Endpoint**: `GET /api/reports/aging`
- **Auth**: Admin/HO
- **Description**: Break down of unpaid credit invoices into time buckets:
    - 0-30 Days
    - 31-60 Days
    - 61-90 Days
    - 90+ Days
- **Logic**: Calculates age based on Invoice Creation Date.

## 2. Operational Reports

### Invoice Listing
- **Endpoint**: `GET /api/reports/invoices`
- **Auth**: All Users
- **Query Params**:
    - `fromDate=2023-01-01`
    - `toDate=2023-12-31`
    - `customerId=5`
    - `invoiceType=CREDIT`
- **Output**: Filterable list of invoices with full details.

### Day Book
- **Endpoint**: `GET /api/reports/daybook`
- **Auth**: Admin/HO/Branch
- **Query**: `?date=2023-10-25` (Defaults to Today)
- **Output**: Chronological list of all financial transactions for the day:
    - **Sales**: Invoices generated
    - **Purchases**: POs raised/received
    - **Summary**: Total Sales Value, Total Transaction Count

## 3. Financial Analysis

### Profitability Analysis
- **Endpoint**: `GET /api/reports/profitability`
- **Auth**: Admin/HO
- **Query**: `?type=title` OR `?type=customer`
- **Logic**:
    - **Revenue**: Actual Selling Price × Quantity
    - **Cost**: Latest Purchase Cost (or 70% of price estimate) × Quantity
    - **Profit**: Revenue - Cost
    - **Margin**: (Profit / Revenue) %
- **Use Case**: Identify most profitable books or most valuable customers.
