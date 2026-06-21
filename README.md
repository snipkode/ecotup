# Ecotup API

REST API server untuk aplikasi Ecotup — platform pengelolaan sampah yang menghubungkan pengguna dengan driver pengangkut sampah.

## Tentang

Ecotup API dibangun menggunakan Node.js dan Express, menyediakan layanan backend untuk aplikasi mobile Ecotup. API ini menangani manajemen data pengguna, driver, transaksi pickup sampah, artikel edukasi, reward, subscription, dan cluster wilayah.

## Teknologi

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL (via Knex.js)
- **Storage**: Google Cloud Storage (untuk foto profil)
- **Process Manager**: PM2 (cluster mode)

## Dependensi Utama

| Package | Kegunaan |
|---|---|
| express | HTTP server & routing |
| knex + mysql2 | Query builder & koneksi MySQL |
| bcrypt | Hash password |
| multer | Upload file |
| @google-cloud/storage | Simpan foto profil ke GCS |
| uuid | Generate token unik |
| dotenv | Konfigurasi environment |

## Struktur Folder

```
ecotup-api/
├── app.js                  # Entry point
├── ecosystem.config.js     # Konfigurasi PM2
├── knexfile.js             # Konfigurasi database
├── controller/             # Logic tiap endpoint
├── routes/                 # Definisi routing
├── config/                 # Konfigurasi multer
├── modules/                # Helper modules
├── docs/                   # Dokumentasi API
└── seed.sh                 # Script seed data dummy
```

## Endpoint

| Resource | Base URL |
|---|---|
| User | `/api/user` |
| Driver | `/api/driver` |
| Article | `/api/article` |
| Reward | `/api/reward` |
| Subscription | `/api/subscription` |
| Transaction | `/api/transaction` |
| Cluster | `/api/cluster` |

Dokumentasi lengkap tersedia di [`docs/API.md`](docs/API.md).

## Setup & Menjalankan

1. Clone repository dan install dependensi:
```bash
npm install
```

2. Buat file `.env`:
```env
PORT=8000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ecotup
```

3. Jalankan dengan PM2:
```bash
pm2 start ecosystem.config.js
```

4. (Opsional) Seed data dummy:
```bash
bash seed.sh
```

## Dua Jenis Pengguna

- **User** — pengguna aplikasi yang mengajukan pickup sampah
- **Driver** — driver yang menerima dan menyelesaikan pickup sampah

Keduanya memiliki proses registrasi, login, dan token autentikasi sendiri.
