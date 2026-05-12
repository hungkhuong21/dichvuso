# 🚀 DichVuSo - Docker Deployment Guide

## Cấu trúc dự án

```
DichVuSo-main/
├── docker-compose.yml          # Main orchestration file
├── .env.example                # Environment template
├── .env                        # Environment variables (create from .env.example)
├── DichVuSo-main/             # Frontend (Vite + React)
│   ├── Dockerfile
│   └── ...
├── nest-api/                  # Backend API (NestJS)
│   ├── Dockerfile
│   └── ...
└── next-admin/                # Admin Dashboard (Next.js)
    ├── Dockerfile
    └── ...
```

## 📋 Các bước setup & deployment

### 1. **Chuẩn bị môi trường**

```bash
# Copy file .env từ template
cp .env.example .env

# Edit .env và fill in các secrets
# - VITE_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - JWT_SECRET
```

### 2. **Build & Run locally**

```bash
# Build tất cả 3 services
docker-compose build

# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. **Truy cập các services**

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost | 80 |
| Backend API | http://localhost:3003 | 3003 |
| Admin Dashboard | http://localhost:3001 | 3001 |
| API Docs | http://localhost:3003/api | 3003 |

### 4. **Database (SQLite)**

- **Location**: `/app/data/dichvuso.db` (inside container)
- **Persistent Volume**: `sqlite_data` (docker volume)
- **Local Access**: `docker-compose exec backend /bin/sh` 

```bash
# Backup database
docker-compose exec backend cp /app/data/dichvuso.db /app/data/dichvuso.db.backup

# View database
docker volume ls  # List volumes
docker volume inspect dichvuso-main_sqlite_data  # Get volume path
```

## 🐳 Triển khai trên Dookploy

### **Cách 1: Sử dụng Docker Compose (Khuyến nghị)**

1. Push code lên GitHub/GitLab
2. Vào Dookploy → Create new application
3. Select **Docker Compose** deployment type
4. Repository: Select your repo
5. Branch: `main` (hoặc branch bạn chọn)
6. Compose File Path: `docker-compose.yml`
7. Environment Variables:
   - VITE_CLERK_PUBLISHABLE_KEY: `your_key`
   - CLERK_SECRET_KEY: `your_key`
   - JWT_SECRET: `your_secret`
   - NODE_ENV: `production`

8. Click **Deploy**

### **Cách 2: Deploy từng service riêng lẻ**

Nếu cần control từng service:

1. **Frontend**: 
   - Type: Docker
   - Build from: `DichVuSo-main/Dockerfile`
   - Ports: 80

2. **Backend**:
   - Type: Docker
   - Build from: `nest-api/Dockerfile`
   - Ports: 3003
   - Volumes: Mount `/app/data` để lưu SQLite

3. **Admin**:
   - Type: Docker
   - Build from: `next-admin/Dockerfile`
   - Ports: 3001

## ⚙️ Biến môi trường (Environment Variables)

### Frontend
```env
VITE_API_URL=http://your-backend-url:3003
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
```

### Backend
```env
NODE_ENV=production
SQLITE_PATH=/app/data/dichvuso.db
CLERK_SECRET_KEY=sk_test_xxxx
JWT_SECRET=your_secret_key
ASSETS_PNG_DIR=/app/data/assets
```

### Admin
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://your-backend-url:3003
```

## 🔒 Bảo mật (Important!)

1. **Đừng commit `.env` file** - nó chứa secrets!
2. **Thêm `.env` vào `.gitignore`** (đã thêm sẵn)
3. **Chỉ commit `.env.example`** với placeholder
4. **Trên Dookploy**: Set environment variables trực tiếp trong dashboard

## 📊 Debugging

### Xem logs
```bash
docker-compose logs backend          # Backend logs
docker-compose logs frontend         # Frontend logs
docker-compose logs admin            # Admin logs
docker-compose logs -f               # Follow all logs
```

### Exec commands
```bash
docker-compose exec backend npm run typeorm migration:run
docker-compose exec backend /bin/sh
```

### Rebuild specific service
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

## 🚀 Production Tips

1. **Scale API**: Thêm replicas trong docker-compose
   ```yaml
   deploy:
     replicas: 3
   ```

2. **Health Checks**: Thêm health check endpoints
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

3. **Resource Limits**: Set CPU/Memory limits
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

4. **Reverse Proxy** (Nginx/Caddy):
   - Frontend: serve static files
   - Backend: proxy /api → http://backend:3003
   - Admin: proxy /admin → http://admin:3000

## 📝 Checklist trước khi deploy

- [ ] Update `.env` với production values
- [ ] Test locally: `docker-compose up`
- [ ] Check tất cả ports không bị conflict
- [ ] Verify database connectivity
- [ ] Test API endpoints
- [ ] Backup database hiện tại
- [ ] Review logs không có errors

---

**Need help?** Kiểm tra logs: `docker-compose logs -f backend`
