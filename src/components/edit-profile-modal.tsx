"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateProfile } from "./update-profile";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface Props {
  user: { name: string | null; bio: string | null };
}

export function EditProfileModal({ user }: Props) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile({ name, bio });
      toast.success("Profile updated!");
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white/90 backdrop-blur text-indigo-600 border border-indigo-100 rounded-full shadow-lg hover:bg-indigo-50">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Tell people how to settle with you..."
              className="rounded-xl resize-none h-32"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-indigo-600 rounded-xl py-6 font-bold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}