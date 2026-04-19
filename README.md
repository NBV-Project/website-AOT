# Asian Overseas Trading — เว็บไซต์บริษัท

เว็บไซต์ของบริษัท **เอเชียน โอเวอร์ซี เทรดดิ้ง** สำหรับธุรกิจส่งออกผลไม้คุณภาพจากไทยสู่ตลาดจีน  
รองรับ 3 ภาษา (ไทย / อังกฤษ / จีน) และออกแบบมาให้เปิดได้จากประเทศจีนโดยเฉพาะ

---

## สิ่งที่โปรเจกต์นี้ทำ

- แสดงข้อมูลบริษัท สินค้า โลจิสติกส์ และการติดต่อ
- รองรับ 3 ภาษา: **TH / EN / ZH** (สลับได้ที่มุมขวาบน)
- รูปภาพและ font ทั้งหมด self-hosted — **ไม่มี external resource ที่ถูก block ในจีน**
- Deploy บน **Alibaba Cloud HK** เพื่อให้ผู้ใช้จีนเปิดได้

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Font | Mitr (self-hosted via next/font/google) |
| Hosting | Alibaba Cloud ECS — Hong Kong |
| Domain | Cloudflare Registrar |

---

## โครงสร้างโฟลเดอร์

```
app/
  page.tsx          → หน้าแรก
  about/page.tsx    → เกี่ยวกับเรา
  products/page.tsx → สินค้า
  logistics/page.tsx→ โลจิสติกส์
  contact/page.tsx  → ติดต่อเรา
  layout.tsx        → Layout หลัก (font, metadata)

components/
  site-header.tsx   → Navbar
  site-footer.tsx   → Footer + ข้อมูลติดต่อ
  language-switcher.tsx → ปุ่มเปลี่ยนภาษา

lib/
  locale.ts         → ระบบภาษา (TH/EN/ZH)

public/images/      → รูปภาพทั้งหมด (self-hosted)
```

---

## รันในเครื่องตัวเอง (Development)

```bash
# ติดตั้ง dependencies
npm install

# รัน dev server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

```bash
# ตรวจสอบ code
npm run lint

# ทดสอบ build
npm run build
```

---

## การ Deploy ครั้งแรก (ทำครั้งเดียว)

### ขั้นตอนที่ 1 — Push โค้ดขึ้น GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

### ขั้นตอนที่ 2 — สร้าง Server บน Alibaba Cloud HK

1. สมัคร [alibabacloud.com](https://alibabacloud.com)
2. ไปที่ **ECS** → **Create Instance** ตั้งค่า:
   - Region: **Hong Kong**
   - Instance: **ecs.c8y.small** (1 vCPU, 2GB RAM)
   - OS: **Ubuntu 22.04 LTS**
   - Storage: 40GB SSD
   - Bandwidth: Pay-by-traffic
3. Security Group เปิด Port: **22, 80, 443**
4. จด **Public IP Address** ไว้

---

### ขั้นตอนที่ 3 — ติดตั้งโปรแกรมบน Server

SSH เข้า server:
```bash
ssh root@YOUR_SERVER_IP
```

ติดตั้ง Node.js, PM2, Nginx, Git:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx
sudo npm install -g pm2
```

---

### ขั้นตอนที่ 4 — Clone โค้ดและ Build

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git myapp
cd myapp
npm install
npm run build
```

---

### ขั้นตอนที่ 5 — รัน App ด้วย PM2

```bash
pm2 start npm --name "myapp" -- start
pm2 startup
pm2 save
```

ทดสอบ: เปิด `http://YOUR_SERVER_IP:3000` ถ้าเห็นเว็บ = สำเร็จ ✅

---

### ขั้นตอนที่ 6 — ตั้งค่า Nginx

```bash
sudo nano /etc/nginx/sites-available/myapp
```

วางข้อความนี้ (แก้ `YOUR_DOMAIN.com`):

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### ขั้นตอนที่ 7 — เชื่อม Cloudflare Domain

1. Cloudflare Dashboard → เลือกโดเมน → **DNS** → **Records**
2. เพิ่ม A Record:

| Type | Name | Content | Proxy Status |
|---|---|---|---|
| A | `@` | `YOUR_SERVER_IP` | **DNS only** (เมฆสีเทา) |
| A | `www` | `YOUR_SERVER_IP` | **DNS only** (เมฆสีเทา) |

> ⚠️ **ต้องปิด Proxy (เมฆสีเทา)** — ถ้าเปิด Proxy (สีส้ม) จีนจะเปิดไม่ได้

3. รอ DNS propagate 5–30 นาที

---

### ขั้นตอนที่ 8 — ติดตั้ง SSL (HTTPS ฟรี)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

ทำตาม prompt → ใส่ email → กด Y → เสร็จ  
SSL จะ auto-renew ทุก 90 วันโดยอัตโนมัติ

---

## อัปเดตโค้ดหลัง Deploy (ทำทุกครั้งที่แก้เว็บ)

### บนเครื่องตัวเอง — push โค้ดใหม่

```bash
git add .
git commit -m "อธิบายว่าแก้อะไร"
git push
```

### บน Server — pull และ restart

```bash
ssh root@YOUR_SERVER_IP
cd /var/www/myapp
git pull
npm run build
pm2 restart myapp
```

> ✅ เว็บจะอัปเดตทันที ไม่ต้องทำขั้นตอนอื่นเพิ่ม

---

## เพิ่มภาษาในระบบ

ระบบภาษาอยู่ที่ `lib/locale.ts`  
ทุกหน้าอ่านค่าจาก `copyByLocale` ที่แยก key เป็น `th` / `en` / `zh`  
เมื่อต้องการแก้ข้อความ ให้แก้ที่ `copyByLocale` ในไฟล์ page นั้นๆ โดยตรง

---

## ข้อมูลติดต่อบริษัท

**สำนักงานใหญ่**  
388/65-388/66 ถนนนวลจันทร์ แขวงนวลจันทร์ เขตบึงกุ่ม กรุงเทพมหานคร 10230

โทร: 085-289-2451  
อีเมล: contact@asianoverseas.co.th
