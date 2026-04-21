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
  // Tree-shake icon/utility libraries to only ship used modules
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80, 85, 90],
    minimumCacheTTL: 86400,
    remotePatterns,
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
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
