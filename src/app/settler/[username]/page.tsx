//app/settler/[username]/page.tsx
import { auth } from "@clerk/nextjs/server";
import fetchUser from "../../../../server/fetchUser";
import ProfileClient from "@/components/profile-client";
import { incrementProfileViews } from "../../../../server/analytics";

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

  incrementProfileViews(username);

  const isOwner = userId === user.id;

  // Pass the server data into your animated Client Component
  return <ProfileClient user={user} isOwner={isOwner} />
}