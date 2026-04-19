import type { NextConfig } from "next";

const legacyPublicRedirects = [
  ["/", "/th"],
  ["/about", "/th/about"],
  ["/products", "/th/products"],
  ["/contact", "/th/contact"],
  ["/logistics", "/th/logistics"],
] as const;

const remotePatterns = [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

if (supabaseUrl) {
  try {
    const parsedSupabaseUrl = new URL(supabaseUrl);
    remotePatterns.push({
      protocol: parsedSupabaseUrl.protocol.replace(":", "") as "http" | "https",
      hostname: parsedSupabaseUrl.hostname,
      port: parsedSupabaseUrl.port || "",
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // Ignore invalid NEXT_PUBLIC_SUPABASE_URL here; app-level validation handles runtime needs.
  }
}

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns,
  },
  async headers() {
    return [
      {
        // Static assets: cache for 1 year (immutable)
        source: "/:path(images|videos|fonts|geo)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return legacyPublicRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
