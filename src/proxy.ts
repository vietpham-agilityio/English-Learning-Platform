import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Constants
import { ROUTES } from './constants/route';

const isPublicRoute = createRouteMatcher([ROUTES.HOME, '/api/webhooks(.*)']);

function redirectToPathname(
  request: NextRequest,
  pathname: string,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const { userId } = await auth();
  const isAuthenticated = !!userId;

  if (request.nextUrl.pathname === ROUTES.HOME && isAuthenticated) {
    return redirectToPathname(request, ROUTES.COURSES);
  }

  if (request.nextUrl.pathname === ROUTES.COURSES && !isAuthenticated) {
    return redirectToPathname(request, ROUTES.HOME);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
