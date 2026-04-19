"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type CmsAssetUploadButtonProps = {
  src: string;
  alt?: string;
  accept?: string;
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
  label?: string;
  onUploaded: (publicUrl: string) => void;
  pathPrefix?: string;
};

function slugifyFilename(name: string) {
  const baseName = name.replace(/\.[^/.]+$/, "");
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "asset";
}

export function CmsAssetUploadButton({
  src,
  alt = "Preview image",
  accept = "image/*",
  aspectClassName = "aspect-[4/3]",
  className = "",
  imageClassName = "object-cover",
  label = "อัปโหลดรูปใหม่",
  onUploaded,
  pathPrefix = "cms",
}: CmsAssetUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const filename = `${pathPrefix}/${slugifyFilename(file.name)}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from("website-assets").upload(filename, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("website-assets").getPublicUrl(filename);

      onUploaded(publicUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />

      <div className="group relative overflow-hidden rounded-2xl bg-slate-100">
        <div className={`relative w-full ${aspectClassName}`}>
          <Image src={src} alt={alt} fill className={imageClassName} />

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="rounded-2xl border border-white/30 bg-white/20 px-5 py-3 font-kanit text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="inline-flex items-center gap-2">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isUploading ? "กำลังอัปโหลด..." : label}
              </span>
            </button>
          </div>
        </div>
      </div>

      {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}
    </div>
  );
}
