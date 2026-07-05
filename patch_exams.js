const fs = require('fs');
let code = fs.readFileSync('app/actions/exams.ts', 'utf8');

code = code.replace(`  const marksMap = new Map();
  results?.forEach(r => {
    marksMap.set(r.student_id, { marks: r.marks_obtained, total: r.total_marks });
  });

  return students.map(s => ({
    ...s,
    marks_obtained: marksMap.get(s.id)?.marks || '',
    total_marks: marksMap.get(s.id)?.total || 100
  }));
}

export async function saveExamMarks(examId: string, subjectName: string, marksData: { student_id: string, marks_obtained: number, total_marks: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  const finalMadrasaId = await getAuthMadrasaId(supabase, user);
  if (!finalMadrasaId) return { error: "Madrasa not found" };

  const recordsToUpsert = marksData.map(record => ({
    madrasa_id: finalMadrasaId,
    exam_id: examId,
    student_id: record.student_id,
    subject_name: subjectName,
    marks_obtained: record.marks_obtained,
    total_marks: record.total_marks
  }));`, `  const marksMap = new Map();
  results?.forEach(r => {
    marksMap.set(r.student_id, { 
      marks: r.marks_obtained, 
      total: r.total_marks,
      written: r.written_marks,
      oral: r.oral_marks,
      tutorial: r.tutorial_marks,
      attendance: r.attendance_marks
    });
  });

  return students.map(s => ({
    ...s,
    marks_obtained: marksMap.get(s.id)?.marks || '',
    total_marks: marksMap.get(s.id)?.total || 100,
    written_marks: marksMap.get(s.id)?.written || '',
    oral_marks: marksMap.get(s.id)?.oral || '',
    tutorial_marks: marksMap.get(s.id)?.tutorial || '',
    attendance_marks: marksMap.get(s.id)?.attendance || '',
  }));
}

export async function saveExamMarks(examId: string, subjectName: string, marksData: { student_id: string, marks_obtained: number, total_marks: number, written_marks?: number, oral_marks?: number, tutorial_marks?: number, attendance_marks?: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  const finalMadrasaId = await getAuthMadrasaId(supabase, user);
  if (!finalMadrasaId) return { error: "Madrasa not found" };

  const recordsToUpsert = marksData.map(record => ({
    madrasa_id: finalMadrasaId,
    exam_id: examId,
    student_id: record.student_id,
    subject_name: subjectName,
    marks_obtained: record.marks_obtained,
    total_marks: record.total_marks,
    written_marks: record.written_marks || 0,
    oral_marks: record.oral_marks || 0,
    tutorial_marks: record.tutorial_marks || 0,
    attendance_marks: record.attendance_marks || 0
  }));`);

fs.writeFileSync('app/actions/exams.ts', code);
console.log('patched');
