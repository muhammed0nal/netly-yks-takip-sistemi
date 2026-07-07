# Netly — YKS Takip Sistemi

Netly, YKS (Yükseköğretim Kurumları Sınavı) hazırlık sürecini planlamak, deneme sonuçlarını kaydetmek ve ilerlemeyi takip etmek için geliştirilen bir mobil uygulama ve REST API projesidir.

---

## Uygulamanın Temel Mantığı

| Bileşen | Rol |
|---------|-----|
| **Mobil uygulama** | Öğrencinin deneme sonuçlarını girmesi, konu takibi yapması ve ilerlemesini görmesi |
| **REST API** | Kimlik doğrulama, veri kaydetme/okuma, iş kuralları |
| **Veritabanı** | Kullanıcı ve (ileride) sınav/konu verilerinin kalıcı saklanması |

---

## Teknoloji Yığını

| Katman | Teknolojiler |
|--------|---------------|
| **Frontend** | React Native, Expo, Expo Router, TypeScript, expo-secure-store |
| **Backend** | Node.js, Express 5, TypeScript |
| **Veritabanı** | PostgreSQL, Prisma ORM |
| **Kimlik doğrulama** | JWT (HS256, 7 gün), bcryptjs |
| **Diğer** | CORS, dotenv, express-rate-limit |

---

## Proje Yapısı

```
netly_yks_takip_sistemi/
├── frontend/                  # Expo mobil uygulama
│   ├── app/                   # Expo Router ekranları
│   │   ├── (auth)/            # Login, register
│   │   └── (tabs)/            # Ana uygulama sekmeleri
│   ├── components/
│   │   ├── auth/
│   │   └── ui/
│   ├── context/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── constants/
├── backend/                   # Express REST API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── types/
│   └── generated/prisma/      # Prisma client (otomatik üretilir)
├── docs/
│   ├── API-REFERANSI.md       # Uç nokta referansı
│   ├── BACKEND-REHBERI.md     # Backend öğrenme rehberi
│   └── postman/
│       └── netly-api.postman_collection.json
├── .cursor/rules/             # Cursor otomasyon kuralları
└── README.md
```

---

## Kurulum ve Çalıştırma

### Ön koşullar

- Node.js 20+
- PostgreSQL 14+
- npm

### Backend

```bash
cd backend
cp .env.example .env
# .env dosyasını düzenleyin: DATABASE_URL, JWT_SECRET (≥32 karakter), PORT
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

API varsayılan olarak `http://localhost:3000` adresinde çalışır.

**Sağlık kontrolü:**

```bash
curl http://localhost:3000/health
```

Beklenen yanıt (DB bağlıysa):

```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Expo geliştirme sunucusu açılır; QR kod ile mobil cihazda veya emülatörde test edebilirsiniz.

Fiziksel cihazda backend'e erişmek için `frontend/.env` dosyasında bilgisayarınızın yerel IP adresini kullanın:

```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

---

## API Dokümantasyonu

Tüm uç noktalar, istek/yanıt örnekleri, hata kodları ve cURL komutları:

**[`docs/API-REFERANSI.md`](docs/API-REFERANSI.md)**

Postman koleksiyonu: [`docs/postman/netly-api.postman_collection.json`](docs/postman/netly-api.postman_collection.json)

Öğrenme rehberi (backend kavramları): [`docs/BACKEND-REHBERI.md`](docs/BACKEND-REHBERI.md)

### Mevcut uç noktalar

| Metod | Yol | Açıklama |
|-------|-----|----------|
| `GET` | `/health` | API ve veritabanı durumu |
| `POST` | `/auth/register` | Kullanıcı kaydı |
| `POST` | `/auth/login` | Giriş |
| `GET` | `/auth/me` | Oturum bilgisi (Bearer token) |

---

## Veritabanı Migration

Model değişikliği yaptıktan sonra:

```bash
cd backend
npm run db:migrate
```

Prisma client'ı yeniden üretmek için:

```bash
npm run db:generate
```

---

## Yapılanlar

### Genel

- Monorepo yapısı oluşturuldu (`frontend/` + `backend/`)
- Proje dokümantasyonu eklendi (README, API referansı, backend rehberi, Postman koleksiyonu)

### Frontend

- Expo + React Native + TypeScript ile mobil uygulama iskeleti kuruldu
- Expo Router ile sekme tabanlı navigasyon yapılandırıldı
- Koyu mod auth ekranları (login, register) backend API ile entegre edildi
- JWT oturum yönetimi (`expo-secure-store`) ve yeniden kullanılabilir UI bileşenleri eklendi
- Boş ana sayfa ve 5 sekmeli alt navigasyon (Ana Sayfa, Çalışmalar, Analiz, Hedefler, Profil) oluşturuldu

### Backend

- Express + TypeScript backend kuruldu
- PostgreSQL + Prisma entegrasyonu yapıldı
- `User` modeli ve ilk migration oluşturuldu
- `GET /health` endpoint'i eklendi (veritabanı bağlantı kontrolü)
- JWT tabanlı kimlik doğrulama eklendi (`register`, `login`, `me`)
- bcrypt ile şifre hash'leme, girdi validasyonu ve merkezi hata yönetimi eklendi
- Auth uç noktalarına rate limiting uygulandı

---

## Yol Haritası

### Tamamlanan

- [x] Backend iskeleti (Express + TypeScript)
- [x] PostgreSQL + Prisma kurulumu
- [x] User modeli ve migration
- [x] Health check endpoint (`GET /health`)
- [x] Kullanıcı kaydı (`POST /auth/register`)
- [x] Kullanıcı girişi (`POST /auth/login`)
- [x] Oturum bilgisi (`GET /auth/me`)
- [x] JWT kimlik doğrulama
- [x] Frontend Expo iskeleti
- [x] Frontend auth ekranları ve API entegrasyonu
- [x] API ve backend dokümantasyonu

### Planlanan

- [ ] Deneme sınavı kaydı ve listeleme
- [ ] Konu/kazanım takibi
- [ ] İstatistik ve grafikler
- [ ] Şifre sıfırlama
- [ ] Push bildirimleri

---

## Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| [`docs/API-REFERANSI.md`](docs/API-REFERANSI.md) | Tüm API uç noktalarının detaylı referansı |
| [`docs/BACKEND-REHBERI.md`](docs/BACKEND-REHBERI.md) | Backend kavramları ve akış rehberi |
| [`docs/postman/netly-api.postman_collection.json`](docs/postman/netly-api.postman_collection.json) | Postman test koleksiyonu |

---

## Lisans

ISC
