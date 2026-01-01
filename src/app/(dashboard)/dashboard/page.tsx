import { PaymentMethodList } from "@/components/dashboard/payment-method-list";
import { AddPaymentModal } from "@/components/add-payment-modal";
import { QRCodeModal } from "@/components/dashboard/qr-code-modal";
import { ExternalLink, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
 const userStats = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      paymentMethods: {
        select: { 
          clicks: true 
        }
      }
    }
  });

  console.log(user)

  const totalClicks = userStats?.paymentMethods.reduce((acc, curr) => acc + curr.clicks, 0) || 0;
  const activeChannels = userStats?.paymentMethods.length || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <Link
                href={`/settler/${user?.username}`}
                className="group flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 rounded-full text-sm font-bold text-zinc-600 hover:border-indigo-600 transition-all"
              >
                <span className="text-indigo-600">settle.to/{user?.username}</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <QRCodeModal username={user?.username || ""} />
            </div>
          </div>

          <AddPaymentModal />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Views" value={userStats?.views.toLocaleString() || "0"} />
          <StatCard label="Active Channels" value={activeChannels.toString()} />
          <StatCard label="Total Interactions" value={totalClicks.toLocaleString()} />
        </div>

        <section className="bg-white border border-zinc-100 rounded-[40px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-zinc-900">Your Channels</h2>
          </div>
          <PaymentMethodList />
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-zinc-900">{value}</p>
    </div>
  )
}