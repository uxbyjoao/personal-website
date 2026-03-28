import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("portfolio_auth", { path: "/" });
  return redirect("/portfolio");
};
