# P4-AGILE-230104040214
## Mini E-Commerce API - WSE Praktikum #4

[![CI](https://github.com/USERNAME/P4-AGILE-230104040214/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/P4-AGILE-230104040214/actions/workflows/ci.yml)

> **Catatan**: Ganti `USERNAME` dengan username GitHub Anda

---

## 📋 Deskripsi

Web Service sederhana dengan 2 microservices:
- **Order Service** (Port 5002): Mengelola pembuatan order
- **Notification Service** (Port 5003): Mengelola notifikasi

Dibangun dengan metodologi **Agile**: Design-First → Mock-First → Test-First → Implementation → CI/CD → Hardening

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/USERNAME/P4-AGILE-230104040214.git
cd P4-AGILE-230104040214

# Install dependencies
npm install
```

### Run Services
```bash
# Terminal 1: Order Service
npm run dev:orders

# Terminal 2: Notification Service
npm run dev:notif
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

**Expected Output:**
```
PASS services/order-service/test/order.spec.ts
PASS services/notification-service/test/notification.spec.ts

Test Suites: 2 passed, 2 total
Tests: 5 passed, 5 total
```

### Lint OpenAPI
```bash
npm run lint:api
```

**Expected Output:**
```
No results with a severity of 'error' or higher found!
```

### TypeCheck
```bash
npm run typecheck
```

### Mock Server (Prism)
```bash
npm run mock
```
Mock server akan berjalan di `http://127.0.0.1:4010`

---

## 📡 API Endpoints

### Order Service (http://localhost:5002)

#### POST /orders
Membuat order baru.

**Request:**
```bash
curl -X POST http://localhost:5002/orders \
  -H "Authorization: Bearer test123" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD-001",
    "quantity": 2
  }'
```

**Response (201 Created):**
```json
{
  "id": "ORD-1737369234567",
  "productId": "PROD-001",
  "quantity": 2,
  "status": "created",
  "createdAt": "2025-10-20T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Token tidak valid/tidak ada
```json
  {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
```
- `400 Bad Request`: Payload invalid atau JSON rusak
```json
  {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": [...]
  }
```

---

### Notification Service (http://localhost:5003)

#### GET /notifications
Mendapatkan daftar notifikasi.

**Request:**
```bash
curl -X GET "http://localhost:5003/notifications?limit=5" \
  -H "Authorization: Bearer test123"
```

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": "NOTIF-001",
      "message": "Order shipped",
      "timestamp": "2025-01-15T10:00:00Z"
    },
    {
      "id": "NOTIF-002",
      "message": "Payment received",
      "timestamp": "2025-01-15T09:30:00Z"
    }
  ],
  "total": 2
}
```

**Error Responses:**
- `401 Unauthorized`: Token tidak valid/tidak ada
```json
  {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
```

---

## 🔐 Authentication

Semua endpoint (kecuali `/health`) memerlukan Bearer token.

**Dummy Token:** `test123`

**Header:**
```
Authorization: Bearer test123
```

**Contoh Request dengan Token:**
```bash
curl -X GET http://localhost:5003/notifications \
  -H "Authorization: Bearer test123"
```

---

## 🛡️ Security & Observability

### Security Features
- ✅ **Helmet**: Security headers (XSS, Clickjacking protection)
- ✅ **CORS**: Cross-origin resource sharing control
- ✅ **Rate limiting**: 100 requests/menit per IP
- ✅ **Body size limit**: Maksimal 1MB
- ✅ **Bearer token authentication**: Validasi token di setiap request
- ✅ **Input validation**: Zod schema untuk data integrity
- ✅ **JSON parse error handling**: 400 untuk JSON rusak

### Observability Features
- ✅ **Structured logging**: JSON format dengan Pino
- ✅ **Correlation ID tracking**: `x-correlation-id` header di setiap response
- ✅ **Request/response logging**: Method, path, status, duration
- ✅ **Sensitive data redaction**: Authorization header otomatis disensor

**Contoh Log:**
```json
{
  "level": 30,
  "time": 1737369234567,
  "type": "http_request",
  "method": "POST",
  "path": "/orders",
  "statusCode": 201,
  "duration": 45,
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 📁 Struktur Proyek
```
P4-AGILE-230104040214/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── docs/                          # Dokumentasi Agile
│   ├── Backlog.md
│   ├── DoD.md
│   └── ProductGoal.md
├── hardening_logs/                # Bukti runtime testing
├── mock_logs/                     # Bukti mock testing
├── openapi/
│   └── api.yaml                   # OpenAPI Specification
├── services/
│   ├── order-service/
│   │   ├── src/
│   │   │   ├── index.ts          # Express app
│   │   │   └── server.ts         # Runtime entry
│   │   └── test/
│   │       └── order.spec.ts     # Unit tests
│   └── notification-service/
│       ├── src/
│       │   ├── index.ts
│       │   └── server.ts
│       └── test/
│           └── notification.spec.ts
├── .gitignore
├── .spectral.yaml                 # Spectral linter config
├── jest.config.cjs                # Jest configuration
├── package.json
├── tsconfig.json                  # TypeScript configuration
├── utils.ts                       # Shared middleware
├── README.md
└── REPORT.md                      # Laporan praktikum
```

---

## 🔄 CI/CD

GitHub Actions otomatis menjalankan:
1. ✅ OpenAPI lint (Spectral)
2. ✅ TypeScript type checking
3. ✅ Unit tests (Jest)

**Workflow Trigger:**
- Push ke branch `main` atau `master`
- Pull Request ke branch `main` atau `master`

**Status:** [![CI](https://github.com/USERNAME/P4-AGILE-230104040214/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/P4-AGILE-230104040214/actions/workflows/ci.yml)

---

## 📝 Dokumentasi Lengkap

Lihat [REPORT.md](./REPORT.md) untuk dokumentasi lengkap praktikum, termasuk:
- Product Goal & Definition of Done
- Design-First & Mock-First approach
- Test-Driven Development (TDD)
- Implementasi & Hardening
- Retrospektif & Kesimpulan

---

## 🛠️ Available Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run lint:api` | Lint OpenAPI spec dengan Spectral |
| `npm run mock` | Jalankan Prism mock server |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Jalankan semua unit tests |
| `npm run dev:orders` | Jalankan Order Service (port 5002) |
| `npm run dev:notif` | Jalankan Notification Service (port 5003) |

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5002
taskkill /PID <PID_NUMBER> /F

# Linux/Mac
lsof -ti:5002 | xargs kill -9
```

### Tests Failing
```bash
# Clear Jest cache
npx jest --clearCache

# Run tests in verbose mode
npm test -- --verbose
```

### TypeScript Errors
```bash
# Restart TypeScript server (VS Code)
Ctrl+Shift+P → TypeScript: Restart TS Server

# Check compilation
npm run typecheck
```

---

## 👨‍💻 Developer

**Nama:** Muhammad Nur Ihsan  
**NIM:** 230104040214  
**Kelas:** TI23A  
**Mata Kuliah:** Web Service Engineering  
**Dosen:** Muhayat, M.IT  
**Tanggal:** 20 Oktober 2025

---

## 📄 License

Praktikum WSE 2025 - For Educational Purposes Only

---

## 🙏 Acknowledgments

- Dokumentasi Express.js: https://expressjs.com/
- OpenAPI Specification: https://swagger.io/specification/
- Prism Mock Server: https://stoplight.io/open-source/prism
- Jest Testing Framework: https://jestjs.io/
- Pino Logger: https://getpino.io/