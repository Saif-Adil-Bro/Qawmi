"use client";

import { useState } from "react";
import PrintButton from "@/app/components/PrintButton";
import { IdCard, Palette, LayoutTemplate } from "lucide-react";

export default function IdCardClient({ users, userType }: { users: any[], userType: string }) {
  const [template, setTemplate] = useState("modern");
  const [themeColor, setThemeColor] = useState("blue");

  if (!users || users.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-xl border border-dashed">
        <p className="text-slate-500">কোনো তথ্য পাওয়া যায়নি</p>
      </div>
    );
  }

  const colors: Record<string, { bg: string, text: string, border: string, light: string }> = {
    blue: { bg: "bg-blue-700", text: "text-blue-700", border: "border-blue-700", light: "bg-blue-50 text-blue-700" },
    emerald: { bg: "bg-emerald-700", text: "text-emerald-700", border: "border-emerald-700", light: "bg-emerald-50 text-emerald-700" },
    indigo: { bg: "bg-indigo-700", text: "text-indigo-700", border: "border-indigo-700", light: "bg-indigo-50 text-indigo-700" },
    rose: { bg: "bg-rose-700", text: "text-rose-700", border: "border-rose-700", light: "bg-rose-50 text-rose-700" },
    slate: { bg: "bg-slate-800", text: "text-slate-800", border: "border-slate-800", light: "bg-slate-100 text-slate-800" },
  };

  const currentTheme = colors[themeColor] || colors.blue;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 print:border-none print:shadow-none print:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden gap-4">
        <h2 className="text-lg font-bold text-slate-800">সর্বমোট {users.length} জনের আইডি কার্ড পাওয়া গেছে</h2>
        
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-lg border">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded p-1"
            >
              <option value="modern">মডার্ন ডিজাইন</option>
              <option value="classic">ক্লাসিক ডিজাইন</option>
              <option value="minimal">মিনিমাল ডিজাইন</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            <select 
              value={themeColor} 
              onChange={(e) => setThemeColor(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded p-1"
            >
              <option value="blue">নীল (Blue)</option>
              <option value="emerald">সবুজ (Emerald)</option>
              <option value="indigo">ইন্ডিগো (Indigo)</option>
              <option value="rose">লাল (Rose)</option>
              <option value="slate">কালো (Dark)</option>
            </select>
          </div>

          <PrintButton targetId="id-cards-print-area" fileName="id-cards.pdf" />
        </div>
      </div>

      <div id="id-cards-print-area" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 print:grid-cols-2 print:gap-x-4 print:gap-y-8">
        {users.map((user) => (
          <div key={user.id} className="mx-auto" style={{ width: '2in', height: '3.5in' }}>
            {template === 'modern' && (
              <div className="w-full h-full border border-slate-300 rounded-xl overflow-hidden shadow-sm relative bg-white flex flex-col">
                <div className={`h-20 ${currentTheme.bg} text-white flex flex-col items-center justify-center p-2`}>
                  <h3 className="font-bold text-sm tracking-wider">QawmiERP</h3>
                  <p className="text-[10px] opacity-80">মাদরাসা ম্যানেজমেন্ট</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 pt-10 relative">
                  <div className="absolute -top-8 bg-slate-200 w-16 h-16 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center overflow-hidden">
                    <IdCard className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mt-1 text-center leading-tight">
                    {userType === 'Student' ? `${user.first_name} ${user.last_name}` : user.name}
                  </h4>
                  <span className={`${currentTheme.light} text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 uppercase`}>
                    {userType === 'Student' ? 'Student' : 'Teacher / Staff'}
                  </span>
                  
                  <div className="w-full mt-3 space-y-1 text-xs">
                    {userType === 'Student' ? (
                      <>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Roll:</span>
                          <span className="font-semibold text-slate-800">{user.roll_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Class:</span>
                          <span className="font-semibold text-slate-800">{user.classes?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Blood:</span>
                          <span className="font-semibold text-red-600">{user.blood_group || '-'}</span>
                        </div>
                        <div className="flex justify-between pb-0.5">
                          <span className="text-slate-500">Phone:</span>
                          <span className="font-semibold text-slate-800 text-[10px]">{user.parent_phone || 'N/A'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Role:</span>
                          <span className="font-semibold text-slate-800 text-[10px]">{user.designation || 'Teacher'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-500">Phone:</span>
                          <span className="font-semibold text-slate-800 text-[10px]">{user.phone || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={`h-8 ${currentTheme.bg} text-white flex items-center justify-center text-[10px]`}>
                  Issuer Signature
                </div>
              </div>
            )}

            {template === 'classic' && (
              <div className={`w-full h-full border-2 ${currentTheme.border} rounded-lg overflow-hidden relative bg-white flex flex-col`}>
                <div className="flex items-center justify-between p-3 border-b border-slate-200">
                   <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                     <IdCard className={`w-4 h-4 ${currentTheme.text}`} />
                   </div>
                   <div className="text-right">
                     <h3 className={`font-bold text-xs ${currentTheme.text} uppercase`}>QawmiERP</h3>
                     <p className="text-[8px] text-slate-500 uppercase">Identity Card</p>
                   </div>
                </div>
                
                <div className="flex-1 flex flex-col px-3 py-2">
                  <div className="flex gap-2 items-start mb-2">
                    <div className="bg-slate-100 w-12 h-14 border border-slate-300 flex-shrink-0 flex items-center justify-center">
                       <span className="text-[8px] text-slate-400">Photo</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {userType === 'Student' ? `${user.first_name} ${user.last_name}` : user.name}
                      </h4>
                      <p className={`text-[10px] font-bold ${currentTheme.text} uppercase`}>
                        {userType === 'Student' ? 'Student' : user.designation || 'Teacher / Staff'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-[10px] mt-1">
                    {userType === 'Student' && (
                      <>
                        <p><span className="font-bold text-slate-600">Roll No:</span> {user.roll_number}</p>
                        <p><span className="font-bold text-slate-600">Class:</span> {user.classes?.name}</p>
                        <p><span className="font-bold text-slate-600">Blood Grp:</span> <span className="text-red-600 font-bold">{user.blood_group || '-'}</span></p>
                        <p><span className="font-bold text-slate-600">Contact:</span> {user.parent_phone}</p>
                      </>
                    )}
                    {userType !== 'Student' && (
                      <>
                        <p><span className="font-bold text-slate-600">ID No:</span> {user.id.substring(0,6)}</p>
                        <p><span className="font-bold text-slate-600">Contact:</span> {user.phone}</p>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-auto flex justify-between items-end pt-2">
                     <div className="text-center">
                       <div className="w-12 border-b border-slate-800 mb-0.5"></div>
                       <p className="text-[8px]">Holder</p>
                     </div>
                     <div className="text-center">
                       <div className="w-12 border-b border-slate-800 mb-0.5"></div>
                       <p className="text-[8px]">Authority</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {template === 'minimal' && (
              <div className="w-full h-full border border-slate-200 rounded-sm overflow-hidden relative bg-white flex flex-col p-4">
                <h3 className={`font-black text-sm text-center tracking-widest uppercase ${currentTheme.text}`}>QawmiERP</h3>
                <div className="w-full border-b-2 border-slate-100 my-2"></div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-slate-100 w-16 h-16 rounded-full mb-3 flex items-center justify-center">
                     <IdCard className={`w-8 h-8 ${currentTheme.text} opacity-50`} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 text-center uppercase tracking-wide">
                    {userType === 'Student' ? `${user.first_name} ${user.last_name}` : user.name}
                  </h4>
                  <div className={`w-8 h-0.5 ${currentTheme.bg} my-2`}></div>
                  
                  <div className="text-[10px] text-center text-slate-500 space-y-0.5">
                    {userType === 'Student' ? (
                      <>
                        <p className="uppercase font-semibold tracking-wider text-slate-700">{user.classes?.name}</p>
                        <p>ID: {user.roll_number}</p>
                        <p>Blood: {user.blood_group || 'N/A'}</p>
                      </>
                    ) : (
                      <>
                        <p className="uppercase font-semibold tracking-wider text-slate-700">{user.designation || 'Teacher'}</p>
                        <p>ID: {user.id.substring(0,8)}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
