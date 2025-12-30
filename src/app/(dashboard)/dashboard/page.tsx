import { PaymentMethodList } from "@/components/dashboard/payment-method-list";
import { AddPaymentModal } from "@/components/add-payment-modal";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">My Channels</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-zinc-500 text-sm font-medium">Your public link:</p>
            <Link 
              href={`/settler/${user?.username}`} 
              target="_blank"
              className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1"
            >
              settle.to/{user?.username} <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
        
        {/* The dynamic Modal component */}
        <AddPaymentModal /> 
      </header>

      <section>
        <PaymentMethodList />
      </section>
    </div>
  );
}