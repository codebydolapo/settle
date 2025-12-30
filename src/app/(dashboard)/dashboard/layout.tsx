import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, CreditCard, UserCircle, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Payment Methods", icon: CreditCard, href: "/dashboard/payments" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/stats" },
    { label: "Profile", icon: UserCircle, href: "/dashboard/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-black text-xl tracking-tighter">SETTLE.</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-medium group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
          <UserButton showName />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}