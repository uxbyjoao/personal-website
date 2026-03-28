import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  if (!name || !email) {
    return new Response(JSON.stringify({ error: "Name and email required" }), { status: 400 });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const contactEmail = import.meta.env.CONTACT_EMAIL;

  if (apiKey && contactEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <noreply@uxbyjoao.me>",
          to: contactEmail,
          subject: `Portfolio access request from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message || "(none)"}`,
        }),
      });
    } catch (err) {
      console.error("[Contact] Failed to send email:", err);
    }
  } else {
    console.log("[Contact Request]", { name, email, message });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
