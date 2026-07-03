import { createClient } from "@/lib/supabase/server";
import PrintButton from "@/app/components/PrintButton";
import { IdCard } from "lucide-react";

export default async function IdCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ class_id?: string; user_type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: classes } = await supabase.from("classes").select("id, name");

  const classId = params?.class_id;
  const userType = params?.user_type || "Student";

  let users = [];

  if (userType === "Student" && classId) {
    const { data } = await supabase.from("students").select("*, classes(name)").eq("class_id", classId);
    users = data || [];
  } else if (userType === "Teacher") {
    const { data } = await supabase.from("teachers").select("*");
    users = data || [];
  } else if (userType === "Student") {
    const { data } = await supabase.from("students").select("*, classes(name)").limit(10); // Show max 10 initially if no class
    users = data || [];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">আইডি কার্ড জেনারেটর (ID Cards)</h1>
          <p className="text-slate-500">শিক্ষার্থী ও শিক্ষকদের জন্য ডিজিটাল আইডি কার্ড তৈরি এবং প্রিন্ট করুন</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm print:hidden">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">কার জন্য?</label>
            <select name="user_type" className="w-full p-2 border rounded-md" defaultValue={userType}>
              <option value="Student">ছাত্র (Student)</option>
              <option value="Teacher">শিক্ষক (Teacher)</option>
            </select>
          </div>
          {userType === "Student" && (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">জামাত (Class)</label>
               <select name="class_id" className="w-full p-2 border rounded-md" defaultValue={classId || ""}>
                 <option value="">সকল জামাত</option>
                 {classes?.map((c) => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
             </div>
          )}
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
              খুঁজুন
            </button>
          </div>
        </form>
      </div>

      {users && users.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 print:hidden">
             <h2 className="text-lg font-bold text-slate-800">সর্বমোট {users.length} জনের আইডি কার্ড পাওয়া গেছে</h2>
             <PrintButton targetId="id-cards-print-area" fileName="id-cards.pdf" />
          </div>

          <div id="id-cards-print-area" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:grid-cols-2 print:gap-4">
             {users.map((user) => (
                <div key={user.id} className="w-[300px] h-[450px] border border-slate-300 rounded-xl overflow-hidden mx-auto shadow-md relative bg-white flex flex-col">
                   <div className="h-24 bg-blue-700 text-white flex flex-col items-center justify-center p-4">
                      <h3 className="font-bold text-lg tracking-wider">QawmiERP</h3>
                      <p className="text-xs text-blue-200">মাদরাসা ম্যানেজমেন্ট সিস্টেম</p>
                   </div>
                   
                   <div className="flex-1 flex flex-col items-center px-6 pt-12 relative">
                      {/* Placeholder for Photo */}
                      <div className="absolute -top-10 bg-slate-200 w-24 h-24 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                         <IdCard className="w-10 h-10 text-slate-400" />
                      </div>

                      <h4 className="text-xl font-bold text-slate-800 mt-2 text-center">
                         {userType === 'Student' ? `${user.first_name} ${user.last_name}` : user.name}
                      </h4>
                      <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium mt-1 uppercase">
                         {userType === 'Student' ? 'Student' : 'Teacher / Staff'}
                      </span>

                      <div className="w-full mt-6 space-y-2 text-sm">
                         {userType === 'Student' ? (
                            <>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">ID / Roll No:</span>
                                  <span className="font-semibold text-slate-800">{user.roll_number || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">Class:</span>
                                  <span className="font-semibold text-slate-800">{user.classes?.name || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">Blood Group:</span>
                                  <span className="font-semibold text-red-600">{user.blood_group || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">Phone:</span>
                                  <span className="font-semibold text-slate-800">{user.parent_phone || 'N/A'}</span>
                               </div>
                            </>
                         ) : (
                            <>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">Designation:</span>
                                  <span className="font-semibold text-slate-800">{user.designation || 'Teacher'}</span>
                               </div>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">Phone:</span>
                                  <span className="font-semibold text-slate-800">{user.phone || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between border-b pb-1">
                                  <span className="text-slate-500">Blood Group:</span>
                                  <span className="font-semibold text-red-600">-</span>
                               </div>
                            </>
                         )}
                      </div>
                   </div>

                   <div className="h-10 bg-slate-800 text-white flex items-center justify-center text-xs">
                      Issuer Authority Signature
                   </div>
                </div>
             ))}
          </div>
        </div>
      )}
      
      {(!users || users.length === 0) && (
        <div className="bg-white p-8 text-center rounded-xl border border-dashed">
          <p className="text-slate-500">কোনো তথ্য পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}
