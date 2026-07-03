import { createClient } from "@/lib/supabase/server";
import { Award } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ student_id?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: students } = await supabase.from("students").select("id, first_name, last_name, roll_number").order("first_name");

  const studentId = params?.student_id;
  const certificateType = params?.type || "Hifz";

  let selectedStudent = null;
  if (studentId) {
    const { data } = await supabase.from("students").select("*").eq("id", studentId).single();
    selectedStudent = data;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">সনদ ও প্রশংসাপত্র (Certificates)</h1>
          <p className="text-slate-500">শিক্ষার্থীদের জন্য অটোমেটিক সনদ জেনারেট এবং প্রিন্ট করুন</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm print:hidden">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">শিক্ষার্থী নির্বাচন করুন</label>
            <select name="student_id" className="w-full p-2 border rounded-md" required defaultValue={studentId || ""}>
              <option value="">-- নির্বাচন করুন --</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name} (Roll: {student.roll_number})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">সনদের ধরন</label>
            <select name="type" className="w-full p-2 border rounded-md" defaultValue={certificateType}>
              <option value="Hifz">হিফজ সমাপ্তি সনদ</option>
              <option value="Dawra">দাওরায়ে হাদিস সনদ</option>
              <option value="Testimonial">প্রশংসাপত্র</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
              জেনারেট করুন
            </button>
          </div>
        </form>
      </div>

      {selectedStudent && (
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="flex justify-end p-4 border-b print:hidden">
             <PrintButton targetId="printable-certificate" fileName="certificate.pdf" />
          </div>
          <div className="p-10" id="printable-certificate">
             {/* Certificate Template */}
             <div className="border-8 border-double border-slate-800 p-12 text-center relative max-w-4xl mx-auto">
                <div className="absolute top-10 left-10 opacity-10">
                   <Award className="w-48 h-48" />
                </div>
                <div className="absolute top-10 right-10 opacity-10">
                   <Award className="w-48 h-48" />
                </div>
                
                <h1 className="text-4xl font-bold text-slate-800 mb-2">বিসমিল্লাহির রাহমানির রাহিম</h1>
                <h2 className="text-3xl font-bold text-indigo-800 mb-8 mt-6">
                  {certificateType === "Hifz" ? "হিফজুল কুরআন সমাপ্তি সনদ" : 
                   certificateType === "Dawra" ? "দাওরায়ে হাদিস সমাপ্তি সনদ" : "প্রশংসাপত্র"}
                </h2>
                
                <p className="text-xl text-slate-700 leading-loose">
                  এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,<br/>
                  <span className="text-3xl font-bold text-slate-900 border-b-2 border-slate-400 inline-block px-4 py-2 mt-2 mb-4">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </span><br/>
                  পিতা: <span className="font-semibold">{selectedStudent.father_name || "__________________"}</span><br/>
                  তিনি আমাদের মাদ্রাসায় অত্যন্ত সুনামের সহিত অধ্যয়ন করেছেন এবং 
                  <span className="font-bold"> {certificateType === 'Hifz' ? 'পবিত্র কোরআন হিফজ' : 'নির্ধারিত পাঠ্যক্রম'} </span> 
                  সফলভাবে সম্পন্ন করেছেন। আমরা তার উজ্জ্বল ভবিষ্যৎ ও নেক হায়াত কামনা করি।
                </p>

                <div className="flex justify-between mt-24 px-12">
                   <div className="text-center">
                      <div className="border-t-2 border-slate-500 pt-2 w-48 mx-auto"></div>
                      <p className="text-lg font-semibold text-slate-800 mt-2">পরীক্ষক</p>
                   </div>
                   <div className="text-center">
                      <div className="border-t-2 border-slate-500 pt-2 w-48 mx-auto"></div>
                      <p className="text-lg font-semibold text-slate-800 mt-2">মুহতামিম</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
