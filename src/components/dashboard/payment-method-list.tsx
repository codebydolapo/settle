"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Trash2, Banknote, Wallet, Globe, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const GET_MY_PAYMENTS = gql`
  query GetMyPayments {
    me {
      paymentMethods {
        id
        providerName
        accountDetails
        category
      }
    }
  }
`;

const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: ID!) {
    deletePaymentMethod(id: $id)
  }
`;

export function PaymentMethodList() {
  const { data, loading, error } = useQuery(GET_MY_PAYMENTS);
  const [deletePayment] = useMutation(DELETE_PAYMENT, {
    refetchQueries: [{ query: GET_MY_PAYMENTS }],
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePayment({ variables: { id } });
      toast.success("Payment method removed");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;
  if (error) return <p className="text-red-500">Error loading payments.</p>;

  const methods = data?.me?.paymentMethods || [];

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {methods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center"
          >
            <p className="text-zinc-500 mb-4">No payment channels added yet.</p>
            <Button variant="outline" className="rounded-xl">Add your first one</Button>
          </motion.div>
        ) : (
          methods.map((method: any) => (
            <motion.div
              key={method.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white border border-zinc-200 p-5 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {method.category === 'BANK' && <Banknote className="w-5 h-5" />}
                  {method.category === 'CRYPTO' && <Wallet className="w-5 h-5" />}
                  {(method.category === 'EWALLET' || method.category === 'OTHER') && <Globe className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{method.providerName}</h4>
                  <p className="text-sm text-zinc-500 font-mono">{method.accountDetails}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(method.id)}
                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}