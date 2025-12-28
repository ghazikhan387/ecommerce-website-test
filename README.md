# Full-Stack ERP Application

A modern full-stack web application built with React, Node.js, Express, PostgreSQL, and Prisma ORM with JWT-based authentication.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
erp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Express backend
│   ├── middleware/        # Custom middleware
│   ├── prisma/           # Prisma schema
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Server entry point
│   ├── .env              # Environment variables
│   └── package.json
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
cd erp
```

### 2. Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:

```sql
CREATE DATABASE erp_db;
```

3. Update the `DATABASE_URL` in `server/.env`:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/erp_db?schema=public"
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## 🔑 Environment Variables

### Backend (`server/.env`)

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/erp_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Users (Protected)

- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users

**Note:** Protected routes require an `Authorization` header with a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

## 🎨 Features

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ Logout functionality

### UI/UX
- ✅ Modern, responsive design
- ✅ Gradient backgrounds and animations
- ✅ Loading states
- ✅ Error handling and display
- ✅ Form validation
- ✅ Protected route navigation

### Dashboard
- ✅ User profile display
- ✅ Statistics cards
- ✅ User list table
- ✅ Responsive layout

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔧 Development Commands

### Backend

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npx prisma studio # Open Prisma Studio (database GUI)
npx prisma migrate dev # Create new migration
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚢 Production Deployment

### Backend

1. Set `NODE_ENV=production` in your environment
2. Update `JWT_SECRET` to a strong, random value
3. Configure your production database URL
4. Run migrations: `npx prisma migrate deploy`
5. Start server: `npm start`

### Frontend

1. Update `VITE_API_URL` to your production API URL
2. Build the app: `npm run build`
3. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- HTTP-only token storage (localStorage)
- CORS configuration
- Input validation
- SQL injection protection (via Prisma)

## 📝 License

ISC

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🎉**
