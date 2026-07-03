"use client";

import { useActionState } from "react";
import { updateStudent } from "@/app/actions/students";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const initialState: { error?: string; success?: boolean } = {};

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [state, formAction, isPending] = useActionState(
    updateStudent,
    initialState,
  );
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [{ data, error }, classesData] = await Promise.all([
        supabase
          .from("students")
          .select("*")
          .eq("id", resolvedParams.id)
          .single(),
        import("@/app/actions/students").then(m => m.getClasses())
      ]);

      if (data) setStudent(data);
      if (classesData) setClasses(classesData);
      setLoading(false);
    };
    fetchData();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard/students");
    }
  }, [state, router]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">শিক্ষার্থীর তথ্য লোড হচ্ছে...</div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-red-500">শিক্ষার্থী পাওয়া যায়নি।</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/students"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">শিক্ষার্থী সম্পাদনা করুন</h1>
          <p className="text-slate-500">
            {student.first_name} {student.last_name} এর তথ্য আপডেট করুন
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={student.id} />
          {state?.error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-slate-700"
              >
                প্রথম নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                defaultValue={student.first_name}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-slate-700"
              >
                শেষ নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                defaultValue={student.last_name}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="roll_number"
                className="text-sm font-medium text-slate-700"
              >
                রোল নম্বর
              </label>
              <input
                type="text"
                id="roll_number"
                name="roll_number"
                defaultValue={student.roll_number || ""}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="class_id"
                className="text-sm font-medium text-slate-700"
              >
                জামাত / ক্লাস <span className="text-red-500">*</span>
              </label>
              <select
                id="class_id"
                name="class_id"
                required
                defaultValue={student.class_id || ""}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition bg-white"
              >
                <option value="">ক্লাস নির্বাচন করুন</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="father_name"
                className="text-sm font-medium text-slate-700"
              >
                পিতার নাম
              </label>
              <input
                type="text"
                id="father_name"
                name="father_name"
                defaultValue={student.father_name || ""}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-slate-700"
              >
                ঠিকানা
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={student.address || ""}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="photo_url"
                className="text-sm font-medium text-slate-700"
              >
                ছবি (URL)
              </label>
              <input
                type="url"
                id="photo_url"
                name="photo_url"
                placeholder="https://example.com/photo.jpg"
                defaultValue={student.photo_url || ""}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="parent_phone"
                className="text-sm font-medium text-slate-700"
              >
                অভিভাবকের ফোন নম্বর
              </label>
              <input
                type="tel"
                id="parent_phone"
                name="parent_phone"
                defaultValue={student.parent_phone || ""}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
            >
              {isPending ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
