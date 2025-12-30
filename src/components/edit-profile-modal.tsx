"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounce } from "../../hooks/use-debounce";

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateProfileInput!) {
    updateUser(input: $input) {
      id
      username
      name
      bio
    }
  }
`;

const CHECK_USERNAME = gql`
  query CheckUsername($username: String!) {
    checkUsername(username: $username)
  }
`;

export function EditProfileModal({ user }: { user: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");

  const debouncedUsername = useDebounce(username, 500);

  // Username availability check
  const [checkUsername, { data: checkData, loading: checking }] = useLazyQuery(CHECK_USERNAME);

  useEffect(() => {
    if (debouncedUsername && debouncedUsername !== user.username) {
      checkUsername({ variables: { username: debouncedUsername } });
    }
  }, [debouncedUsername, user.username, checkUsername]);

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      toast.success("Profile updated!");
      setOpen(false);
      // If username changed, redirect to new URL
      if (data.updateUser.username !== user.username) {
        router.push(`/settler/${data.updateUser.username}`);
      } else {
        router.refresh();
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const isAvailable = username === user.username || checkData?.checkUsername;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="rounded-full bg-white/50 backdrop-blur-sm border-indigo-100 text-indigo-600 font-bold hover:bg-white hover:border-indigo-600 transition-all">
          Edit Profile
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-zinc-950/20 backdrop-blur-md z-[100]" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-white rounded-[32px] p-10 shadow-2xl z-[101] focus:outline-none">
          <Dialog.Title className="text-3xl font-black text-zinc-900 mb-8 tracking-tight">Edit Profile</Dialog.Title>

          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            if (!isAvailable) return;
            updateUser({ variables: { input: { name, bio, username } } });
          }}>

            {/* Username Field */}
            <div>
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative mt-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  className={`w-full p-4 bg-zinc-50 border-2 rounded-2xl outline-none transition-all font-bold ${username === user.username ? "border-zinc-100" :
                      isAvailable ? "border-emerald-100 focus:border-emerald-500" : "border-red-100 focus:border-red-500"
                    }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {checking ? <Loader2 className="w-5 h-5 animate-spin text-zinc-400" /> :
                    username !== user.username && (
                      isAvailable ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                </div>
              </div>
              {username !== user.username && !isAvailable && !checking && (
                <p className="text-red-500 text-xs mt-2 font-bold ml-1">This username is already taken.</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Display Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell people how to settle with you..."
                className="w-full mt-2 p-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-medium resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={updating || !isAvailable}
              className="w-full py-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-zinc-200"
            >
              {updating ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}