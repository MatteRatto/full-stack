# MR app - Secure Authentication Application

A full-stack application for secure user authentication with advanced JWT session management.

## 🚀 Features

### Authentication

- **User registration** with complete data validation
- **Secure login** with password hashing (bcrypt)
- **Logout** with session cleanup
- **JWT authentication** with auto-renewable tokens

### Advanced Session Management

- **Real-time monitoring** of token status
- **Progressive expiration notifications** (15, 10, 5, 2, 1 minutes)
- **Automatic token refresh** when nearing expiration
- **Visual indicator** of session status
- **Confirmation modal** to extend session
- **Server-client synchronization** of token status

### User Profile

- **Profile view** with detailed information
- **Profile editing** (name, email)
- **Optional password change** with validation

### UI/UX

- **Responsive design** with Tailwind CSS
- **Italian interface** fully localized
- **Toast notifications** for user feedback
- **Smooth animations** and transitions
- **Mobile-friendly layout**

## 🛠️ Technologies Used

### Frontend

- **React 18** with TypeScript
- **React Router** for navigation
- **React Hook Form** + Zod for validation
- **Tailwind CSS** for styling
- **React Toastify** for notifications
- **Vite** as build tool

### Backend

- **Node.js** with Express
- **MySQL** as database
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-rate-limit** for protection
- **helmet** for security

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd Myapp
```

2. **Backend Setup**

```bash
cd backend
npm install
```

3. **Configure the database**

```bash
# Create a MySQL database
mysql -u root -p
CREATE DATABASE Myapp_db;
```

4. **Configure environment variables**

```bash
# Create .env file in backend folder
cp .env.example .env

# Edit variables in .env:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Myapp_db
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

5. **Start the backend**

```bash
npm run dev
```

6. **Frontend Setup**

```bash
cd ../frontend
npm install
```

7. **Configure frontend variables**

```bash
# Create .env.local file
VITE_API_BASE_URL=http://localhost:5000/api
```

8. **Start the frontend**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Security

### Implemented Measures

- **Password hashing** with bcrypt (salt rounds: 10)
- **JWT tokens** with configurable expiration
- **Rate limiting** (100 requests per 15 minutes)
- **Helmet** for security headers
- **CORS** configured for specific domain
- **Input validation** on both server and client side

### Token Management

- **Token expiration**: 30 minutes (configurable)
- **Automatic refresh**: when 15 minutes remain
- **Expiration check**: every minute on client side
- **Server synchronization**: every 2 minutes

## 📊 Advanced Features

### Session Monitoring

- Visual indicator of token status in navbar
- Progressive expiration notifications
- Modal for session extension confirmation
- Detailed logging for debugging

### Validation

- **Client-side**: React Hook Form + Zod schemas
- **Server-side**: express-validator

### UI Components

- Consistent design system
- Reusable components
- Responsive design
- Loading states and visual feedback

## 🚀 Deploy

### Backend (Node.js)

```bash
npm run build
npm start
```

### Frontend (Static)

```bash
npm run build
# Deploy the dist/ folder
```

## 📝 API Endpoints

### Auth

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/token-status` - Token status
- `POST /api/auth/logout` - Logout

## 🎨 Customization

### Colors (Tailwind)

The project uses a customizable primary color in `tailwind.config.js`:

```javascript
colors: {
  primary: colors.sky;
}
```

### JWT Configuration

Edit `backend/src/config/config.js` to customize:

- Token duration
- Expiration thresholds
- Security configurations

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Matteo Ratto