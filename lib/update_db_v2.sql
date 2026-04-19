-- 1. เพิ่มคอลัมน์ sort_order สำหรับจัดลำดับสินค้า (กรณีที่ยังไม่มี)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. ตั้งค่าลำดับเริ่มต้นให้กับสินค้าที่มีอยู่แล้ว 
-- โดยจะเรียงตามวันเวลาที่สร้าง (created_at) จากเก่าไปใหม่
-- เพื่อให้สินค้าไม่อยู่ทับซ้อนกันที่ลำดับ 0 ทั้งหมด
WITH ordered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM products
)
UPDATE products
SET sort_order = ordered_products.new_order
FROM ordered_products
WHERE products.id = ordered_products.id;

-- 3. อัปเดตคอลัมน์ is_in_season (เพื่อให้แน่ใจว่ามีครบถ้วน)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_in_season BOOLEAN DEFAULT true;

-- หมายเหตุ: หลังจากรัน SQL นี้แล้ว คุณสามารถเข้าไปที่หน้าระบบหลังบ้าน (Superadmin) 
-- เพื่อใช้ปุ่ม "ย้ายตำแหน่ง" และกด "บันทึกลำดับ" เพื่อจัดเรียงใหม่ตามต้องการได้เลยครับ
