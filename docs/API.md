# Ecotup API Documentation

Base URL: `http://127.0.0.1:8000`

---

## User

### GET /api/user
Get all users.

**Response**
```json
{ "error": false, "message": "Request successful", "data": [...] }
```

### GET /api/user/detail/:id
Get user by ID.

### POST /api/user/register
Register a new user.

**Body**
```json
{
  "name": "Test User",
  "email": "test@ecotup.com",
  "password": "Test1234",
  "phone": "081234567890",
  "longitude": 106.8456,
  "latitude": -6.2088
}
```

### POST /api/user/login
Login user.

**Body**
```json
{ "email": "test@ecotup.com", "password": "Test1234" }
```

**Response**
```json
{ "error": false, "message": "Login successful", "data": { "id_user": 1, "token": "uuid" } }
```

### POST /api/user/login/google
Login user with Google.

**Body**
```json
{ "email": "test@gmail.com", "name": "Test User", "phone": "081234567890", "longitude": 106.8456, "latitude": -6.2088 }
```

### PUT /api/user/update/:id
Update user data.

**Body** (any updatable field)
```json
{ "name": "New Name", "phone": "081111111111", "longitude": 106.8456, "latitude": -6.2088 }
```

### POST /api/user/update/point/:id
Update user point.

**Body**
```json
{ "point": 100 }
```

### POST /api/user/update/password/:id
Update user password.

**Body**
```json
{ "password": "NewPassword123" }
```

### POST /api/user/update/subscription/:id
Update user subscription.

**Body**
```json
{ "subscription_id": 2 }
```

### POST /api/user/upload/:id
Upload user profile picture. Form-data with field `image`.

### DELETE /api/user/delete/:id
Delete user by ID.

---

## Driver

### GET /api/driver
Get all drivers.

### GET /api/driver/detail/:id
Get driver by ID.

### POST /api/driver/register
Register a new driver.

**Body**
```json
{
  "name": "Budi Driver",
  "email": "budi@ecotup.com",
  "password": "Driver1234",
  "phone": "082198765432",
  "longitude": 106.8272,
  "latitude": -6.1754,
  "type": "Motor",
  "license": "B1234567"
}
```

### POST /api/driver/login
Login driver.

**Body**
```json
{ "email": "budi@ecotup.com", "password": "Driver1234" }
```

**Response**
```json
{ "error": false, "message": "Login successful", "data": { "id_driver": 1, "token": "uuid" } }
```

### POST /api/driver/login/google
Login driver with Google.

**Body**
```json
{ "email": "budi@gmail.com", "name": "Budi Driver", "phone": "082198765432", "longitude": 106.8272, "latitude": -6.1754, "type": "Motor", "license": "B1234567" }
```

### PUT /api/driver/update/:id
Update driver data.

### POST /api/driver/update/point/:id
Update driver point.

**Body**
```json
{ "point": 100 }
```

### POST /api/driver/update/rating/:id
Update driver rating.

**Body**
```json
{ "rating": 4.5 }
```

### POST /api/driver/update/password/:id
Update driver password.

**Body**
```json
{ "password": "NewPassword123" }
```

### POST /api/driver/upload/:id
Upload driver profile picture. Form-data with field `image`.

### DELETE /api/driver/delete/:id
Delete driver by ID.

---

## Article

### GET /api/article
Get all articles.

### GET /api/article/detail/:id
Get article by ID.

### POST /api/article/register
Create article.

**Body**
```json
{
  "name": "Cara Memilah Sampah yang Benar",
  "image": "https://example.com/article1.jpg",
  "author": "Admin Ecotup",
  "link": "https://ecotup.com/article/1",
  "date": "2026-06-21"
}
```

### PUT /api/article/update/:id
Update article.

### DELETE /api/article/delete/:id
Delete article by ID.

---

## Reward

### GET /api/reward
Get all rewards.

### GET /api/reward/detail/:id
Get reward by ID.

### POST /api/reward/register
Create reward.

**Body**
```json
{
  "name": "Voucher Belanja 50rb",
  "image": "https://example.com/reward1.jpg",
  "price": 200,
  "description": "Voucher belanja senilai Rp50.000 di mitra Ecotup"
}
```

### PUT /api/reward/update/:id
Update reward.

### DELETE /api/reward/delete/:id
Delete reward by ID.

---

## Subscription

### GET /api/subscription
Get all subscriptions.

### GET /api/subscription/detail/:id
Get subscription by ID.

### POST /api/subscription/register
Create subscription.

**Body**
```json
{ "status": "Gold", "value": 500 }
```

### PUT /api/subscription/update/:id
Update subscription.

### DELETE /api/subscription/delete/:id
Delete subscription by ID.

**Default subscription tiers**

| ID | Status   | Min Point |
|----|----------|-----------|
| 1  | Free     | 0         |
| 2  | Bronze   | 100       |
| 3  | Silver   | 250       |
| 4  | Gold     | 500       |
| 5  | Platinum | 1000      |

---

## Transaction

### GET /api/transaction
Get all transactions.

### GET /api/transaction/detail/:id
Get transaction by ID.

### GET /api/transaction/direction/:id
Get direction info for a transaction.

### GET /api/transaction/driver/status/:id
Get ongoing transaction status for a driver.

### POST /api/transaction/detail
Get transactions by user or driver.

**Body**
```json
{ "user_id": 1 }
```

### POST /api/transaction/detail/subscription
Get transactions filtered by subscription.

**Body**
```json
{ "user_id": 1, "driver_id": 1 }
```

### POST /api/transaction/location/driver
Get driver location from transaction.

**Body**
```json
{ "driver_id": 1, "user_id": 1 }
```

### POST /api/transaction/register
Create transaction.

**Body**
```json
{
  "driver_id": 1,
  "user_id": 1,
  "description": "Pickup sampah organik",
  "total_payment": 15000,
  "total_weight": 5,
  "total_point": 50,
  "status": "pending"
}
```

### PUT /api/transaction/update/:id
Update transaction.

### POST /api/transaction/update/status/:id
Update transaction status.

**Body**
```json
{ "status": "completed" }
```

### POST /api/transaction/update/location/driver/:id
Update driver location in transaction.

**Body**
```json
{ "longitude": 106.8272, "latitude": -6.1754 }
```

### DELETE /api/transaction/delete/:id
Delete transaction by ID.

---

## Cluster

### GET /api/cluster
Get all clusters.

### POST /api/cluster/detail
Get cluster by driver or user.

**Body**
```json
{ "driver_id": 1 }
```

### POST /api/cluster/register
Create cluster.

**Body**
```json
{
  "driver_id": 1,
  "user_id": 1,
  "name": "Cluster Jakarta Pusat",
  "region": "Jakarta Pusat"
}
```

### PUT /api/cluster/update/:id
Update cluster.

### DELETE /api/cluster/delete/:id
Delete cluster by ID.
