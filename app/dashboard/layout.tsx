import { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { LayoutDashboard, Users, BookOpen, LogOut, Settings, CheckSquare, Wallet, Utensils, Library, HeartHandshake, MessageSquare, Award, CalendarDays, IdCard, GraduationCap } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 print:bg-white print:h-auto">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col overflow-y-auto print:hidden">
        <div className="p-6 border-b border-slate-800 shrink-0">
          <h2 className="text-2xl font-bold text-white tracking-tight">QawmiERP</h2>
          <p className="text-xs text-slate-500 mt-1">মাদ্রাসা ম্যানেজমেন্ট</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <LayoutDashboard className="w-5 h-5" />
            <span>ড্যাশবোর্ড</span>
          </Link>
          <Link href="/dashboard/students" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Users className="w-5 h-5" />
            <span>শিক্ষার্থী</span>
          </Link>
          <Link href="/dashboard/teachers" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Users className="w-5 h-5" />
            <span>শিক্ষক ও স্টাফ</span>
          </Link>
          <Link href="/dashboard/attendance" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <CheckSquare className="w-5 h-5" />
            <span>হাজিরা</span>
          </Link>
          <Link href="/dashboard/classes" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <BookOpen className="w-5 h-5" />
            <span>জামাত (Classes)</span>
          </Link>
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">একাডেমিক</p>
          </div>
          <Link href="/dashboard/hifz" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <BookOpen className="w-5 h-5" />
            <span>হিফজ ট্র্যাকিং</span>
          </Link>
          <Link href="/dashboard/academic/routine" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <CalendarDays className="w-5 h-5" />
            <span>রুটিন (Routine)</span>
          </Link>
          <Link href="/dashboard/academic/certificates" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Award className="w-5 h-5" />
            <span>সনদ ও মার্কশিট</span>
          </Link>
          <Link href="/dashboard/academic/id-cards" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <IdCard className="w-5 h-5" />
            <span>আইডি কার্ড</span>
          </Link>
          <Link href="/dashboard/kitab" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <BookOpen className="w-5 h-5" />
            <span>কিতাব ট্র্যাকিং</span>
          </Link>
          <Link href="/dashboard/exams" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <BookOpen className="w-5 h-5" />
            <span>পরীক্ষা ও ফলাফল</span>
          </Link>

          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">অফিস ও ব্যবস্থাপনা</p>
          </div>
          <Link href="/dashboard/communication" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <MessageSquare className="w-5 h-5" />
            <span>যোগাযোগ ও নোটিশ</span>
          </Link>
          <Link href="/dashboard/accounting" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Wallet className="w-5 h-5" />
            <span>অর্থ ও ফি (Finance)</span>
          </Link>
          <Link href="/dashboard/zakat" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <HeartHandshake className="w-5 h-5" />
            <span>যাকাত ও অনুদান</span>
          </Link>
          <Link href="/dashboard/boarding" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Utensils className="w-5 h-5" />
            <span>বোর্ডিং ও মিল</span>
          </Link>
          <Link href="/dashboard/library" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Library className="w-5 h-5" />
            <span>কুতুবখানা (Library)</span>
          </Link>
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">সিস্টেম</p>
          </div>
          <Link href="/portal" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Users className="w-5 h-5" />
            <span>প্যারেন্ট পোর্টাল (Parent Portal)</span>
          </Link>
          <Link href="/teacher-portal" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <GraduationCap className="w-5 h-5" />
            <span>শিক্ষক পোর্টাল (Teacher Portal)</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition">
            <Settings className="w-5 h-5" />
            <span>সেটিংস</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 shrink-0">
          <form action={logout}>
            <button type="submit" className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md hover:bg-slate-800 text-red-400 hover:text-red-300 transition">
              <LogOut className="w-5 h-5" />
              <span>লগআউট</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 print:hidden">
          <h1 className="text-lg font-medium text-slate-800">এডমিন পোর্টাল</h1>
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
