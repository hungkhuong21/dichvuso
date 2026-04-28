# DichVuSo - Digital Services Platform 🚀

<div align="center">

**Nền tảng quản lý dịch vụ số toàn diện với giao diện người dùng hiện đại, hệ thống quản trị mạnh mẽ, API backend có khả năng mở rộng, và triển khai dễ dàng với Docker.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-11+-E0234E?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16+-000000?logo=next.js)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

[Demo](#) • [Documentation](#) • [Issues](../../issues) • [Discussions](../../discussions)

</div>

---

## 📋 Mục Lục

- [🎯 Giới thiệu](#-giới-thiệu)
- [⚡ Quick Start](#-quick-start)
- [🏗️ Kiến trúc dự án](#-kiến-trúc-dự-án)
- [🛠️ Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [📋 Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [🚀 Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy)
- [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [💻 Development](#-development)
- [🐳 Production Deployment](#-production-deployment)
- [📚 API Documentation](#-api-documentation)
- [❓ Troubleshooting](#-troubleshooting)
- [💡 Tips & Best Practices](#-tips--best-practices)
- [🤝 Contributing](#-contributing)
- [📞 Support & Contact](#-support--contact)
- [📄 License](#-license)

---

## 🎯 Giới Thiệu

**DichVuSo** là một nền tảng quản lý và cung cấp dịch vụ số hoàn chỉnh, được thiết kế với kiến trúc hiện đại và dễ mở rộng. Dự án này cung cấp:

- ✅ **Frontend hiện đại** - Giao diện người dùng tương tác cao với React 19 + Tailwind CSS, xây dựng bằng Vite
- ✅ **Backend mạnh mẽ** - RESTful API được phát triển bằng NestJS với hỗ trợ xác thực JWT và Clerk
- ✅ **Admin Dashboard** - Bảng điều khiển quản trị tính năng đầy đủ với Next.js 16
- ✅ **Xác thực & Bảo mật** - Hỗ trợ JWT authentication và Clerk OAuth integration
- ✅ **Upload Files** - Xử lý tải lên file với Multer
- ✅ **API Documentation** - Swagger/OpenAPI documentation tự động
- ✅ **Docker Support** - Triển khai dễ dàng với Docker & Docker Compose
- ✅ **Database** - SQLite cho phát triển, dễ dàng nâng cấp cho production (PostgreSQL, MySQL)
- ✅ **TypeScript** - Type-safe codebase trên toàn stack
- ✅ **Testing** - Jest cho unit tests, E2E tests

### Thích hợp cho

- 🏢 Các nền tảng dịch vụ B2B/B2C
- 🛍️ Thị trường dịch vụ (Service marketplace)
- 📱 Các ứng dụng tìm kiếm và đặt dịch vụ
- 👨‍💼 Hệ thống quản lý tài nguyên số
- 🔌 Bất kỳ ứng dụng multi-tenant nào

---

## ⚡ Quick Start

### Setup nhanh nhất (5 phút)

```bash
# 1. Clone repository
git clone <repository-url>
cd DichVuSo-main

# 2. Cài đặt tất cả dependencies
npm install

# 3. Khởi chạy tất cả services
docker-compose up --build
```

Thế là xong! Truy cập:
- 🖥️ Frontend: http://localhost:3100
- ⚙️ Backend API: http://localhost:3003
- 📊 Admin Panel: http://localhost:3000
- 📚 API Docs: http://localhost:3003/api

---

## 🏗️ Kiến Trúc Dự Án

```
DichVuSo-main (Root Workspace)
│
├── 📁 DichVuSo-main/           # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # React components (Header, Footer, Auth, etc.)
│   │   ├── assets/            # Images, logos, icons
│   │   ├── helpers/           # Utility functions
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── nginx.conf             # Nginx configuration for production
│   └── Dockerfile             # Build and run frontend in Docker
│
├── 📁 nest-api/                # Backend Application (NestJS)
│   ├── src/
│   │   ├── auth/              # Authentication & Authorization
│   │   ├── categories/        # Category management
│   │   ├── services/          # Service management
│   │   ├── favorites/         # User favorites
│   │   ├── users/             # User management
│   │   ├── upload/            # File upload handling
│   │   ├── db/                # Database service
│   │   ├── app.module.ts      # Main app module
│   │   └── main.ts            # Entry point
│   ├── sql/                   # Database schema & seeds
│   ├── test/                  # E2E tests
│   └── package.json           # Dependencies
│
├── 📁 next-admin/              # Admin Panel (Next.js)
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── admin/             # Admin pages
│   │   │   ├── dashboard/
│   │   │   ├── categories/
│   │   │   ├── services/
│   │   │   └── layout.tsx
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # API clients & utilities
│   ├── next.config.ts         # Next.js configuration
│   └── package.json           # Dependencies
│
├── docker-compose.yml          # Orchestrate all services
├── package.json               # Root workspace scripts
└── README.md                  # This file
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (DichVuSo-main)
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first CSS |
| **PostCSS** | CSS processing |

### Backend (nest-api)
| Technology | Purpose |
|-----------|---------|
| **NestJS 11** | Node.js framework |
| **TypeScript** | Type safety |
| **Better SQLite3** | Lightweight SQL database |
| **JWT** | Token-based authentication |
| **Clerk SDK** | Authentication service |
| **Multer** | File upload |
| **Swagger** | API documentation |
| **Jest** | Testing framework |

### Admin Panel (next-admin)
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with SSR |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first CSS |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy & static file serving |

---

## 📋 Yêu Cầu Hệ Thống

### Tối thiểu
- **Node.js**: v18.0.0 trở lên
- **npm**: v9.0.0 trở lên
- **Git**: v2.30.0 trở lên

### Khuyến nghị
- **Node.js**: v22+ (LTS)
- **npm**: v10+
- **Docker**: v24+
- **Docker Compose**: v2.20+

### Kiểm tra phiên bản
```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## 🚀 Cài Đặt & Khởi Chạy

### 1. Clone Repository

```bash
git clone <repository-url>
cd DichVuSo-main
```

### 2. Cài Đặt Dependencies

**Option A: Cài đặt cho tất cả 3 ứng dụng**

```bash
# Frontend
cd DichVuSo-main
npm install
cd ..

# Backend
cd nest-api
npm install
cd ..

# Admin Panel
cd next-admin
npm install
cd ..
```

**Option B: Cài đặt từng ứng dụng**

```bash
# Chỉ cài đặt backend
cd nest-api && npm install

# Hoặc chỉ cài đặt frontend
cd DichVuSo-main && npm install

# Hoặc chỉ cài đặt admin
cd next-admin && npm install
```

### 3. Khởi Chạy Development

#### Frontend (React + Vite)

```bash
cd DichVuSo-main
npm run dev
# Accessing at: http://localhost:3100
```

#### Backend (NestJS)

```bash
cd nest-api
npm run start:dev
# API Server at: http://localhost:3003
# Swagger Docs at: http://localhost:3003/api
```

#### Admin Panel (Next.js)

```bash
cd next-admin
npm run dev
# Admin Panel at: http://localhost:3000
```

#### All Services Together (Docker)

```bash
docker-compose up --build
```

### 4. Kết nối API (Frontend to Backend)

Frontend sẽ tự động kết nối đến backend theo cấu hình:

```typescript
// DichVuSo-main/src/App.tsx
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003'
```

Để thay đổi, thêm file `.env.local` trong thư mục `DichVuSo-main/`:

```env
VITE_API_URL=http://localhost:3003
```

---

## 📁 Cấu Trúc Thư Mục

### Frontend Structure (DichVuSo-main)

```
src/
├── components/
│   ├── Auth/              # Authentication modal & forms
│   ├── Collapse/          # Collapsible components
│   ├── Footer/            # Footer component
│   ├── Header/            # Header/Navigation
│   └── Search/            # Search input component
├── helpers/
│   └── stringUtils.ts     # String manipulation utilities
├── assets/
│   ├── img/              # Images
│   ├── logo/             # Logos
│   ├── png/              # PNG assets
│   └── svg/              # SVG icons
├── App.tsx               # Main application component
├── App.css               # App styles
├── main.tsx              # React entry point
├── index.css             # Global styles
└── vite-env.d.ts         # Vite environment types
```

### Backend Structure (nest-api)

```
src/
├── auth/
│   ├── auth.service.ts     # Authentication logic
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.module.ts      # Auth module
│   ├── jwt.guard.ts        # JWT protection
│   └── clerk.guard.ts      # Clerk authentication guard
├── users/
│   └── users.service.ts    # User management
├── services/
│   ├── services.service.ts   # Service business logic
│   ├── services.controller.ts # Service endpoints
│   └── services.module.ts     # Service module
├── categories/
│   ├── categories.service.ts   # Category logic
│   ├── categories.controller.ts
│   └── categories.module.ts
├── favorites/
│   ├── favorites.service.ts    # User favorites
│   ├── favorites.controller.ts
│   └── facorites.module.ts      # Note: typo in filename
├── upload/
│   ├── upload.controller.ts    # File upload endpoints
│   └── upload.module.ts
├── db/
│   ├── db.service.ts       # Database connection
│   └── db.module.ts
├── app.module.ts           # Root module
├── app.service.ts          # App service
├── app.controller.ts       # Root controller
└── main.ts                 # NestJS bootstrap
```

### Admin Panel Structure (next-admin)

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── globals.css             # Global styles
└── admin/
    ├── layout.tsx          # Admin layout
    ├── page.tsx            # Dashboard/Overview
    ├── dashboard/
    │   └── page.tsx        # Dashboard metrics
    ├── categories/
    │   └── page.tsx        # Manage categories
    └── services/
        └── page.tsx        # Manage services
components/
├── admin/
│   ├── AppShell.tsx        # Admin layout wrapper
│   ├── forms.tsx           # Form components & types
│   ├── Modal.tsx           # Modal dialogs
│   └── icons.tsx           # Icon components
lib/
├── categories-api.ts       # Categories API client
└── services-api.ts         # Services API client
```

---

## 💻 Development

### Environment Variables

#### Frontend (.env.local in DichVuSo-main/)
```env
VITE_API_URL=http://localhost:3003
```

#### Backend (.env in nest-api/)
```env
DATABASE_URL=./db.sqlite
JWT_SECRET=your-secret-key
CLERK_API_KEY=your-clerk-api-key
NODE_ENV=development
```

#### Admin (.env.local in next-admin/)
```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

### Development Scripts

**Frontend**
```bash
cd DichVuSo-main
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

**Backend**
```bash
cd nest-api
npm run start:dev    # Start with auto-reload
npm run build        # Compile TypeScript
npm run start:prod   # Start production build
npm run start:debug  # Debug mode
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run unit tests
npm run test:cov     # Coverage report
npm run test:e2e     # E2E tests
```

**Admin**
```bash
cd next-admin
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

- **Formatter**: Prettier
- **Linter**: ESLint
- **Language**: TypeScript

Run formatting & linting:
```bash
# Backend
cd nest-api
npm run format
npm run lint

# Frontend & Admin use ESLint
cd DichVuSo-main
npm run lint

cd ../next-admin  
npm run lint
```

### Database Setup

#### Initialize Database (Backend)

```bash
cd nest-api

# Schema & seed data
sqlite3 db.sqlite < sql/schema.sql
sqlite3 db.sqlite < sql/seed.users.sql
```

**Key Tables:**
- `users` - User accounts
- `categories` - Service categories
- `services` - Service listings
- `favorites` - User favorites
- `uploads` - File records

---

## 🐳 Production Deployment

### Docker Build & Run

#### Individual Services

**Frontend**
```bash
cd DichVuSo-main
docker build -t dichvuso-frontend .
docker run -p 80:80 dichvuso-frontend
```

**Backend**
```bash
cd nest-api
docker build -t dichvuso-backend .
docker run -p 3003:3003 dichvuso-backend
```

**Admin Panel**
```bash
cd next-admin
docker build -t dichvuso-admin .
docker run -p 3000:3000 dichvuso-admin
```

#### All Services with Docker Compose

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Compose Services

```yaml
services:
  web:        # Frontend (Nginx)
    port: 80
    
  api:        # Backend (NestJS)
    port: 3003
    
  admin:      # Admin Panel (Next.js)
    port: 3000
```

### Production Checklist

- [ ] Set environment variables properly
- [ ] Configure JWT secret securely
- [ ] Setup Clerk authentication
- [ ] Review CORS settings
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure logging
- [ ] Setup monitoring & alerts
- [ ] Performance optimization
- [ ] Security headers configuration

---

## 📚 API Documentation

### Swagger/OpenAPI

Backend API documentation tự động tại:

```
http://localhost:3003/api
http://localhost:3003/api-json (JSON format)
```

Sử dụng Swagger UI để test endpoints trực tiếp - không cần Postman!

### API Base URL

```
Development:  http://localhost:3003
Production:   https://api.dichvuso.dev
```

### Authentication

Từng API endpoint yêu cầu authentication bằng JWT token (trừ login/register):

```bash
# 1. Get token
curl -X POST http://localhost:3003/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Use token in requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3003/services
```

### Core API Endpoints

#### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | User registration | ❌ |
| POST | `/auth/login` | User login, get JWT token | ❌ |
| POST | `/auth/refresh` | Refresh JWT token | ✅ |
| POST | `/auth/logout` | User logout | ✅ |
| GET | `/auth/me` | Get current user | ✅ |

**Example - Register:**
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}

Response:
{
  "id": "user_123",
  "email": "user@example.com",
  "token": "eyJhbGc..."
}
```

#### 📦 Services (`/services`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/services` | List all services (paginated) | ❌ |
| GET | `/services/:id` | Get service details | ❌ |
| POST | `/services` | Create service | ✅ (Admin) |
| PUT | `/services/:id` | Update service | ✅ (Admin) |
| DELETE | `/services/:id` | Delete service | ✅ (Admin) |
| GET | `/services/search` | Search services | ❌ |

**Example - Get Services:**
```bash
GET /services?page=1&limit=10&category=tech

Response:
{
  "data": [
    {
      "id": "service_123",
      "name": "Web Development",
      "description": "Modern web solutions",
      "price": 1200000,
      "category": "tech",
      "provider": "TechCorp",
      "rating": 4.8,
      "reviews": 42,
      "image": "https://...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 10
}
```

#### 📂 Categories (`/categories`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | List all categories | ❌ |
| GET | `/categories/:id` | Get category details | ❌ |
| POST | `/categories` | Create category | ✅ (Admin) |
| PUT | `/categories/:id` | Update category | ✅ (Admin) |
| DELETE | `/categories/:id` | Delete category | ✅ (Admin) |

**Example:**
```bash
GET /categories

Response:
{
  "data": [
    {
      "id": "cat_1",
      "name": "Technology",
      "slug": "technology",
      "icon": "🔧",
      "description": "Tech services",
      "serviceCount": 45
    },
    {
      "id": "cat_2",
      "name": "Design",
      "slug": "design",
      "icon": "🎨",
      "description": "Design services",
      "serviceCount": 28
    }
  ]
}
```

#### ⭐ Favorites (`/favorites`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/favorites` | Get user favorites | ✅ |
| POST | `/favorites/:serviceId` | Add to favorites | ✅ |
| DELETE | `/favorites/:serviceId` | Remove from favorites | ✅ |

**Example:**
```bash
POST /favorites/service_123
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "message": "Service added to favorites",
  "service": { ... }
}
```

#### 📤 Upload (`/upload`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/upload` | Upload file | ✅ |
| GET | `/upload/:fileId` | Get uploaded file | ❌ |
| DELETE | `/upload/:fileId` | Delete file | ✅ |

**Example:**
```bash
POST /upload
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file=@/path/to/image.jpg

Response:
{
  "fileId": "file_123",
  "filename": "image.jpg",
  "url": "http://localhost:3003/upload/file_123",
  "size": 245632,
  "mimetype": "image/jpeg"
}
```

#### 👤 Users (`/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/:id` | Get user profile | ✅ |
| PUT | `/users/:id` | Update user profile | ✅ |
| GET | `/users/:id/services` | Get user services | ❌ |
| DELETE | `/users/:id` | Delete user account | ✅ |

### Error Handling

Tất cả API responses dùng HTTP status codes chuẩn:

```typescript
// Success
200 OK         - Request successful
201 Created    - Resource created
204 No Content - Successful, no response body

// Client errors
400 Bad Request     - Invalid request
401 Unauthorized    - Missing/invalid token
403 Forbidden       - Insufficient permissions
404 Not Found       - Resource not found
409 Conflict        - Resource conflict (duplicate, etc.)

// Server errors
500 Internal Server Error - Server error
503 Service Unavailable   - Maintenance
```

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Invalid email format",
  "error": "BadRequestException",
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/auth/register"
}
```

### Rate Limiting

```
API Rate Limit: 1000 requests per hour per IP
Window Reset: Every hour at :00
```

Response header:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1705314000
```

### Making API Requests from Frontend

#### Using Fetch API

```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003'

// GET request
const getServices = async () => {
  const response = await fetch(`${BASE_URL}/services`)
  return await response.json()
}

// POST with authentication
const createService = async (data: ServiceData) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}
```

#### Using Axios (if installed)

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3003'
})

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Use it
const services = await api.get('/services')
```

#### Using TanStack Query (React Query)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['services'],
  queryFn: async () => {
    const res = await fetch(`${BASE_URL}/services`)
    return res.json()
  }
})

const { mutate } = useMutation({
  mutationFn: async (newService) => {
    const res = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      body: JSON.stringify(newService)
    })
    return res.json()
  }
})
```

---

## ❓ Troubleshooting

### Vấn đề: Port đã được sử dụng

**Lỗi:** `Error: listen EADDRINUSE :::3003`

**Giải pháp:**
```bash
# Windows - Tìm và kill process
netstat -ano | findstr :3003
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3003
kill -9 <PID>

# Hoặc sử dụng port khác trong .env
```

### Vấn đề: npm install thất bại

**Giải pháp:**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install

# Hoặc sử dụng npm cache clean
npm cache clean --force
npm install
```

### Vấn đề: Database lock error

**Lỗi:** `database is locked`

**Giải pháp:**
```bash
# 1. Dừng tất cả processes
npm run stop

# 2. Xóa database và khởi tạo lại
rm nest-api/db.sqlite
cd nest-api && npm run db:init
```

### Vấn đề: CORS error

**Lỗi:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Giải pháp:**
```typescript
// Kiểm tra file nest-api/src/main.ts
app.enableCors({
  origin: 'http://localhost:3100', // Frontend URL
  credentials: true
})
```

### Vấn đề: TypeScript compilation error

**Giải pháp:**
```bash
# Rebuild TypeScript
npm run build

# Hoặc trong development
npm run dev # Tự động recompile
```

### Vấn đề: Docker build fails

**Giải pháp:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

### Vấn đề: Module not found

**Giải pháp:**
```bash
# Từng project
cd DichVuSo-main && npm install
cd ../nest-api && npm install
cd ../next-admin && npm install

# Hoặc clear node_modules
rm -rf **/node_modules
npm install
```

---

## 💡 Tips & Best Practices

### Development Tips

#### 1. **Sử dụng Environment Variables**
```bash
# Tạo .env.local hoặc .env.development
# Không commit file .env vào git
echo ".env*" >> .gitignore
```

#### 2. **Hot Module Replacement (HMR)**
Frontend và Admin panel hỗ trợ HMR - thay đổi code sẽ tự động reload:
```bash
npm run dev # Sẽ giám sát thay đổi
```

#### 3. **Debug Backend với VSCode**
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "NestJS Debug",
  "program": "${workspaceFolder}/nest-api/node_modules/.bin/nest",
  "args": ["start", "--debug", "--watch"],
  "autoAttachChildProcesses": true
}
```

#### 4. **Browser DevTools**
- Frontend: React Developer Tools, Redux DevTools
- Admin: Next.js helper, React Developer Tools

#### 5. **API Testing**
```bash
# Sử dụng cURL, Postman, hoặc REST Client
curl http://localhost:3003/services
```

### Code Best Practices

#### 1. **TypeScript Strict Mode**
```typescript
// Hãy luôn sử dụng strict types
interface User {
  id: string;
  email: string;
  createdAt: Date;
}
```

#### 2. **Error Handling**
```typescript
// Backend - Sử dụng Exception filters
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Handle errors properly
  }
}

// Frontend - Sử dụng try-catch và error boundaries
try {
  const response = await fetch(url);
} catch (error) {
  console.error('API Error:', error);
}
```

#### 3. **Naming Conventions**
```typescript
// Components - PascalCase
UserProfile.tsx

// Files - kebab-case
user-profile.tsx

// Variables & functions - camelCase
const getUserData = () => {}

// Constants - UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
```

#### 4. **Component Structure (React)**
```typescript
// 1. Imports
import React from 'react'

// 2. Types/Interfaces
interface Props {}

// 3. Component
export const MyComponent: React.FC<Props> = () => {
  return <div></div>
}

// 4. Styles (Tailwind)
// Inline hoặc CSS modules
```

#### 5. **API File Organization**
```typescript
// lib/api/index.ts
export * from './users'
export * from './services'
export * from './categories'

// lib/api/users.ts
export const getUser = async (id: string) => {}
```

### Performance Tips

#### 1. **Frontend Optimization**
```bash
# Code splitting với React lazy
const AdminPanel = lazy(() => import('./pages/Admin'))

# Vite optimization
# - Vite tự động code-split
# - SWC/esbuild cực nhanh
```

#### 2. **Backend Optimization**
```typescript
// Cache frequently accessed data
@Get('/services')
@UseInterceptors(CacheInterceptor)
getServices() {}

// Pagination cho large results
@Get('/services')
getServices(@Query('page') page = 1) {}
```

#### 3. **Database Optimization**
```typescript
// Index quan trọng
// Sử dụng SELECT specific columns
// Avoid N+1 queries
```

#### 4. **Docker Optimization**
```dockerfile
# Multi-stage builds
FROM node:22 AS builder
...
FROM node:22-alpine
COPY --from=builder /app/dist ./dist
```

### Testing Tips

#### 1. **Unit Tests**
```bash
cd nest-api
npm test              # Run tests
npm run test:cov      # Coverage report
```

#### 2. **E2E Tests**
```bash
npm run test:e2e       # Run E2E tests
```

#### 3. **Frontend Testing (Vitest)**
```bash
cd DichVuSo-main
npm test              # Run tests
```

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/user-auth

# 2. Commit incrementally
git add .
git commit -m "feat: implement user authentication"

# 3. Keep updated with main
git fetch origin
git rebase origin/main

# 4. Push & create PR
git push origin feature/user-auth
```

---

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style

3. **Install dependencies** (if needed)
   ```bash
   npm install
   ```

4. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   ```

5. **Format code**
   ```bash
   npm run format
   ```

6. **Commit with clear messages**
   ```bash
   git commit -m "feat: description of changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request** with description

### Commit Message Convention

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Testing
- `chore:` - Maintenance

Example:
```bash
git commit -m "feat: add user favorites feature"
git commit -m "fix: resolve login validation error"
git commit -m "docs: update README with setup instructions"
```

### Code Guidelines

- Write clean, readable code
- Use TypeScript types properly
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY principle
- Test your changes

---

## 📞 Support & Contact

### Reporting Issues

Tìm thấy bug? Vui lòng report tại:

1. **Check existing issues** - [Issues](../../issues)
2. **Create new issue** với thông tin:
   - ✅ Mô tả rõ vấn đề
   - ✅ Steps to reproduce
   - ✅ Error messages/logs
   - ✅ Environment (OS, Node version, etc.)
   - ✅ Screenshots nếu có

**Issue Template:**
```
## Description
[Brief description of the issue]

## Steps to Reproduce
1. ...
2. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Environment
- OS: Windows/macOS/Linux
- Node: v18.x
- npm: v9.x

## Logs
[Error messages]
```

### Questions & Discussions

- 💬 Open [Discussions](../../discussions)
- 📖 Kiểm tra [Documentation](#documentation)
- 🔗 Tham gia community channels

### Getting Help

| Vấn đề | Tài nguyên |
|--------|-----------|
| Setup issues | [Troubleshooting](#troubleshooting) |
| API usage | [API Documentation](#api-documentation) |
| Development help | [Tips & Best Practices](#tips--best-practices) |
| Framework help | [NestJS Docs](https://docs.nestjs.com), [React Docs](https://react.dev) |

### Contact Information

- 📧 Email: support@dichvuso.dev
- 🐦 Twitter: [@DichVuSo](https://twitter.com)
- 💼 LinkedIn: [DichVuSo](https://linkedin.com)
- 🌐 Website: [dichvuso.dev](https://dichvuso.dev)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at any scale
- [Docker](https://www.docker.com/) - Containerization platform
- [Clerk](https://clerk.com/) - Authentication platform
- Tất cả contributors và community members

---

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic service listing
- ✅ User authentication
- ✅ Admin dashboard
- ✅ File upload

### Phase 2 (Planned)
- 🔄 Payment integration (Stripe/VNPay)
- 🔄 Rating & Review system
- 🔄 Real-time notifications
- 🔄 Advanced search filters

### Phase 3 (Future)
- 📅 Mobile app (React Native)
- 📅 Analytics dashboard
- 📅 Service provider portal
- 📅 Multi-language support

---

<div align="center">

### 🌟 Hãy give us a star nếu bạn thích dự án này!

**DichVuSo** • [Issues](../../issues) • [Discussions](../../discussions) • [License](LICENSE)

Made with ❤️ for Digital Services

[⬆ Back to Top](#dichvuso---digital-services-platform-)

</div>
