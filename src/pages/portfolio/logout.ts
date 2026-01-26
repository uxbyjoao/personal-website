import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Clear the auth cookie
  cookies.delete("portfolio_auth", { path: "/" });

  // Redirect to login page
  return redirect("/portfolio/login");
};
