#!/bin/bash
BASE="http://127.0.0.1:8000/api"

echo "=== SUBSCRIPTION ==="
curl -s -X POST $BASE/subscription/register \
  -H "Content-Type: application/json" \
  -d '{"subscription_status":"Free","subscription_value":0}' && \
curl -s -X POST $BASE/subscription/register \
  -H "Content-Type: application/json" \
  -d '{"subscription_status":"Bronze","subscription_value":100}' && \
curl -s -X POST $BASE/subscription/register \
  -H "Content-Type: application/json" \
  -d '{"subscription_status":"Silver","subscription_value":250}' && \
curl -s -X POST $BASE/subscription/register \
  -H "Content-Type: application/json" \
  -d '{"subscription_status":"Gold","subscription_value":500}' && \
curl -s -X POST $BASE/subscription/register \
  -H "Content-Type: application/json" \
  -d '{"subscription_status":"Platinum","subscription_value":1000}'

echo -e "\n=== USER ==="
curl -s -X POST $BASE/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@ecotup.com","password":"Test1234","phone":"081234567890","longitude":106.8456,"latitude":-6.2088}'

echo -e "\n=== DRIVER ==="
curl -s -X POST $BASE/driver/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi Driver","email":"budi@ecotup.com","password":"Driver1234","phone":"082198765432","longitude":106.8272,"latitude":-6.1754,"type":"Motor","license":"B1234567"}'

echo -e "\n=== LOGIN (get IDs) ==="
USER_RES=$(curl -s -X POST $BASE/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ecotup.com","password":"Test1234"}')
DRIVER_RES=$(curl -s -X POST $BASE/driver/login \
  -H "Content-Type: application/json" \
  -d '{"email":"budi@ecotup.com","password":"Driver1234"}')

USER_ID=$(echo $USER_RES | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id_user'])")
DRIVER_ID=$(echo $DRIVER_RES | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id_driver'])")
echo "User ID: $USER_ID | Driver ID: $DRIVER_ID"

echo -e "\n=== ARTICLE ==="
curl -s -X POST $BASE/article/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Cara Memilah Sampah yang Benar","image":"https://example.com/article1.jpg","author":"Admin Ecotup","link":"https://ecotup.com/article/1","date":"2026-06-21"}'

echo -e "\n=== REWARD ==="
curl -s -X POST $BASE/reward/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Voucher Belanja 50rb","image":"https://example.com/reward1.jpg","price":200,"description":"Voucher belanja senilai Rp50.000 di mitra Ecotup"}'

echo -e "\n=== CLUSTER ==="
curl -s -X POST $BASE/cluster/register \
  -H "Content-Type: application/json" \
  -d "{\"driver_id\":$DRIVER_ID,\"user_id\":$USER_ID,\"name\":\"Cluster Jakarta Pusat\",\"region\":\"Jakarta Pusat\"}"

echo -e "\n=== TRANSACTION ==="
curl -s -X POST $BASE/transaction/register \
  -H "Content-Type: application/json" \
  -d "{\"driver_id\":$DRIVER_ID,\"user_id\":$USER_ID,\"description\":\"Pickup sampah organik\",\"total_payment\":15000,\"total_weight\":5,\"total_point\":50,\"status\":\"pending\"}"

echo -e "\n\n=== DONE ==="
