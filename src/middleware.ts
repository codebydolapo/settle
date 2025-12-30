import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk', 
  '/api/graphql',
  '/settler/(.*)' 
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const username = sessionClaims?.metadata?.username; // Assuming you store this in publicMetadata

  // 1. If logged in and trying to access landing page, go to dashboard
  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protect everything that isn't public
  if (!isPublicRoute(request)) {
    if (!userId) {
       return (await auth()).redirectToSignIn();
    }
  }

  return NextResponse.next();
});