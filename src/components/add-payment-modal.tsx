"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
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
  
  // Form State
  const [providerName, setProviderName] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [category, setCategory] = useState("BANK");

  const [addPayment, { loading }] = useMutation(ADD_PAYMENT_METHOD, {
    onCompleted: () => {
      toast.success("Payment method added!");
      setOpen(false);
      window.location.reload(); // Refresh to show new data or use Apollo Cache
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add payment method");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in");

    addPayment({
      variables: {
        input: {
          userId: user.id,
          providerName,
          accountDetails,
          category,
          accountName: user.fullName || ""
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Add Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Payment Method</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select onValueChange={setCategory} defaultValue={category}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK">Bank Transfer</SelectItem>
                <SelectItem value="CRYPTO">Crypto Wallet</SelectItem>
                <SelectItem value="EWALLET">E-Wallet (Venmo, CashApp)</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Provider Name</label>
            <Input 
              placeholder="e.g. Chase, Binance (USDT), PayPal" 
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Account Details / Wallet Address</label>
            <Input 
              placeholder="Account number or address" 
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-indigo-600 rounded-xl py-6 font-bold mt-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Method"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}