import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Clock, MapPin, User, BookOpen } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";
import Link from "next/link";

export default async function RoutinePage({
  searchParams,
}: {
  searchParams: Promise<{ class_id?: string; type?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: classes } = await supabase.from("classes").select("id, name");

  const classId = params?.class_id || (classes?.[0]?.id || "");
  const routineType = params?.type || "Class";

  let routines = [];
  if (classId) {
    const { data } = await supabase
      .from("routines")
      .select("*, classes(name), subjects(name), teachers(first_name, last_name)")
      .eq("class_id", classId)
      .eq("routine_type", routineType)
      .order("start_time", { ascending: true });
    routines = data || [];
  }

  // Group by day_of_week
  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const groupedRoutines = days.reduce((acc, day) => {
    acc[day] = routines.filter(r => r.day_of_week === day);
    return acc;
  }, {} as Record<string, any[]>);

  const dayTranslations: Record<string, string> = {
    Saturday: "শনিবার",
    Sunday: "রবিবার",
    Monday: "সোমবার",
    Tuesday: "মঙ্গলবার",
    Wednesday: "বুধবার",
    Thursday: "বৃহস্পতিবার",
    Friday: "শুক্রবার",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">রুটিন (Routine)</h1>
          <p className="text-slate-500">জামাত ভিত্তিক ক্লাস এবং পরীক্ষার রুটিন</p>
        </div>
        <Link href="/dashboard/academic/routine/builder" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center">
          রুটিন বিল্ডার
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm print:hidden">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">জামাত নির্বাচন করুন</label>
            <select name="class_id" className="w-full p-2 border rounded-md" defaultValue={classId}>
              {classes?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">রুটিনের ধরন</label>
            <select name="type" className="w-full p-2 border rounded-md" defaultValue={routineType}>
              <option value="Class">ক্লাস রুটিন</option>
              <option value="Exam">পরীক্ষার রুটিন</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 transition">
              দেখুন
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4 print:hidden">
           <div>
              <h2 className="text-2xl font-bold text-slate-800">
                 {routineType === 'Class' ? 'ক্লাস রুটিন' : 'পরীক্ষার রুটিন'}
              </h2>
              {classId && (
                 <p className="text-slate-600 font-medium">
                    জামাত: {classes?.find(c => c.id === classId)?.name}
                 </p>
              )}
           </div>
           <PrintButton targetId="printable-routine-content" fileName="routine.pdf" />
        </div>

        <div id="printable-routine-content">
           <div className="hidden print:block mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-slate-800 text-center">
                 {routineType === 'Class' ? 'ক্লাস রুটিন' : 'পরীক্ষার রুটিন'}
              </h2>
              {classId && (
                 <p className="text-slate-600 font-medium text-center">
                    জামাত: {classes?.find(c => c.id === classId)?.name}
                 </p>
              )}
           </div>
        {routines.length > 0 ? (
          <div className="space-y-8">
             {days.map(day => {
                if (groupedRoutines[day].length === 0) return null;
                
                return (
                   <div key={day} className="mb-6">
                      <h3 className="text-lg font-bold text-slate-700 mb-3 bg-slate-100 p-2 rounded-md border-l-4 border-slate-500">
                         {dayTranslations[day]}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                         {groupedRoutines[day].map(routine => (
                            <div key={routine.id} className="border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-400 transition bg-white">
                               <div className="flex items-center space-x-2 text-indigo-600 font-semibold mb-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{routine.start_time.slice(0, 5)} - {routine.end_time.slice(0, 5)}</span>
                               </div>
                               
                               <div className="space-y-2 text-sm">
                                  <div className="flex items-start space-x-2">
                                     <BookOpen className="w-4 h-4 text-slate-400 mt-0.5" />
                                     <span className="font-medium text-slate-800">{routine.subjects?.name || 'Subject Not Set'}</span>
                                  </div>
                                  
                                  <div className="flex items-start space-x-2">
                                     <User className="w-4 h-4 text-slate-400 mt-0.5" />
                                     <span className="text-slate-600">{routine.teachers ? `${routine.teachers.first_name} ${routine.teachers.last_name}` : 'Teacher Not Assigned'}</span>
                                  </div>
                                  
                                  {routine.room_number && (
                                     <div className="flex items-start space-x-2">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <span className="text-slate-600">রুম: {routine.room_number}</span>
                                     </div>
                                  )}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )
             })}
          </div>
        ) : (
           <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">এই জামাতের জন্য কোনো রুটিন পাওয়া যায়নি</p>
           </div>
        )}
        </div>
      </div>
    </div>
  );
}
