const DEFAULT_CMS_ASSET_BUCKET = "website-assets";

export const CMS_ASSET_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_CMS_ASSET_BUCKET;

export function getSupabaseProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) return null;

  try {
    const hostname = new URL(url).hostname;
    return hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

export function formatStorageError(error: unknown) {
  const fallback = error instanceof Error ? error.message : "Unknown storage error";

  if (!fallback.toLowerCase().includes("bucket not found")) {
    return fallback;
  }

  const projectRef = getSupabaseProjectRef();
  const projectLabel = projectRef ? `project ${projectRef}` : "the current Supabase project";

  return `Bucket "${CMS_ASSET_BUCKET}" was not found in ${projectLabel}. Create that bucket in Supabase Storage or set NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET to the correct bucket name.`;
}
