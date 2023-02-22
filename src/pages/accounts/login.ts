import jwt from "jsonwebtoken";

export async function post({ request }) {
  return {
    body: JSON.stringify({ hello: "world" }),
  };
  // const { password } = await request.json();
  // if (password === import.meta.env.CONTENT_PASSWORD) {
  //   jwt.sign(
  //     { loggedIn: true },
  //     import.meta.env.CONTENT_PRIVATE_KEY,
  //     {
  //       expiresIn: "24h",
  //     },
  //     (err, token) => {
  //       return new Response(
  //         JSON.stringify({
  //           message: "Login successful!",
  //           token,
  //         }),
  //         {
  //           status: 200,
  //           headers: {
  //             "Set-Cookie": `auth_token=${token}; Path=/projects; HttpOnly`,
  //           },
  //         }
  //       );
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
