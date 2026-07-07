# Netly API Referansı

Netly YKS Takip Sistemi backend API'sinin uç nokta (endpoint) dokümantasyonu.

## Temel Bilgiler

| Alan | Değer |
|------|-------|
| **Base URL (geliştirme)** | `http://localhost:3000` |
| **İçerik tipi** | `application/json` |
| **Kimlik doğrulama** | JWT Bearer token (`Authorization: Bearer <token>`) |

---

## Hata Yanıt Formatı

Tüm hata yanıtları aşağıdaki JSON yapısını kullanır:

```json
{
  "error": "Hata mesajı"
}
```

| HTTP Kodu | Anlam |
|-----------|-------|
| `400` | Geçersiz istek (eksik veya hatalı alan) |
| `401` | Kimlik doğrulama gerekli veya başarısız |
| `404` | Kaynak bulunamadı |
| `409` | Çakışma (örn. e-posta zaten kayıtlı) |
| `429` | Çok fazla istek (rate limit) |
| `500` | Sunucu hatası |
| `503` | Servis kullanılamıyor (örn. veritabanı bağlantısı yok) |

---

## JWT (JSON Web Token)

| Özellik | Değer |
|---------|-------|
| **Algoritma** | HS256 |
| **Geçerlilik süresi** | 7 gün |
| **Payload alanları** | `sub` (kullanıcı ID), `email` |
| **Header formatı** | `Authorization: Bearer <token>` |

Token, `POST /auth/register` ve `POST /auth/login` yanıtlarında `token` alanında döner. Korumalı uç noktalarda bu token gönderilmelidir.

---

## Uç Nokta Özet Tablosu

| Metod | Yol | Kimlik doğrulama | Açıklama |
|-------|-----|------------------|----------|
| `GET` | `/health` | Hayır | API ve veritabanı durumu |
| `POST` | `/auth/register` | Hayır | Yeni kullanıcı kaydı |
| `POST` | `/auth/login` | Hayır | Giriş yap, token al |
| `GET` | `/auth/me` | Evet (Bearer) | Oturum açmış kullanıcı bilgisi |

---

## GET /health

API sunucusunun ve PostgreSQL veritabanı bağlantısının durumunu kontrol eder.

### Yanıt

**200 OK** — Her şey yolunda:

```json
{
  "status": "ok",
  "timestamp": "2026-07-07T12:00:00.000Z",
  "database": "connected"
}
```

**503 Service Unavailable** — Veritabanına bağlanılamıyor:

```json
{
  "status": "error",
  "timestamp": "2026-07-07T12:00:00.000Z",
  "database": "disconnected"
}
```

### Olası Hata Kodları

Bu uç nokta hata mesajı döndürmez; yalnızca `200` veya `503` HTTP durum kodu ile yukarıdaki gövdeyi döner.

### Postman

| Alan | Değer |
|------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/health` |
| **Headers** | — |
| **Body** | — |

### cURL

```bash
curl -X GET http://localhost:3000/health
```

---

## POST /auth/register

Yeni bir kullanıcı hesabı oluşturur ve JWT token döner.

### İstek Gövdesi

```json
{
  "email": "ogrenci@ornek.com",
  "password": "guvenliSifre123",
  "name": "Ali Yılmaz"
}
```

| Alan | Tip | Zorunlu | Kurallar |
|------|-----|---------|----------|
| `email` | string | Evet | Geçerli e-posta, en fazla 255 karakter; küçük harfe normalize edilir |
| `password` | string | Evet | En az 8, en fazla 128 karakter |
| `name` | string | Evet | En az 2, en fazla 100 karakter |

### Başarılı Yanıt

**201 Created**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxxxx",
    "email": "ogrenci@ornek.com",
    "name": "Ali Yılmaz"
  }
}
```

### Olası Hata Kodları

| Kod | Mesaj (örnek) |
|-----|---------------|
| `400` | `E-posta zorunludur` |
| `400` | `Geçerli bir e-posta adresi girin` |
| `400` | `Şifre en az 8 karakter olmalıdır` |
| `400` | `Ad soyad zorunludur` |
| `409` | `Bu e-posta adresi zaten kayıtlı` |
| `429` | `Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin.` |
| `500` | `Sunucu hatası` |

> **Rate limit:** 15 dakikada en fazla 20 istek.

### Postman

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/auth/register` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | Yukarıdaki istek gövdesi |

### cURL

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ogrenci@ornek.com\",\"password\":\"guvenliSifre123\",\"name\":\"Ali Yılmaz\"}"
```

---

## POST /auth/login

Kayıtlı kullanıcı ile giriş yapar ve JWT token döner.

### İstek Gövdesi

```json
{
  "email": "ogrenci@ornek.com",
  "password": "guvenliSifre123"
}
```

| Alan | Tip | Zorunlu | Kurallar |
|------|-----|---------|----------|
| `email` | string | Evet | Geçerli e-posta formatı |
| `password` | string | Evet | En az 8 karakter |

### Başarılı Yanıt

**200 OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxxxx",
    "email": "ogrenci@ornek.com",
    "name": "Ali Yılmaz"
  }
}
```

### Olası Hata Kodları

| Kod | Mesaj (örnek) |
|-----|---------------|
| `400` | `E-posta zorunludur` |
| `400` | `Şifre zorunludur` |
| `401` | `E-posta veya şifre hatalı` |
| `429` | `Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin.` |
| `500` | `Sunucu hatası` |

### Postman

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/auth/login` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | Yukarıdaki istek gövdesi |

### cURL

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ogrenci@ornek.com\",\"password\":\"guvenliSifre123\"}"
```

---

## GET /auth/me

Oturum açmış kullanıcının profil bilgilerini döner.

### Kimlik Doğrulama

`Authorization: Bearer <token>` header'ı zorunludur.

### Başarılı Yanıt

**200 OK**

```json
{
  "user": {
    "id": "clxxxxx",
    "email": "ogrenci@ornek.com",
    "name": "Ali Yılmaz"
  }
}
```

### Olası Hata Kodları

| Kod | Mesaj (örnek) |
|-----|---------------|
| `401` | `Oturum açmanız gerekiyor` |
| `401` | `Oturum geçersiz veya süresi dolmuş` |
| `404` | `Kullanıcı bulunamadı` |
| `500` | `Sunucu hatası` |

### Postman

| Alan | Değer |
|------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/auth/me` |
| **Headers** | `Authorization: Bearer {{token}}` |
| **Body** | — |

### cURL

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Postman Kurulumu

1. Postman'i açın.
2. **Import** → `docs/postman/netly-api.postman_collection.json` dosyasını seçin.
3. Koleksiyon değişkenlerini kontrol edin:
   - `baseUrl`: `http://localhost:3000` (varsayılan)
   - `token`: Boş başlar; register veya login isteği sonrası otomatik dolar
4. Sırayla test edin:
   - **Health Check** — sunucu ayakta mı?
   - **Register** veya **Login** — token otomatik kaydedilir
   - **Get Me** — kaydedilen token ile profil bilgisi alınır

> Koleksiyondaki register ve login isteklerinde test script'i, yanıttaki `token` değerini koleksiyon değişkeni `token`'a yazar.

---

## İlgili Dokümantasyon

- Backend öğrenme rehberi: [`docs/BACKEND-REHBERI.md`](./BACKEND-REHBERI.md)
- Proje özeti ve kurulum: [`README.md`](../README.md)
