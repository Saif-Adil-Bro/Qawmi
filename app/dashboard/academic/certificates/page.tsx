import { createClient } from "@/lib/supabase/server";
import { Award } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";
import CertificateClient from "./CertificateClient";
import { getMadrasaInfo } from "@/lib/getMadrasaInfo";

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ student_id?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const madrasaInfo = await getMadrasaInfo();

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
        <CertificateClient selectedStudent={selectedStudent} certificateType={certificateType} madrasaInfo={madrasaInfo} />
      )}
    </div>
  );
}
