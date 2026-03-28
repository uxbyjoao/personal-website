import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /portfolio routes (except request-access)
  if (!pathname.startsWith("/portfolio")) return next();
  if (pathname === "/portfolio/request-access") return next();

  // Check auth cookie
  const cookie = context.cookies.get("portfolio_auth");
  if (cookie) {
    try {
      const data = JSON.parse(cookie.value);
      if (data.authenticated && data.expires > Date.now()) {
        return next();
      }
    } catch {
      // Invalid cookie, fall through to redirect
    }
  }

  // Not authenticated — if already on /portfolio (login page), let it render
  if (pathname === "/portfolio" || pathname === "/portfolio/") {
    return next();
  }

  // Redirect to login with return URL
  const redirect = encodeURIComponent(pathname);
  return context.redirect(`/portfolio?redirect=${redirect}`);
});
