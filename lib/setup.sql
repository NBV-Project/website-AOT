-- SQL สำหรับตั้งค่าฐานข้อมูล Asian Overseas Trading (AOT) - ฉบับปรับปรุง (Fix: Column Not Found)
-- คัดลอกส่วนนี้ไปรันใน SQL Editor ของ Supabase ได้ทันทีครับ

-- 1. สร้างตารางสำหรับเก็บเนื้อหาหน้าหลัก
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. สร้างตารางสำหรับเก็บรายการสินค้า (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  status TEXT DEFAULT 'Active',
  sort_order INTEGER DEFAULT 0,
  th JSONB NOT NULL,
  en JSONB NOT NULL,
  zh JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- *** ส่วนสำคัญ: ตรวจสอบและเพิ่มคอลัมน์ กรณีที่มีตารางเดิมอยู่แล้ว ***
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_in_season BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 3. ตั้งค่า Row Level Security (RLS)
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for now" ON page_content;
CREATE POLICY "Enable all access for now" ON page_content FOR ALL USING (true);

-- 4. สร้างตารางสำหรับเก็บข้อความติดต่อ
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New', -- New, Read, Replied
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for now" ON contact_inquiries;
CREATE POLICY "Enable all access for now" ON contact_inquiries FOR ALL USING (true);

-- 5. ข้อมูลสินค้าตัวอย่าง (Seed Data)
-- 5. สร้าง Supabase Storage bucket สำหรับ CMS media
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public read website assets" ON storage.objects;
CREATE POLICY "Public read website assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Public upload website assets" ON storage.objects;
CREATE POLICY "Public upload website assets"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Public delete website assets" ON storage.objects;
CREATE POLICY "Public delete website assets"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'website-assets');

TRUNCATE products;

INSERT INTO products (image_url, is_in_season, th, en, zh) 
VALUES 
-- ทุเรียน (ในฤดูกาล)
('/images/category-durian-new.jpg', true, 
  '{"name": "ทุเรียนหมอนทอง", "description": "ราชาแห่งผลไม้ไทยที่มีรสชาติเข้มข้นและกลิ่นหอมเป็นเอกลักษณ์", "highlights": ["เกรดส่งออกพรีเมียม", "รสหวานมัน"], "price_range": "250 - 450 THB/KG"}',
  '{"name": "Monthong Durian", "description": "The King of Thai fruits with a rich, creamy texture.", "highlights": ["Premium Export Grade", "Creamy & Sweet"], "price_range": "8 - 14 USD/KG"}',
  '{"name": "金枕头榴莲", "description": "泰国水果之王，质地浓郁奶油，香气独特。", "highlights": ["出口级品质", "口感香甜"], "price_range": "60 - 100 RMB/KG"}'
),
-- มะพร้าว (ในฤดูกาล)
('/images/category-coconut-new.jpg', true, 
  '{"name": "มะพร้าวน้ำหอม", "description": "มะพร้าวน้ำหอมคัดเกรดที่มีความหวานหอมเป็นเอกลักษณ์", "highlights": ["น้ำหวานธรรมชาติ", "เนื้อนุ่มกำลังดี"], "price_range": "35 - 60 THB/Unit"}',
  '{"name": "Aromatic Coconut", "description": "High-grade aromatic coconuts with natural sweetness.", "highlights": ["Naturally Sweet", "Fresh Selection"], "price_range": "1.5 - 2.5 USD/Unit"}',
  '{"name": "泰国香椰", "description": "高等级香椰，具有天然的甜味和独特的香气。", "highlights": ["天然甜度", "口感清新"], "price_range": "10 - 18 RMB/Unit"}'
),
-- มะม่วง (นอกฤดูกาล)
('/images/category-mango-v3.jpg', false, 
  '{"name": "มะม่วงน้ำดอกไม้", "description": "มะม่วงน้ำดอกไม้สีทอง รสหวานฉ่ำ เนื้อเนียนไม่มีเสี้ยน", "highlights": ["สีทองสวยงาม", "รสหวานฉ่ำ"], "price_range": "เร็วๆ นี้"}',
  '{"name": "Nam Dok Mai Mango", "description": "Golden Nam Dok Mai mangoes with sweet juice and smooth flesh.", "highlights": ["Beautiful Golden Color", "Sweet & Juicy"], "price_range": "Coming Soon"}',
  '{"name": "水仙芒", "description": "金灿灿的“水仙芒”，果色优美，汁多味甜。", "highlights": ["色泽金黄", "香甜多汁"], "price_range": "敬请期待"}'
),
-- มังคุด (นอกฤดูกาล)
('/images/category-mangosteen-v5.jpg', false, 
  '{"name": "มังคุด", "description": "ราชินีแห่งผลไม้ไทย เนื้อขาวสะอาด รสหวานอมเปรี้ยวลงตัว", "highlights": ["เนื้อขาวเป็นปุย", "รสชาติกลมกล่อม"], "price_range": "เร็วๆ นี้"}',
  '{"name": "Mangosteen", "description": "The Queen of Fruits, snowy white flesh with balanced flavor.", "highlights": ["Pure White Flesh", "Standard Sizing"], "price_range": "Coming Soon"}',
  '{"name": "山竹", "description": "表皮油亮，果肉雪白，甜酸味道完美平衡。", "highlights": ["肉质雪白", "味道甘甜"], "price_range": "敬请期待"}'
);
