import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Timeout wrapper for Supabase queries
  async function withTimeout<T>(promise: any, ms: number = 8000, context: string = "Request"): Promise<T> {
    const timeout = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`${context} timed out after ${ms}ms. Please check database configuration.`)), ms)
    );
    return Promise.race([promise, timeout]);
  }

  let user;
  try {
    const response = await withTimeout<any>(supabase.auth.getUser(), 8000, "Auth getUser");
    user = response.data?.user;
  } catch (err: any) {
    return <div className="p-8 text-red-500">সেশন লোড করতে সমস্যা হয়েছে: {err?.message}</div>;
  }

  if (!user) {
    return <div className="p-8">ড্যাশবোর্ডে প্রবেশ করতে অনুগ্রহ করে লগইন করুন।</div>;
  }

  // Fetch the user profile and madrasa info
  let profile, error;
  let studentsCount = 0;
  let teachersCount = 0;
  let classesCount = 0;
  let todayPresent = 0;
  let todayAbsent = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  try {
    const response = await withTimeout<any>(
      supabase
        .from("users")
        .select("*, madrasas(name)")
        .eq("id", user.id)
        .single(),
      8000,
      "Fetch user profile"
    );
    profile = response.data;
    error = response.error;

    if (profile?.madrasa_id) {
      const today = new Date().toISOString().split('T')[0];

      const [
        { count: sCount }, 
        { count: tCount },
        { count: cCount },
        { count: presentCount },
        { count: absentCount },
        { data: feesData },
        { data: donationsData },
        { data: expensesData },
        { data: bazarData }
      ] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }).eq("madrasa_id", profile.madrasa_id),
        supabase.from("teachers").select("*", { count: "exact", head: true }).eq("madrasa_id", profile.madrasa_id),
        supabase.from("classes").select("*", { count: "exact", head: true }).eq("madrasa_id", profile.madrasa_id),
        supabase.from("attendance").select("*", { count: "exact", head: true }).eq("madrasa_id", profile.madrasa_id).eq("date", today).eq("status", "Present"),
        supabase.from("attendance").select("*", { count: "exact", head: true }).eq("madrasa_id", profile.madrasa_id).eq("date", today).eq("status", "Absent"),
        supabase.from("fees").select("amount").eq("madrasa_id", profile.madrasa_id),
        supabase.from("donations").select("amount").eq("madrasa_id", profile.madrasa_id),
        supabase.from("expenses").select("amount").eq("madrasa_id", profile.madrasa_id),
        supabase.from("bazar_expenses").select("amount").eq("madrasa_id", profile.madrasa_id)
      ]);

      studentsCount = sCount || 0;
      teachersCount = tCount || 0;
      classesCount = cCount || 0;
      todayPresent = presentCount || 0;
      todayAbsent = absentCount || 0;

      const feesSum = (feesData || []).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
      const donationsSum = (donationsData || []).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
      totalIncome = feesSum + donationsSum;

      const expensesSum = (expensesData || []).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
      const bazarSum = (bazarData || []).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
      totalExpense = expensesSum + bazarSum;
    }
  } catch (err: any) {
    error = { message: err?.message };
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">স্বাগতম, {profile?.full_name || 'এডমিন'}</h2>
        <p className="text-slate-600">
          আপনি <span className="font-semibold text-slate-900">{profile?.madrasas?.name || 'আপনার মাদ্রাসা'}</span>-এ <span className="font-semibold capitalize text-slate-900">{profile?.role?.replace("_", " ") || 'সুপার এডমিন'}</span> হিসেবে লগইন করেছেন।
        </p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 text-sm">
          ডাটাবেস কানেকশন সমস্যা।
          <br/>
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">মোট শিক্ষার্থী</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{studentsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">মোট শিক্ষক</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{teachersCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">সক্রিয় জামাত (ক্লাস)</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{classesCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">আজকের উপস্থিতি (শিক্ষার্থী)</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2 text-emerald-600">{todayPresent}</p>
          <p className="text-sm text-rose-500 mt-1">অনুপস্থিত: {todayAbsent}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm lg:col-span-2">
          <h3 className="text-slate-500 text-sm font-medium">মোট আয়</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">৳ {totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm lg:col-span-2">
          <h3 className="text-slate-500 text-sm font-medium">মোট ব্যয়</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">৳ {totalExpense.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}
