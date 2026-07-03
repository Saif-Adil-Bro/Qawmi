"use client";

import { useState } from "react";
import { Award, Palette, LayoutTemplate } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";

export default function CertificateClient({ selectedStudent, certificateType, madrasaInfo }: { selectedStudent: any, certificateType: string, madrasaInfo?: {name: string, address: string, phone: string} }) {
  const [template, setTemplate] = useState("ornate");
  const [themeColor, setThemeColor] = useState("slate");

  if (!selectedStudent) return null;

  const colors: Record<string, { main: string, text: string, accent: string, border: string }> = {
    slate: { main: "border-slate-800", text: "text-slate-800", accent: "text-slate-600", border: "border-slate-500" },
    indigo: { main: "border-indigo-800", text: "text-indigo-800", accent: "text-indigo-600", border: "border-indigo-500" },
    emerald: { main: "border-emerald-800", text: "text-emerald-800", accent: "text-emerald-600", border: "border-emerald-500" },
    rose: { main: "border-rose-800", text: "text-rose-800", accent: "text-rose-600", border: "border-rose-500" },
    amber: { main: "border-amber-700", text: "text-amber-800", accent: "text-amber-600", border: "border-amber-500" },
  };

  const currentTheme = colors[themeColor] || colors.slate;

  return (
    <div className="bg-white rounded-xl border shadow-sm print:border-none print:shadow-none">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b print:hidden gap-4">
        <h2 className="text-lg font-bold text-slate-800">সার্টিফিকেট প্রিভিউ</h2>
        
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-lg border">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded p-1"
            >
              <option value="ornate">ক্লাসিক (Ornate)</option>
              <option value="standard">স্ট্যান্ডার্ড (Standard)</option>
              <option value="minimal">মিনিমাল (Minimal)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            <select 
              value={themeColor} 
              onChange={(e) => setThemeColor(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded p-1"
            >
              <option value="slate">কালো (Dark)</option>
              <option value="indigo">ইন্ডিগো (Indigo)</option>
              <option value="emerald">সবুজ (Emerald)</option>
              <option value="rose">লাল (Rose)</option>
              <option value="amber">সোনালী (Amber)</option>
            </select>
          </div>

          <PrintButton targetId="printable-certificate" fileName="certificate.pdf" />
        </div>
      </div>

      <div className="p-10 flex justify-center" id="printable-certificate" style={{minHeight: "11in", display: "flex", alignItems: "center"}}>
        
        {template === 'ornate' && (
          <div className={`border-[12px] border-double ${currentTheme.main} p-12 text-center relative w-[10in] h-[7.5in] bg-white flex flex-col justify-center`}>
            <div className={`absolute top-10 left-10 opacity-10 ${currentTheme.text}`}>
               <Award className="w-32 h-32" />
            </div>
            <div className={`absolute top-10 right-10 opacity-10 ${currentTheme.text}`}>
               <Award className="w-32 h-32" />
            </div>
            
            <h1 className={`text-4xl font-black ${currentTheme.text} mb-2 tracking-widest`}>{madrasaInfo?.name || "Qawmi Madrasa"}</h1>
            <p className="text-xl text-slate-600 mb-2">{madrasaInfo?.address || "Address"}</p>
            <h1 className={`text-xl font-bold ${currentTheme.text} mb-2 tracking-widest`}>বিসমিল্লাহির রাহমানির রাহিম</h1>
            <h2 className={`text-3xl font-bold ${currentTheme.text} mb-8 mt-6`}>
              {certificateType === "Hifz" ? "হিফজুল কুরআন সমাপ্তি সনদ" :
                certificateType === "Dawra" ? "দাওরায়ে হাদিস সমাপ্তি সনদ" : "প্রশংসাপত্র"}
            </h2>
            
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-2xl text-slate-700 leading-loose">
                এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,
                <br/>
                <span className={`text-4xl font-bold ${currentTheme.text} border-b-2 ${currentTheme.border} inline-block px-8 py-2 mt-4 mb-6`}>
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </span>
                <br/>
                পিতা: <span className="font-semibold">{selectedStudent.father_name || "__________________"}</span>
                <br/>
                তিনি আমাদের মাদ্রাসায় অত্যন্ত সুনামের সহিত অধ্যয়ন করেছেন এবং 
                <span className={`font-bold ${currentTheme.accent}`}> {certificateType === 'Hifz' ? 'পবিত্র কোরআন হিফজ' : 'নির্ধারিত পাঠ্যক্রম'} </span> 
                সফলভাবে সম্পন্ন করেছেন। আমরা তার উজ্জ্বল ভবিষ্যৎ ও নেক হায়াত কামনা করি।
              </p>
            </div>

            <div className="flex justify-between mt-12 px-12">
               <div className="text-center">
                  <div className={`border-t-2 ${currentTheme.border} pt-2 w-48 mx-auto`}></div>
                  <p className={`text-lg font-semibold ${currentTheme.text} mt-2`}>পরীক্ষক</p>
               </div>
               <div className="text-center">
                  <div className={`border-t-2 ${currentTheme.border} pt-2 w-48 mx-auto`}></div>
                  <p className={`text-lg font-semibold ${currentTheme.text} mt-2`}>মুহতামিম</p>
               </div>
            </div>
          </div>
        )}

        {template === 'standard' && (
          <div className={`border-8 solid ${currentTheme.main} p-12 text-center relative w-[10in] h-[7.5in] bg-slate-50 flex flex-col justify-center`}>
            <h1 className={`text-4xl font-black ${currentTheme.text} mb-2 tracking-widest uppercase`}>{madrasaInfo?.name || "Qawmi Madrasa"}</h1>
            <p className="text-xl text-slate-600 mb-4">{madrasaInfo?.address || "Address"}</p>
            <h1 className={`text-2xl font-bold text-slate-800 mb-2`}>বিসমিল্লাহির রাহমানির রাহিম</h1>
            <div className={`w-32 h-1 ${currentTheme.main} bg-current mx-auto my-4`}></div>
            <h2 className={`text-4xl font-black ${currentTheme.text} mb-12 uppercase tracking-wide`}>
              {certificateType === "Hifz" ? "হিফজুল কুরআন সমাপ্তি সনদ" :
                certificateType === "Dawra" ? "দাওরায়ে হাদিস সমাপ্তি সনদ" : "প্রশংসাপত্র"}
            </h2>
            
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xl text-slate-700 leading-[3]">
                প্রত্যয়ন করা যাচ্ছে যে,<br/>
                <span className={`text-3xl font-bold ${currentTheme.text} italic`}>
                  {selectedStudent.first_name} {selectedStudent.last_name}
                </span><br/>
                পিতা: <span className="font-semibold">{selectedStudent.father_name || "__________________"}</span><br/>
                তিনি আমাদের মাদ্রাসায় অধ্যয়ন করে
                <span className={`font-bold ${currentTheme.accent}`}> {certificateType === 'Hifz' ? 'পবিত্র কোরআন হিফজ' : 'নির্ধারিত পাঠ্যক্রম'} </span> 
                সফলভাবে সম্পন্ন করেছেন। আমরা তার উজ্জ্বল ভবিষ্যৎ কামনা করি।
              </p>
            </div>

            <div className="flex justify-between mt-12 px-12">
               <div className="text-center">
                  <div className={`border-t border-slate-800 pt-2 w-48 mx-auto`}></div>
                  <p className={`text-lg font-semibold text-slate-800 mt-2 uppercase text-sm`}>পরীক্ষক</p>
               </div>
               <div className="text-center">
                  <div className={`border-t border-slate-800 pt-2 w-48 mx-auto`}></div>
                  <p className={`text-lg font-semibold text-slate-800 mt-2 uppercase text-sm`}>মুহতামিম</p>
               </div>
            </div>
          </div>
        )}

        {template === 'minimal' && (
          <div className="p-16 text-center relative w-[10in] h-[7.5in] bg-white flex flex-col justify-center">
            <h1 className={`text-2xl text-slate-500 tracking-widest uppercase mb-16`}>Certificate of Completion</h1>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              <p className="text-lg text-slate-500 mb-4 uppercase tracking-widest">This is to certify that</p>
              <h2 className={`text-5xl font-light ${currentTheme.text} mb-4`}>
                {selectedStudent.first_name} {selectedStudent.last_name}
              </h2>
              <p className="text-md text-slate-400 mb-12">Son of {selectedStudent.father_name || "__________________"}</p>
              
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                has successfully completed the
                <span className={`font-medium ${currentTheme.text}`}> {certificateType === 'Hifz' ? 'Hifz-ul-Quran' : 'designated coursework'} </span> 
                with dedication and excellence.
              </p>
            </div>

            <div className="flex justify-between mt-24 px-12 w-full">
               <div className="text-left w-64">
                  <p className={`text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2`}>Date</p>
                  <p className="text-slate-500">{new Date().toLocaleDateString('en-GB')}</p>
               </div>
               <div className="text-right w-64">
                  <p className={`text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2`}>Principal</p>
                  <div className={`border-b ${currentTheme.border} w-full pb-6`}></div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
