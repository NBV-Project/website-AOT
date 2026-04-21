import { ImageLoaderProps } from 'next/image';

export default function supabaseLoader({ src, width, quality }: ImageLoaderProps) {
  // If it's a relative path (local asset), we should still use the width/quality if we want it optimized.
  // When using a custom loader, Next.js expects the returned URL to ideally include these parameters.
  // For local assets in public folder, we return them but we can append them as query params 
  // if we have a proxy or just return the path. 
  // To fix the "loader does not implement width" error, we MUST use the width variable in our returned string.
  
  if (src.startsWith('/')) {
    // สำหรับรูปภาพ Local ในโฟลเดอร์ public เราจะวิ่งผ่าน API Route พิเศษที่เราสร้างขึ้น
    // เพื่อทำหน้าที่เป็น CDN ย่อยๆ ในการ Resize และ Compress รูปภาพจริงๆ
    return `/api/cdn/image?src=${encodeURIComponent(src)}&w=${width}${quality ? `&q=${quality}` : ''}`;
  }

  // If it's not a Supabase URL, return as is (but with width to avoid warning)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !src.includes(supabaseUrl)) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}`;
  }

  // Supabase Image Transformation CDN URL
  // Documentation: https://supabase.com/docs/guides/storage/image-transformations
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  
  // Format: https://project.supabase.co/storage/v1/render/image/public/bucket/image.png?width=500&quality=75
  // We need to transform the URL from /object/public/ to /render/image/public/
  const transformedSrc = src.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  
  return `${transformedSrc}?${params.join('&')}`;
}
