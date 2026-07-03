"use client";

import { useState } from "react";
import { assignSubjectToClass } from "@/app/actions/class_subjects";

export default function AssignSubjectForm({ classId, unassignedSubjects }: { classId: string, unassignedSubjects: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const subjectId = formData.get("subject_id") as string;
    
    if (!subjectId) {
      setError("Please select a subject");
      setIsPending(false);
      return;
    }

    const res = await assignSubjectToClass(classId, subjectId);
    if (res.error) {
      setError(res.error);
    }
    
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {unassignedSubjects.length === 0 ? (
        <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border">
          All available subjects have been assigned to this class.
        </p>
      ) : (
        <>
          <select
            name="subject_id"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            defaultValue=""
            required
          >
            <option value="" disabled>Select a subject...</option>
            {unassignedSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name} {sub.code ? `(${sub.code})` : ""}
              </option>
            ))}
          </select>
          
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isPending ? "Assigning..." : "Assign Subject"}
          </button>
        </>
      )}
    </form>
  );
}
