import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");
  const width = parseInt(searchParams.get("w") || "1080");
  const quality = parseInt(searchParams.get("q") || "75");

  if (!src || !src.startsWith("/")) {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", src);
    const imageBuffer = await fs.readFile(filePath);

    const acceptHeader = request.headers.get("accept") || "";
    const supportsAvif = acceptHeader.includes("image/avif");
    const format = supportsAvif ? "avif" : "webp";

    const optimizedImage = await sharp(imageBuffer)
      .resize({ width, withoutEnlargement: true })
      [format]({ quality })
      .toBuffer();

    const body = new Uint8Array(optimizedImage);

    return new NextResponse(body, {
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("CDN Error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
