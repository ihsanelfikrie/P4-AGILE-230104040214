# 🧪 Testing Guide for Testers

## Prerequisites
- Node.js >= 18
- npm >= 9
- Git

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/<USERNAME>/P4-AGILE-<NIM>.git
cd P4-AGILE-<NIM>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
```bash
npm test
```

Expected output:
```
PASS services/order-service/test/order.spec.ts
PASS services/notification-service/test/notification.spec.ts

Test Suites: 2 passed, 2 total
Tests: 5 passed, 5 total
```

### 4. Run Services

**Terminal 1 (Order Service):**
```bash
npm run dev:orders
```

**Terminal 2 (Notification Service):**
```bash
npm run dev:notif
```

### 5. Test Endpoints

#### Test Order Service (Port 5002)

**Success Case (201):**
```bash
curl -X POST http://localhost:5002/orders \
  -H "Authorization: Bearer test123" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD-001","quantity":2}'
```

**Error Case (401 - No Token):**
```bash
curl -X POST http://localhost:5002/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD-001","quantity":2}'
```

**Error Case (400 - Invalid Data):**
```bash
curl -X POST http://localhost:5002/orders \
  -H "Authorization: Bearer test123" \
  -H "Content-Type: application/json" \
  -d '{"productId":"","quantity":0}'
```

#### Test Notification Service (Port 5003)

**Success Case (200):**
```bash
curl -X GET "http://localhost:5003/notifications?limit=5" \
  -H "Authorization: Bearer test123"
```

**Error Case (401 - No Token):**
```bash
curl -X GET "http://localhost:5003/notifications?limit=5"
```

### 6. Lint OpenAPI
```bash
npm run lint:api
```

Expected: `No results with a severity of 'error' or higher found!`

---

## Test Cases Checklist

- [ ] npm install berhasil tanpa error
- [ ] npm test lulus semua (5 tests passed)
- [ ] npm run lint:api tidak ada error
- [ ] Order Service berjalan di :5002
- [ ] Notification Service berjalan di :5003
- [ ] POST /orders dengan token valid → 201
- [ ] POST /orders tanpa token → 401
- [ ] POST /orders dengan data invalid → 400
- [ ] GET /notifications dengan token valid → 200
- [ ] GET /notifications tanpa token → 401
- [ ] Response memiliki header x-correlation-id
- [ ] Log JSON muncul di terminal dengan correlationId

---

## Report Issues

Jika menemukan bug:
1. Buka tab **Issues** di GitHub
2. Klik **New Issue**
3. Jelaskan:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshot (jika ada)

---

## Contact

Developer: <NAMA_ANDA>
Email: <EMAIL_ANDA>