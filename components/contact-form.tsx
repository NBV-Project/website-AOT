"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ContactFormProps = {
  copy: {
    formTitle: string;
    formBody: string;
    formLabels: {
      name: string;
      email: string;
      inquiryType: string;
      timeline: string;
      details: string;
    };
    placeholders: {
      name: string;
      email: string;
      timeline: string;
      details: string;
    };
    options: string[];
    submit: string;
  };
  lang: string;
};

export function ContactForm({ copy, lang }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: copy.options[0],
    timeline: "",
    message: ""
  });

  const labels = {
    th: {
      successHeader: "ส่งข้อมูลสำเร็จ",
      successBody: "ขอบคุณข้อมูลของคุณ ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
      sendNew: "ส่งข้อความใหม่",
      sending: "กำลังส่ง...",
      error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
    },
    en: {
      successHeader: "Successfully Sent",
      successBody: "Thank you for your inquiry. Our team will get back to you shortly.",
      sendNew: "Send another message",
      sending: "Sending...",
      error: "An error occurred. Please try again."
    },
    zh: {
      successHeader: "提交成功",
      successBody: "感谢您的咨询。我们的团队将尽快与您联系。",
      sendNew: "发送新消息",
      sending: "正在发送...",
      error: "发生错误，请重试。"
    },
  }[lang as "th" | "en" | "zh"] || {
    successHeader: "Successfully Sent",
    successBody: "Thank you for your inquiry.",
    sendNew: "Send another message",
    sending: "Sending...",
    error: "An error occurred."
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: `${formData.message}\n\nTimeline: ${formData.timeline}`,
          status: 'New'
        }]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: copy.options[0],
        timeline: "",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(labels.error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 shadow-sm sm:p-10 lg:col-span-7 lg:p-14 flex flex-col items-center justify-center text-center min-h-[400px] reveal">
        <div className="h-20 w-20 rounded-full bg-[#95bb72]/10 flex items-center justify-center mb-6">
          <svg className="h-10 w-10 text-[#6f9152]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold text-[#002548] md:text-5xl">
          {labels.successHeader}
        </h2>
        <p className="mt-5 max-w-md text-base leading-[1.7] text-slate-600 md:text-lg">
          {labels.successBody}
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-10 text-base font-medium text-[#6f9152] border-b-2 border-[#95bb72]/30 hover:border-[#95bb72] transition-all"
        >
          {labels.sendNew}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 shadow-sm sm:p-10 lg:col-span-7 lg:p-14 reveal text-[16px]">
      <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold text-[#002548] md:text-5xl">
        {copy.formTitle}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-[1.7] text-slate-600 md:text-lg">
        {copy.formBody}
      </p>

      <form className="mt-10 space-y-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              {copy.formLabels.name}
            </label>
            <input
              required
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={copy.placeholders.name}
              className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-4 text-sm placeholder:text-slate-300 focus:border-b-2 focus:border-[#002548] focus:ring-0"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              {copy.formLabels.email}
            </label>
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={copy.placeholders.email}
              className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-4 text-sm placeholder:text-slate-300 focus:border-b-2 focus:border-[#002548] focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              {copy.formLabels.inquiryType}
            </label>
            <select 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full appearance-none border-0 border-b border-slate-300 bg-transparent px-0 py-4 text-sm focus:border-b-2 focus:border-[#002548] focus:ring-0"
            >
              {copy.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              {copy.formLabels.timeline}
            </label>
            <input
              name="timeline"
              type="text"
              value={formData.timeline}
              onChange={handleChange}
              placeholder={copy.placeholders.timeline}
              className="w-full border-0 border-b border-slate-300 bg-transparent px-0 py-4 text-sm placeholder:text-slate-300 focus:border-b-2 focus:border-[#002548] focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            {copy.formLabels.details}
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder={copy.placeholders.details}
            className="w-full resize-none border-0 border-b border-slate-300 bg-transparent px-0 py-4 text-sm placeholder:text-slate-300 focus:border-b-2 focus:border-[#002548] focus:ring-0"
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="inline-flex min-w-[10rem] items-center justify-center rounded-md border-2 border-[#002548] bg-transparent px-7 py-4 text-center font-[family-name:var(--font-montserrat)] text-base font-medium text-[#002548] transition duration-300 hover:-translate-y-0.5 hover:border-[#003366] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#002548] border-t-transparent" />
              {labels.sending}
            </span>
          ) : copy.submit}
        </button>
      </form>
    </div>
  );
}
