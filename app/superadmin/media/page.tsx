"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, AlertTriangle, Loader2, CloudUpload, ImageIcon, Link2, Trash2, Diamond } from "lucide-react";

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
  url: string;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from('website-assets').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'updated_at', order: 'desc' },
      });

      if (error) {
        console.error("Error fetching files:", error);
        return;
      }

      if (data) {
        const filesWithUrls = data.map((file) => {
          const { data: { publicUrl } } = supabase.storage.from('website-assets').getPublicUrl(file.name);
          return {
            ...file,
            url: publicUrl,
          } as MediaFile;
        });
        setFiles(filesWithUrls);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      showNotification('success', 'อัปโหลดรูปภาพสำเร็จ');
      fetchFiles();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showNotification('error', `เกิดข้อผิดพลาด: ${msg}`);
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const deleteFile = async (name: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?')) return;

    try {
      const { error } = await supabase.storage.from('website-assets').remove([name]);
      if (error) throw error;
      showNotification('success', 'ลบรูปภาพเรียบร้อยแล้ว');
      fetchFiles();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showNotification('error', `ลบไม่สำเร็จ: ${msg}`);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification('success', 'คัดลอก URL เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight text-[32px]">
            คลังสื่อ <span className="text-[#002548] font-black">Media Library</span>
          </h2>
          <p className="text-slate-400 font-medium mt-3 max-w-xl text-[16px]">
            จัดการรูปภาพและไฟล์สื่อทั้งหมดของเว็บไซต์ อัปโหลดครั้งเดียวและนำ URL ไปใช้ได้ทุกที่
          </p>
        </div>
      </section>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-10 right-10 z-50 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-3 font-bold uppercase tracking-wider text-xs">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {notification.message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-10 items-start text-[16px]">
        {/* Upload Zone */}
        <div className="xl:col-span-1 space-y-6 lg:sticky lg:top-32 order-2 xl:order-1">
          <div 
            className={`relative rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed p-8 md:p-10 transition-all duration-500 flex flex-col items-center text-center group ${
              dragActive ? "border-[#D4AF37] bg-[#D4AF37]/5 scale-105 shadow-2xl shadow-[#D4AF37]/10" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 transition-all duration-500 ${
              uploading ? "animate-bounce bg-slate-100" : dragActive ? "bg-[#D4AF37] text-white rotate-12" : "bg-slate-50 text-slate-300 group-hover:bg-[#002548] group-hover:text-white group-hover:-rotate-12"
            }`}>
              {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <CloudUpload className="w-8 h-8" />}
            </div>

            <h3 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
              {uploading ? "กำลังอัปโหลด..." : dragActive ? "วางไฟล์ที่นี่" : "อัปโหลดรูปภาพ"}
            </h3>
            <p className="text-[11px] md:text-xs text-slate-400 font-medium mt-2 leading-relaxed px-2 md:px-4">
              ลากและวางรูปภาพที่นี่ หรือกดปุ่มด้านล่างเพื่อเลือกไฟล์
            </p>

            <label className="mt-6 md:mt-8 relative inline-flex items-center justify-center px-6 md:px-8 py-3.5 md:py-4 bg-[#002548] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl cursor-pointer shadow-xl shadow-[#002548]/20 hover:bg-slate-800 transition-all active:scale-95">
              <span>เลือกไฟล์จากเครื่อง</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} disabled={uploading} />
            </label>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
            <h4 className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">คำแนะนำการใช้งาน</h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                "รองรับไฟล์ JPG, PNG และ WebP",
                "ขนาดไฟล์ไม่ควรเกิน 5MB",
                "คัดลอก URL ไปใส่ในหน้าจัดการเนื้อหา",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-[11px] md:text-xs font-medium text-slate-500 leading-relaxed">
                  <Diamond className="w-3 h-3 text-[#D4AF37] shrink-0 fill-[#D4AF37]" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="xl:col-span-3 order-1 xl:order-2">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-square bg-white rounded-[1.5rem] md:rounded-[2rem] animate-pulse border border-slate-100"></div>
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 p-12 md:p-20 flex flex-col items-center text-center">
              <div className="mb-4 md:mb-6 grayscale opacity-20"><ImageIcon className="w-16 h-16 md:w-24 md:h-24" /></div>
              <h3 className="text-base md:text-xl font-bold text-slate-400 tracking-tight uppercase tracking-[0.1em]">ไม่มีไฟล์ในคลังสื่อ</h3>
              <p className="text-[11px] md:text-sm text-slate-300 mt-2 font-medium">เริ่มต้นอัปโหลดรูปภาพเพื่อใช้งานในเว็บไซต์ของคุณ</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {files.map((file) => (
                <div key={file.id} className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#002548]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-2 md:gap-4 text-[16px]">
                       <button 
                        onClick={() => copyToClipboard(file.url)}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-xl hover:scale-110 transition-transform active:scale-90"
                        title="Copy URL"
                       >
                         <Link2 className="w-5 h-5 md:w-6 md:h-6" />
                       </button>
                       <button 
                        onClick={() => deleteFile(file.name)}
                        className="w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-xl hover:scale-110 transition-transform active:scale-90"
                        title="Delete"
                       >
                         <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                       </button>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 text-[16px]">
                    <p className="text-[11px] md:text-[13px] font-bold text-slate-800 truncate mb-1">{file.name.split('_').pop()}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {(file.metadata.size / 1024).toFixed(1)} KB
                      </p>
                      <button 
                        onClick={() => copyToClipboard(file.url)}
                        className="text-[9px] md:text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:text-[#002548] transition-colors truncate"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
