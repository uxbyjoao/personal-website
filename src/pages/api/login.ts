import jwt from "jsonwebtoken";

export async function post({ request }) {
  const { password } = await request.json();
  return new Response(
    JSON.stringify({ message: "echoing password", password }),
    { status: 200 }
  );
  // if (password === import.meta.env.CONTENT_PASSWORD) {
  //   const token = jwt.sign(
  //     { loggedIn: true },
  //     import.meta.env.CONTENT_PRIVATE_KEY,
  //     {
  //       expiresIn: "24h",
  //     }
  //   );
  //   return new Response(
  //     JSON.stringify({
  //       message: "Login successful!",
  //       token,
  //     }),
  //     {
  //       status: 200,
  //       headers: {
  //         "Set-Cookie": `auth_token=${token}; Path=/projects; HttpOnly`,
  //       },
  //     }
  //   );
  // } else {
  //   return new Response(
  //     JSON.stringify({
  //       message: "Login failed!",
  //     }),
  //     {
  //       status: 401,
  //     }
  //   );
  // }
}
