-- สคริปต์สำหรับเพิ่ม "ขนุน" และ "สับปะรด" ที่หายไป
-- คัดลอกส่วนนี้ไปรันใน SQL Editor ของ Supabase ครับ

INSERT INTO products (image_url, status, sort_order, is_in_season, th, en, zh)
VALUES 
(
  '/images/category-jackfruit-v4.jpg', 
  'Active', 
  4, 
  true,
  '{"name": "ขนุน", "description": "ขนุนพันธุ์ดี เนื้อหนา สีเหลืองทอง รสหวานกรอบ มีกลิ่นหอมเป็นเอกลักษณ์", "highlights": ["เนื้อหนากรุบกรอบ", "รสหวานกลมกล่อม"], "price_range": "เร็วๆ นี้"}',
  '{"name": "Jackfruit", "description": "Premium jackfruit with thick, golden yellow flesh. Sweet, crunchy, and aromatic.", "highlights": ["Thick & Crunchy", "Naturally Sweet"], "price_range": "Coming Soon"}',
  '{"name": "菠萝蜜", "description": "优质菠萝蜜，肉质厚实，金黄色泽，口感脆甜，香气浓郁。", "highlights": ["肉厚香脆", "清甜可口"], "price_range": "敬请期待"}'
),
(
  '/images/category-pineapple-v3.jpg', 
  'Active', 
  5, 
  true,
  '{"name": "สับปะรด", "description": "สับปะรดคัดพิเศษ รสชาติหวานฉ่ำ กลิ่นหอม เหมาะสำหรับการทานสดและการแปรรูป", "highlights": ["รสหวานฉ่ำ", "กลิ่นหอมละมุน"], "price_range": "เร็วๆ นี้"}',
  '{"name": "Pineapple", "description": "Specially selected pineapple with a juicy, sweet flavor and delightful aroma.", "highlights": ["Juicy & Sweet", "Aromatic Quality"], "price_range": "Coming Soon"}',
  '{"name": "菠萝", "description": "特选菠萝，汁多味甜，香气扑鼻，适合鲜食及加工。", "highlights": ["汁多味甜", "果香浓郁"], "price_range": "敬请期待"}'
);
