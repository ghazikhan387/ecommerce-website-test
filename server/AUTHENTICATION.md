# Authentication & Role-Based Access Control (RBAC) System

The ERP system uses a robust JWT-based authentication system with Role-Based Access Control.

## Key Components

### 1. User Roles
The system defines 4 distinct roles:
- **ADMIN**: Full system access
- **HO**: Head Office staff (can manage most entities)
- **BRANCH**: Branch-level staff (limited to branch operations)
- **SALES**: Sales personnel (limited sales operations)

### 2. Authentication Flow
1. **Registration** (`POST /api/auth/register`)
   - Requires `name`, `email`, `password`
   - Optional: `role` (defaults to SALES), `branchId`
   - Returns JWT token

2. **Login** (`POST /api/auth/login`)
   - Requires `email`, `password`
   - Returns JWT token + User Info (including Role & Branch)

### 3. Middleware Security
The `middleware/auth.js` file provides two key security functions:

#### `authMiddleware`
- Verifies JWT token from `Authorization` header
- Checks token expiration
- Fetches user from database
- Attaches user object to `req.user`

#### `checkRole(allowedRoles)`
- Checks if the authenticated user has one of the allowed roles
- Returns 403 Forbidden if user lacks permission
- Returns 401 Unauthorized if user is not logged in

### 4. Implementation Example

Protecting a route for Admin only:
```javascript
router.post('/create-user', authMiddleware, checkRole(['ADMIN']), controller);
```

Protecting a route for Admin and HO:
```javascript
router.post('/create-branch', authMiddleware, checkRole(['ADMIN', 'HO']), controller);
```

### 5. Protected Routes Summary

| Endpoint | Method | Middleware | Access |
|----------|--------|------------|--------|
| `/api/auth/*` | POST | None | Public |
| `/api/users/me` | GET | `authMiddleware` | Any Authenticated User |
| `/api/users/` | GET | `authMiddleware`, `checkRole(['ADMIN', 'HO'])` | Admin & HO |
| `/api/branches` | GET | `authMiddleware` | Any Authenticated User |
| `/api/branches` | POST | `authMiddleware`, `checkRole(['ADMIN', 'HO'])` | Admin & HO |

## Best Practices Used
- **Structuring**: Auth logic separated into middleware
- **Hashing**: Passwords hashed with bcrypt (cost factor 10)
- **Stateless**: Uses JWT for stateless authentication
- **Explicit**: Roles must be explicitly granted (default to SALES)
- **Protected by Default**: All business logic routes require authentication
