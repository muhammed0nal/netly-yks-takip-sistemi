# Backend Öğrenme Rehberi

Bu rehber, Netly YKS Takip Sistemi'nin **backend** tarafını backend/API konusunda yeni olan birine anlatır gibi açıklar. Teknik kurulum özeti için kök dizindeki [`README.md`](../README.md)'ye bakın; uç nokta detayları için [`docs/API-REFERANSI.md`](./API-REFERANSI.md)'na bakın.

---

## İçindekiler

1. [Büyük resim](#büyük-resim)
2. [API nedir?](#api-nedir)
3. [Kullandığımız teknolojiler](#kullandığımız-teknolojiler)
4. [Dosya yapısı](#dosya-yapısı)
5. [Bir istek nasıl işlenir?](#bir-istek-nasıl-işlenir)
6. [GET /health akışı](#get-health-akışı)
7. [Kimlik doğrulama (/auth) akışı](#kimlik-doğrulama-auth-akışı)
8. [Önemli dosyalar](#önemli-dosyalar)
9. [Kurulum adımları](#kurulum-adımları)
10. [Şu an ne var, ne yok?](#şu-an-ne-var-ne-yok)
11. [Sık sorulan sorular](#sık-sorulan-sorular)
12. [Faydalı bağlantılar](#faydalı-bağlantılar)

---

## Büyük resim

Netly, YKS hazırlık sürecini takip etmek için geliştirilen bir uygulamadır. Proje iki ana parçadan oluşur:

- **Frontend** (`frontend/`): React Native + Expo ile yazılmış mobil uygulama. Öğrenci arayüzü burada.
- **Backend** (`backend/`): Node.js + Express ile yazılmış REST API. Veritabanı işlemleri, kimlik doğrulama ve iş kuralları burada.

Frontend, backend'e HTTP istekleri gönderir; backend PostgreSQL veritabanına bağlanır ve JSON yanıt döner.

```
[Mobil uygulama]  --HTTP-->  [Express API]  --SQL-->  [PostgreSQL]
     frontend                  backend
```

**Neden ayrı?** Frontend ve backend'i ayırmak, mobil uygulamayı değiştirmeden API'yi geliştirmeyi; veya ileride web arayüzü eklemeyi kolaylaştırır.

---

## API nedir?

**API** (Application Programming Interface), bir programın başka bir programla konuşmasını sağlayan arayüzdür. Bizim projede frontend, backend API'sine istek atar.

- **Endpoint (uç nokta):** Belirli bir URL + HTTP metodu. Örn. `GET /health`, `POST /auth/login`.
- **HTTP metodu:** İsteğin türü. `GET` = veri oku, `POST` = yeni veri oluştur veya işlem yap.
- **JSON:** İstek ve yanıtlarda kullanılan metin tabanlı veri formatı. Örn. `{ "email": "a@b.com" }`.
- **Status code (durum kodu):** Yanıtın sonucu. `200` = başarılı, `401` = yetkisiz, `500` = sunucu hatası.

Tüm uç noktaların detaylı listesi: [`docs/API-REFERANSI.md`](./API-REFERANSI.md)

---

## Kullandığımız teknolojiler

| Teknoloji | Ne işe yarar? | Projede nerede? |
|-----------|---------------|-----------------|
| **Node.js** | JavaScript'i sunucuda çalıştıran ortam | Tüm backend |
| **Express** | HTTP isteklerini karşılayan web framework | `src/app.ts`, route'lar |
| **TypeScript** | JavaScript'e tip güvenliği ekler; hataları erken yakalar | Tüm `src/` |
| **CORS** | Farklı origin'den (örn. Expo dev server) gelen isteklere izin verir | `src/app.ts` |
| **dotenv** | `.env` dosyasındaki gizli ayarları `process.env`'e yükler | `src/index.ts` |
| **JWT** | Oturum bilgisini taşıyan imzalı token; şifre her istekte gönderilmez | `src/lib/jwt.ts` |
| **bcryptjs** | Şifreleri güvenli şekilde hash'ler; düz metin saklanmaz | `src/lib/password.ts` |
| **Prisma** | Veritabanı şeması ve sorgular için ORM | `prisma/schema.prisma`, `src/lib/prisma.ts` |
| **PostgreSQL** | İlişkisel veritabanı; kullanıcı verileri burada | `.env` → `DATABASE_URL` |

### JWT hakkında kısa not

Kayıt veya giriş sonrası API bir **token** döner. Sonraki isteklerde frontend bu token'ı şu header ile gönderir:

```
Authorization: Bearer <token>
```

- Algoritma: **HS256**
- Geçerlilik: **7 gün**
- Token içinde: kullanıcı ID (`sub`) ve e-posta

### bcrypt hakkında kısa not

Kullanıcı şifresi veritabanına **asla düz metin** yazılmaz. Kayıt sırasında `bcrypt` ile hash'lenir; girişte girilen şifre hash ile karşılaştırılır.

---

## Dosya yapısı

```
backend/
├── prisma/
│   ├── schema.prisma          # Veritabanı model tanımları
│   └── migrations/            # Veritabanı şema değişiklik geçmişi
├── src/
│   ├── index.ts               # Sunucu başlangıç noktası
│   ├── app.ts                 # Express uygulaması (middleware, route bağlama)
│   ├── routes/                # URL → controller eşlemesi
│   │   ├── index.ts
│   │   ├── health.routes.ts
│   │   └── auth.routes.ts
│   ├── controllers/           # HTTP katmanı: req/res alır, service çağırır
│   ├── services/              # İş mantığı: validasyon, DB, token üretimi
│   ├── middleware/            # Her istekte/arada çalışan katmanlar
│   ├── lib/                   # Yardımcı modüller (jwt, prisma, validation...)
│   └── types/                 # TypeScript tip tanımları
├── generated/prisma/          # Prisma tarafından üretilen client (elle düzenlenmez)
├── .env.example               # Ortam değişkeni şablonu
└── package.json
```

**Katman mantığı:** Route → Controller → Service → Prisma/DB. Her katman kendi işini yapar; controller ince kalır, iş kuralları service'te toplanır.

---

## Bir istek nasıl işlenir?

Örnek: `POST /auth/login`

```
1. İstek Express'e gelir (app.ts)
2. cors() ve express.json() middleware'leri çalışır
3. auth.routes.ts → login controller'a yönlendirir
4. authRateLimiter (varsa) istek sayısını kontrol eder
5. auth.controller.ts → loginUser service'ini çağırır
6. auth.service.ts → e-posta/şifre doğrular, DB'den kullanıcı bulur, token üretir
7. Controller JSON yanıt döner: { token, user }
8. Hata olursa errorHandler middleware devreye girer → { error: "..." }
```

---

## GET /health akışı

**Amaç:** Sunucu ayakta mı? Veritabanına bağlanabiliyor muyuz?

```
GET /health
  → health.routes.ts (GET /)
  → health.controller.ts → healthCheck
  → health.service.ts → getHealthStatus
  → prisma.$queryRaw SELECT 1
  → Yanıt:
       status: "ok" + database: "connected"     → HTTP 200
       status: "error" + database: "disconnected" → HTTP 503
```

Monitoring araçları veya geliştirici bu uç noktayı periyodik olarak çağırabilir.

---

## Kimlik doğrulama (/auth) akışı

### POST /auth/register — Kayıt

```
1. İstek gövdesi: { email, password, name }
2. validation.ts → alan kuralları kontrol edilir
3. E-posta DB'de var mı? → Varsa 409
4. Şifre bcrypt ile hash'lenir
5. User kaydı oluşturulur (Prisma)
6. JWT token üretilir
7. Yanıt 201: { token, user }
```

### POST /auth/login — Giriş

```
1. İstek gövdesi: { email, password }
2. E-posta ile kullanıcı bulunur → Yoksa 401
3. bcrypt.compare ile şifre doğrulanır → Yanlışsa 401
4. JWT token üretilir
5. Yanıt 200: { token, user }
```

### GET /auth/me — Oturum bilgisi

```
1. Authorization: Bearer <token> header zorunlu
2. auth.middleware.ts → requireAuth
   - Token yok/geçersiz → 401
   - Token decode edilir, kullanıcı DB'den doğrulanır
   - req.user doldurulur
3. auth.controller.ts → getUserById(req.user.id)
4. Yanıt 200: { user: { id, email, name } }
```

**Rate limit:** Register ve login uç noktaları 15 dakikada en fazla 20 istek kabul eder (`429`).

---

## Önemli dosyalar

| Dosya | Görevi |
|-------|--------|
| `src/index.ts` | JWT secret ve DB bağlantısını kontrol eder, sunucuyu başlatır |
| `src/app.ts` | CORS, JSON parser, route'lar, hata yakalayıcı |
| `src/routes/auth.routes.ts` | `/auth/register`, `/auth/login`, `/auth/me` tanımları |
| `src/services/auth.service.ts` | Kayıt, giriş, kullanıcı getirme iş mantığı |
| `src/middleware/auth.middleware.ts` | Bearer token doğrulama |
| `src/middleware/error.middleware.ts` | Tüm hataları `{ error: "..." }` formatına çevirir |
| `src/lib/validation.ts` | E-posta, şifre, ad soyad kuralları |
| `prisma/schema.prisma` | `User` modeli: id, email, name, passwordHash, createdAt, updatedAt |

---

## Kurulum adımları

1. **PostgreSQL** kurulu ve çalışır durumda olsun.
2. `backend/.env.example` dosyasını `backend/.env` olarak kopyalayın.
3. `.env` içinde `DATABASE_URL`, `JWT_SECRET` (en az 32 karakter) ve `PORT` değerlerini düzenleyin.
4. Bağımlılıkları yükleyin:

   ```bash
   cd backend
   npm install
   ```

5. Prisma client üretin ve migration çalıştırın:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

6. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

7. Sağlık kontrolü:

   ```bash
   curl http://localhost:3000/health
   ```

Postman ile test: `docs/postman/netly-api.postman_collection.json` dosyasını içe aktarın.

---

## Şu an ne var, ne yok?

### Tamamlanan

- [x] Express + TypeScript backend iskeleti
- [x] PostgreSQL + Prisma entegrasyonu
- [x] `User` modeli ve migration
- [x] `GET /health` — DB bağlantı kontrolü
- [x] `POST /auth/register` — kayıt
- [x] `POST /auth/login` — giriş
- [x] `GET /auth/me` — oturum bilgisi
- [x] JWT kimlik doğrulama (7 gün, HS256)
- [x] bcrypt ile şifre hash'leme
- [x] Girdi validasyonu ve merkezi hata yönetimi
- [x] Auth rate limiting

### Henüz yapılmayan (planlanan)

- [ ] Deneme sınavı kaydı ve listeleme
- [ ] Konu/kazanım takibi
- [ ] İstatistik ve grafik API'leri
- [ ] Şifre sıfırlama
- [ ] E-posta doğrulama
- [ ] Refresh token
- [ ] Frontend ↔ backend entegrasyonu (auth ekranları)

---

## Sık sorulan sorular

### Sunucu başlamıyor, "JWT_SECRET must be set" hatası alıyorum

`.env` dosyasında `JWT_SECRET` tanımlı olmalı ve **en az 32 karakter** olmalıdır.

### "Startup failed: Database connection" hatası

PostgreSQL çalışıyor mu? `DATABASE_URL` doğru mu? Veritabanı (`netly_yks`) oluşturuldu mu?

### 401 "Oturum geçersiz veya süresi dolmuş"

Token süresi 7 gündür. Süresi dolmuş veya hatalı token gönderiyorsunuz. Yeniden login olun.

### 429 "Çok fazla deneme"

Auth uç noktalarında rate limit var. 15 dakika bekleyin veya geliştirme ortamında limit ayarlarını gözden geçirin.

### Prisma migration ne yapar?

Veritabanı şemasını (`schema.prisma`) gerçek PostgreSQL tablolarına uygular. Model değişince yeni migration oluşturulur.

### generated/prisma/ klasörüne dokunmalı mıyım?

Hayır. `npm run db:generate` ile Prisma otomatik üretir.

---

## Faydalı bağlantılar

- [Express dokümantasyonu](https://expressjs.com/)
- [Prisma dokümantasyonu](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io/) — token decode ve algoritma bilgisi
- Proje API referansı: [`docs/API-REFERANSI.md`](./API-REFERANSI.md)
- Postman koleksiyonu: [`docs/postman/netly-api.postman_collection.json`](./postman/netly-api.postman_collection.json)

---

*Son güncelleme: Kimlik doğrulama (register, login, me) uç noktaları ve JWT tabanlı oturum yönetimi tamamlandı.*
