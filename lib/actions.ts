"use server";

import { revalidateTag } from "next/cache";
import { supabase } from "@/lib/supabase";

/**
 * Server Action สำหรับบันทึกเนื้อหาหน้าเว็บและล้างแคชทันที
 */
export async function savePageContent(pageName: string, content: unknown) {
  try {
    const { error } = await supabase.from("page_content").upsert(
      {
        page_name: pageName,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "page_name" }
    );

    if (error) throw error;

    // ล้างแคชตามชื่อหน้าที่ระบุ
    const cacheTags: Record<string, string> = {
      about: "about-page-data",
      home: "home-data",
      products: "products-data",
      products_page: "products-data",
      logistics: "logistics-data",
      contact: "contact-page-data",
    };

    const tagToRevalidate = cacheTags[pageName];
    if (tagToRevalidate) {
      revalidateTag(tagToRevalidate, "max");
      console.log(`[Server Action] Revalidated tag: ${tagToRevalidate}`);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error(`[Server Action] Error saving ${pageName}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Server Action สำหรับบันทึกสินค้าแต่ละชิ้น (เพิ่ม/แก้ไข)
 */
export async function saveProduct(product: { id: string; [key: string]: unknown }) {
  try {
    const { error } = await supabase.from("products").upsert(
      {
        ...product,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) throw error;

    // สินค้าจะส่งผลต่อทั้งหน้า Home และหน้า Products
    revalidateTag("products-data", "max");
    revalidateTag("home-data", "max");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("[Server Action] Error saving product:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Server Action สำหรับจัดลำดับสินค้าใหม่
 */
export async function reorderProducts(productOrders: { id: string; sort_order: number }[]) {
  try {
    // ใช้ upsert เพื่ออัปเดต sort_order ของหลายแถวพร้อมกัน
    const { error } = await supabase.from("products").upsert(productOrders, { onConflict: "id" });

    if (error) throw error;

    revalidateTag("products-data", "max");
    revalidateTag("home-data", "max");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("[Server Action] Error reordering products:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Server Action สำหรับล้างแคชแบบกำหนดเอง
 */
export async function refreshCache(tag: string) {
  revalidateTag(tag, "max");
  return { success: true };
}
