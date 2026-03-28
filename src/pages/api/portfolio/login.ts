import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirect")?.toString() || "/portfolio";

  if (password !== import.meta.env.PORTFOLIO_PASSWORD) {
    return new Response(JSON.stringify({ error: "Incorrect password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Set auth cookie — 24 hours
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  cookies.set("portfolio_auth", JSON.stringify({ authenticated: true, expires }), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return new Response(JSON.stringify({ success: true, redirect: redirectTo }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
