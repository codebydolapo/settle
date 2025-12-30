import { auth } from "@clerk/nextjs/server";
import fetchUser from "../../../../server/fetchUser";
import { Edit, Wallet, Banknote, Globe, ShieldCheck, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { ShareButton } from "@/components/share-button";
import Image from "next/image";
import ProfileClient from "@/components/profile-client";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await fetchUser(username);
  const { userId } = await auth();

  // Handle the "Not Found" state on the server for better SEO
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-zinc-500">The link you followed might be broken.</p>
      </div>
    );
  }

  const isOwner = userId === user.id;

  // Pass the server data into your animated Client Component
  return <ProfileClient user={user} isOwner={isOwner} />
}