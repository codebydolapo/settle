"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Banknote, Wallet, Globe, PlusCircle } from "lucide-react";
import { toast } from "sonner";

const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($input: AddPaymentInput!) {
    addPaymentMethod(input: $input) {
      id
      providerName
      accountDetails
      category
    }
  }
`;

export function AddPaymentModal() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  
  const [providerName, setProviderName] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [category, setCategory] = useState("BANK");

  const [addPayment, { loading }] = useMutation(ADD_PAYMENT_METHOD, {
    onCompleted: () => {
      toast.success("Payment method added!");
      setOpen(false);
      window.location.reload(); 
    },
    onError: (error) => toast.error(error.message)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addPayment({
      variables: {
        input: {
          userId: user.id,
          providerName,
          accountDetails,
          category,
          accountName: user.fullName || user.username || ""
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-800 text-white rounded-2xl px-2 py-2 h-auto font-bold shadow-xl shadow-zinc-200 transition-all active:scale-95 flex gap-2">
          <PlusCircle className="w-5 h-5" />
          Add New Channel
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[560px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Add Channel</DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              Create a new way for people to pay you.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Type</label>
              <Select onValueChange={setCategory} defaultValue={category}>
                <SelectTrigger className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-bold focus:ring-indigo-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                  <SelectItem value="BANK" className="py-3 font-medium">
                    <div className="flex items-center gap-2"><Banknote className="w-4 h-4 text-emerald-500" /> Bank Transfer</div>
                  </SelectItem>
                  <SelectItem value="CRYPTO" className="py-3 font-medium">
                    <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-orange-500" /> Crypto Wallet</div>
                  </SelectItem>
                  <SelectItem value="EWALLET" className="py-3 font-medium">
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> E-Wallet / Link</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Provider Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Provider</label>
              <Input 
                placeholder="e.g. Mercury Bank, Polygon (USDC)" 
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium focus-visible:ring-indigo-500"
                required
              />
            </div>

            {/* Details Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Account Info</label>
              <Input 
                placeholder="Account number or wallet address" 
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-mono text-sm focus-visible:ring-indigo-500"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirm & Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}