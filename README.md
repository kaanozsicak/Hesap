# TLY Satış Simülasyonu

Mobil öncelikli, premium görünümlü React + TypeScript tabanlı bir TLY satış simülasyonu sayfası. İki farklı senaryoyu (Standart Plan ve Temmuz Özel Plan) aynı ekran içinde karşılaştırır.

## Özellikler

- **İki Senaryo Karşılaştırması**: Standart aylık satış planı vs Temmuz'da büyük satış planı
- **Canlı Parametreler**: Başlangıç lotu, fiyat, artış oranı, hedefler ve tarih değiştirilebilir
- **İş Günü Mantığı**: Hafta sonları + Türkiye resmi tatilleri dışlanır
- **Geometrik Fiyat Artışı**: Günlük bileşik artış yalnızca işlem günlerinde uygulanır
- **Grafikler**: Recharts ile kalan lot ve kalan değer karşılaştırma grafikleri
- **Mobil Öncelikli**: Responsive, koyu tema, premium finans paneli tasarımı

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
```

## Deploy

Bu proje `kaanozsicak.com/denizcun` path'ine deploy edilmek üzere yapılandırılmıştır.

### Vercel Deploy

1. GitHub'a push edin
2. Vercel'de projeyi import edin
3. Build komutu: `npm run build`
4. Output dizini: `dist`
5. Base path `/denizcun/` olarak `vite.config.ts`'de ayarlıdır

Vercel dashboard'da ek yapılandırma gerekmez, `vercel.json` SPA routing'i sağlar.

## Varsayımlar

- Günlük geometrik artış: %0,5885
- Başlangıç fiyatı: 5.030,56 TL
- Başlangıç lotu: 1.800
- Referans tarih: 2026-04-16 (Nisan satışı tamamlanmış)
- Satışlar ayın son iş gününde yapılır (ayarlanabilir)

⚠️ Bu çalışma sabit günlük artış varsayımıyla oluşturulmuş bir projeksiyondur. Gerçek fon performansı farklı olabilir. Yatırım tavsiyesi değildir.
