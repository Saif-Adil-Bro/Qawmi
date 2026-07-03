import { getClasses } from "@/app/actions/classes";
import Link from "next/link";
import { Plus } from "lucide-react";
import ClassActions from "./ClassActions";

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Classes (জামাত)</h1>
        <Link
          href="/dashboard/classes/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-4 font-medium text-slate-600 text-sm">Name</th>
                <th className="p-4 font-medium text-slate-600 text-sm">Description</th>
                <th className="p-4 font-medium text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classes?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No classes found. Add your first class.
                  </td>
                </tr>
              ) : (
                classes?.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-800 font-medium">{cls.name}</td>
                    <td className="p-4 text-slate-600">{cls.description || "-"}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Link 
                        href={`/dashboard/classes/${cls.id}/subjects`}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors"
                      >
                        Assign Subjects
                      </Link>
                      <ClassActions classId={cls.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
