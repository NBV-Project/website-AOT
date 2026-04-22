"use server";

import { supabase } from "@/lib/supabase";

export async function savePageContent(pageName: string, content: unknown) {
  try {
    const { error } = await supabase.from("page_content").upsert(
      {
        page_name: pageName,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "page_name" },
    );

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error(`[Server Action] Error saving ${pageName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function saveProduct(product: { id: string; [key: string]: unknown }) {
  try {
    const { error } = await supabase.from("products").upsert(
      {
        ...product,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("[Server Action] Error saving product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function reorderProducts(productOrders: { id: string; sort_order: number }[]) {
  try {
    const { error } = await supabase
      .from("products")
      .upsert(productOrders, { onConflict: "id" });

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("[Server Action] Error reordering products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function refreshCache() {
  return { success: true };
}
