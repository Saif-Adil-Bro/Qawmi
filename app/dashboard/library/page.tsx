import Link from "next/link";
import { Library, BookUp, BookDown } from "lucide-react";

export default function LibraryDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">কুতুবখানা (Library)</h1>
        <p className="text-slate-500">কিতাবসমূহের ইনভেন্টরি, কিতাব ইস্যু এবং রিটার্ন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/library/books" className="block">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-slate-300 transition group cursor-pointer h-full">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition">
                <Library className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">কিতাবের তালিকা</h2>
            </div>
            <p className="text-sm text-slate-600">কুতুবখানার সকল কিতাবের নাম, লেখক, এবং স্টকের তথ্য।</p>
          </div>
        </Link>

        <Link href="/dashboard/library/issue" className="block">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-slate-300 transition group cursor-pointer h-full">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-amber-50 p-3 rounded-lg group-hover:bg-amber-100 transition">
                <BookUp className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">কিতাব ইস্যু (Issue)</h2>
            </div>
            <p className="text-sm text-slate-600">শিক্ষক বা ছাত্রদের কাছে কিতাব ইস্যু করার এন্ট্রি।</p>
          </div>
        </Link>

        <Link href="/dashboard/library/return" className="block">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-slate-300 transition group cursor-pointer h-full">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg group-hover:bg-emerald-100 transition">
                <BookDown className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">কিতাব ফেরত (Return)</h2>
            </div>
            <p className="text-sm text-slate-600">ইস্যু করা কিতাব ফেরত নেওয়ার তালিকা ও ট্র্যাকিং।</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
