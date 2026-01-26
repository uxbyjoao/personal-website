import { defineMiddleware } from "astro:middleware";

const PROTECTED_ROUTES = ["/portfolio"];
const PUBLIC_PORTFOLIO_ROUTES = ["/portfolio/login"];
const COOKIE_NAME = "portfolio_auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicPortfolioRoute = PUBLIC_PORTFOLIO_ROUTES.some(
    (route) => pathname === route
  );

  // If not a protected route or is public portfolio route, continue
  if (!isProtectedRoute || isPublicPortfolioRoute) {
    return next();
  }

  // Check for valid auth cookie
  const authCookie = cookies.get(COOKIE_NAME);

  if (!authCookie) {
    // No cookie, redirect to login
    return redirect(
      `/portfolio/login?redirect=${encodeURIComponent(pathname)}`
    );
  }

  try {
    const sessionData = JSON.parse(authCookie.value);
    const { authenticated, expires } = sessionData;

    // Check if session is valid and not expired
    if (!authenticated || Date.now() > expires) {
      // Invalid or expired session, clear cookie and redirect
      cookies.delete(COOKIE_NAME, { path: "/" });
      return redirect(
        `/portfolio/login?redirect=${encodeURIComponent(pathname)}`
      );
    }

    // Valid session, continue to requested page
    return next();
  } catch {
    // Invalid cookie format, clear and redirect
    cookies.delete(COOKIE_NAME, { path: "/" });
    return redirect(
      `/portfolio/login?redirect=${encodeURIComponent(pathname)}`
    );
  }
});
