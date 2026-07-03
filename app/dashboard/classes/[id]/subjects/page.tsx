import { createClient } from "@/lib/supabase/server";
import { getSubjects } from "@/app/actions/subjects";
import { getClassSubjects } from "@/app/actions/class_subjects";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AssignSubjectForm from "./AssignSubjectForm";
import RemoveSubjectButton from "./RemoveSubjectButton";

export default async function ClassSubjectsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const classId = params.id;
  const supabase = await createClient();
  
  const { data: cls } = await supabase.from("classes").select("*").eq("id", classId).single();
  const allSubjects = await getSubjects();
  const assignedSubjects = await getClassSubjects(classId);

  // Filter out subjects that are already assigned
  const unassignedSubjects = allSubjects.filter(
    (sub) => !assignedSubjects.some((as) => as.subject_id === sub.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/classes"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Assign Subjects</h1>
          <p className="text-slate-500">Class: {cls?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h2 className="font-semibold text-slate-800">Assigned Subjects</h2>
            </div>
            <div className="p-0">
              {assignedSubjects.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No subjects assigned to this class yet.
                </div>
              ) : (
                <ul className="divide-y">
                  {assignedSubjects.map((item) => (
                    <li key={item.id} className="flex justify-between items-center p-4 hover:bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-800">{item.subjects?.name}</p>
                        <p className="text-sm text-slate-500">{item.subjects?.code}</p>
                      </div>
                      <RemoveSubjectButton classSubjectId={item.id} classId={classId} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-6">
            <h2 className="font-semibold text-slate-800 mb-4">Add Subject</h2>
            <AssignSubjectForm 
              classId={classId} 
              unassignedSubjects={unassignedSubjects} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
