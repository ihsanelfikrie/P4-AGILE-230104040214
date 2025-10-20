# Laporan Praktikum WSE #4
## Web Service Development Methodologies (AGILE)

---

### Informasi Mahasiswa
- **Nama**: Muhammad Nur Ihsan
- **NIM**: 230104040214
- **Kelas**: TI23A
- **Tanggal**: 20 Oktober 2025

---

## 1. Ringkasan Praktikum

Praktikum ini menerapkan metodologi **Agile** pada pengembangan Web Service dengan pendekatan:
1. **Design-First**: Mendefinisikan kontrak API dengan OpenAPI sebelum coding
2. **Mock-First**: Validasi kontrak dengan Prism mock server
3. **Test-First**: Menulis tes sebelum implementasi (TDD)
4. **Implementasi**: Coding sampai semua tes hijau (GREEN)
5. **CI/CD**: Otomasi lint & test dengan GitHub Actions
6. **Hardening**: Observability (logging, correlation-id) & Security (auth, rate-limit, validation)

---

## 2. Product Goal & Definition of Done

### Product Goal
Mini E-Commerce API dengan 2 endpoint utama (orders & notifications) yang berjalan, teruji, terdokumentasi, dan aman.

### Definition of Done (DoD)
- [x] OpenAPI valid & lulus lint (0 errors)
- [x] Mock server berjalan & 4 skenario terdokumentasi
- [x] Minimal 5 tes lulus (Jest hijau)
- [x] Endpoint bekerja lokal dengan status code yang benar
- [x] CI otomatis lint+test hijau
- [x] Logging JSON + x-correlation-id aktif
- [x] Auth dummy + rate-limit + validasi Zod
- [x] README & REPORT lengkap

---

## 3. Backlog & Sprint Progress

### User Stories
1. ✅ US1: Sebagai developer, saya ingin file OpenAPI untuk mendesain kontrak API
2. ✅ US2: Sebagai developer, saya ingin mock server agar bisa uji cepat tanpa backend
3. ✅ US3: Sebagai tester, saya ingin tes untuk POST /orders (201/400/401)
4. ✅ US4: Sebagai tester, saya ingin tes untuk GET /notifications (200/401)
5. ✅ US5: Sebagai ops, saya ingin CI lint+test otomatis
6. ✅ US6: Sebagai ops, saya ingin logging & correlation-id + rate-limit

---

## 4. Design-First: OpenAPI Specification

### Endpoints yang Didefinisikan
1. **POST /orders** (Order Service - Port 5002)
   - Request: `{ productId: string, quantity: number }`
   - Responses: 201 Created, 400 Bad Request, 401 Unauthorized

2. **GET /notifications** (Notification Service - Port 5003)
   - Query param: `limit` (optional, default: 10)
   - Responses: 200 OK, 401 Unauthorized

### Lint Result
![Spectral Lint Pass](docs/spectral_pass.png)

**Hasil:** 0 errors, 0 warnings ✅

---

## 5. Mock-First: Prism Validation

### Skenario yang Diuji
1. ✅ POST /orders → 201 Created (token valid, payload valid)
2. ✅ GET /notifications → 200 OK (token valid)
3. ✅ GET /notifications → 401 Unauthorized (tanpa token)
4. ✅ POST /orders → 400 Bad Request (payload invalid)

### Bukti Mock Logs
Semua output tersimpan di folder `mock_logs/`:
- `<timestamp>_201_orders.txt`
- `<timestamp>_200_notifications.txt`
- `<timestamp>_401_notifications.txt`
- `<timestamp>_400_orders.txt`

![Mock Logs Folder](docs/mock_logs_folder.png)

---

## 6. Test-First (TDD): Jest + Supertest

### Test Suites
1. **Order Service** (`services/order-service/test/order.spec.ts`)
   - ✅ should return 401 without bearer token
   - ✅ should return 400 for invalid payload
   - ✅ should return 201 for valid order

2. **Notification Service** (`services/notification-service/test/notification.spec.ts`)
   - ✅ should return 401 without bearer token
   - ✅ should return 200 with valid token

### Test Results
![npm test pass](docs/npm_test_pass.png)

**Hasil:** Test Suites: 2 passed | Tests: 5 passed ✅

---

## 7. Implementasi (GREEN)

### Teknologi yang Digunakan
- **Runtime**: Node.js 18+, TypeScript
- **Framework**: Express.js
- **Validation**: Zod
- **Security**: Helmet, express-rate-limit, Bearer auth (dummy)
- **Logging**: Pino dengan redaction untuk data sensitif
- **Testing**: Jest, ts-jest, Supertest

### Middleware yang Diimplementasikan
1. ✅ Correlation ID (UUID otomatis untuk request tracking)
2. ✅ Auth Bearer (token dummy: `test123`)
3. ✅ Rate Limit (100 req/menit per IP)
4. ✅ Request Logger (JSON structured logs)
5. ✅ JSON Error Handler (400 untuk JSON rusak, bukan 500)
6. ✅ Validation (Zod schema untuk body request)

---

## 8. CI/CD: GitHub Actions

### Workflow Steps
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Lint OpenAPI (`npm run lint:api`)
5. TypeCheck (`npm run typecheck`)
6. Run tests (`npm test`)

### CI Status
![GitHub Actions Pass](docs/ci_pass.png)

**Hasil:** All checks passed ✅

**Repository URL**: https://github.com/USERNAME/P4-AGILE-230104040214

---

## 9. Hardening: Observability & Security

### Observability
1. **Structured Logging**: Format JSON dengan Pino
2. **Correlation ID**: UUID unik per request (header `x-correlation-id`)
3. **Request Tracking**: Log method, path, status, duration
4. **Sensitive Data Redaction**: Authorization header otomatis disensor

### Security
1. **Helmet**: Security headers (XSS, Clickjacking protection)
2. **CORS**: Cross-origin resource sharing control
3. **Rate Limit**: 100 requests per menit per IP
4. **Body Size Limit**: Maksimal 1MB
5. **Auth Middleware**: Bearer token validation (dummy: `test123`)
6. **Input Validation**: Zod schema untuk data integrity
7. **Error Handling**: JSON rusak → 400 (bukan 500)

### Runtime Test Results

#### Skenario yang Diuji
1. ✅ 201 Created (Orders - payload valid)
2. ✅ 200 OK (Notifications - token valid)
3. ✅ 401 Unauthorized (Orders - tanpa token)
4. ✅ 400 Validation Error (Orders - payload invalid)
5. ✅ 400 Bad JSON (Orders - JSON rusak)

#### Bukti Hardening Logs
![Hardening Logs Folder](docs/hardening_logs_folder.png)

**Contoh Response dengan Correlation ID:**
```
HTTP/1.1 201 Created
x-correlation-id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
content-type: application/json

{"id":"ORD-1737369234567","productId":"PROD-001","quantity":2,"status":"created","createdAt":"2025-10-20T..."}
```

#### Log JSON Sample
![Log with Correlation ID](docs/log_correlation_id.png)
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

## 10. Retrospektif

### ✅ Apa yang Berjalan Baik?
- Design-First membantu menyamakan pemahaman kontrak API sejak awal
- Mock server (Prism) mempercepat testing tanpa implementasi backend
- TDD memastikan kualitas kode sejak awal
- CI otomatis mendeteksi error lebih cepat
- Logging dengan correlation-id memudahkan debugging
- Middleware reusable membuat kode lebih clean dan maintainable

### ⚠️ Apa yang Kurang?
- Waktu desain schema OpenAPI cukup panjang untuk pemula
- Perlu pemahaman TypeScript yang lebih dalam
- Dokumentasi perlu lebih detail untuk edge cases
- Masih menggunakan auth dummy (belum JWT yang sesungguhnya)

### 🔧 Perbaikan untuk Sprint Berikutnya
- Tambah API Gateway sebagai entry point tunggal
- Implementasi CDC (Consumer-Driven Contracts) dengan Pact
- Tambah health check endpoint yang lebih lengkap
- Integrasi dengan database real (PostgreSQL/MongoDB)
- Implementasi JWT authentication yang sesungguhnya
- Tambah integration tests dan E2E tests
- Implementasi distributed tracing (Jaeger/Zipkin)

---

## 11. Kesimpulan

Praktikum ini berhasil mengimplementasikan **metodologi Agile** pada pengembangan Web Service dengan:
- ✅ Kontrak API yang terdokumentasi (OpenAPI)
- ✅ Validasi kontrak sebelum implementasi (Prism)
- ✅ Quality assurance dengan automated testing (Jest)
- ✅ CI/CD pipeline yang berjalan otomatis (GitHub Actions)
- ✅ Observability & Security yang memenuhi standar industri

**Semua Definition of Done terpenuhi** dan artefak praktikum siap untuk dikumpulkan.

Metodologi Agile terbukti efektif dalam:
1. Meningkatkan kualitas kode melalui TDD
2. Mempercepat feedback loop melalui CI/CD
3. Meningkatkan kolaborasi melalui kontrak API yang jelas
4. Mengurangi bug production melalui testing yang komprehensif

---

## Lampiran

### Struktur Folder Akhir
```
P4-AGILE-230104040214/
├── .github/workflows/ci.yml
├── docs/
│   ├── Backlog.md
│   ├── DoD.md
│   ├── ProductGoal.md
│   ├── spectral_pass.png
│   ├── npm_test_pass.png
│   ├── ci_pass.png
│   ├── mock_logs_folder.png
│   ├── hardening_logs_folder.png
│   └── log_correlation_id.png
├── hardening_logs/
│   ├── <timestamp>_201_orders.txt
│   ├── <timestamp>_200_notifications.txt
│   ├── <timestamp>_401_orders.txt
│   ├── <timestamp>_400_orders_validation.txt
│   └── <timestamp>_400_orders_badjson.txt
├── mock_logs/
│   ├── <timestamp>_201_orders.txt
│   ├── <timestamp>_200_notifications.txt
│   ├── <timestamp>_401_notifications.txt
│   └── <timestamp>_400_orders.txt
├── openapi/api.yaml
├── services/
│   ├── order-service/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── server.ts
│   │   └── test/
│   │       └── order.spec.ts
│   └── notification-service/
│       ├── src/
│       │   ├── index.ts
│       │   └── server.ts
│       └── test/
│           └── notification.spec.ts
├── .gitignore
├── jest.config.cjs
├── package.json
├── tsconfig.json
├── utils.ts
├── README.md
└── REPORT.md
```

### Cara Menjalankan (Quick Start)
```bash
# Install dependencies
npm install

# Lint OpenAPI
npm run lint:api

# Run tests
npm test

# Run services (2 terminal)
npm run dev:orders    # Terminal 1
npm run dev:notif     # Terminal 2

# Test endpoints
curl -X POST http://localhost:5002/orders \
  -H "Authorization: Bearer test123" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD-001","quantity":2}'

curl -X GET http://localhost:5003/notifications?limit=5 \
  -H "Authorization: Bearer test123"
```

---

**Nama**: Muhammad Nur Ihsan  
**NIM**: 230104040214  
**Kelas**: TI23A  
**Tanggal**: 20 Oktober 2025