import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk', 
  '/onboarding',
  '/settler/(.*)' 
]);

export default clerkMiddleware(async (auth, request) => {
  const authObj = await auth();
  const { userId, sessionClaims } = authObj;
  
  const username = sessionClaims?.metadata?.username;
  const { pathname } = request.nextUrl;

  // 1. If logged in but NO username, force them to onboarding
  if (userId && !username && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // 2. If logged in AND has username, prevent landing page access
  if (userId && username && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. Protect non-public routes
  if (!isPublicRoute(request) && !userId) {
    return authObj.redirectToSignIn();
  }

  return NextResponse.next();
});