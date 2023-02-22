import jwt from "jsonwebtoken";

export async function post({ request }) {
  const body = await request.json();
  const password = body.password;

  // No password provided
  if (!password) {
    return new Response(
      JSON.stringify({
        message: "No password provided!",
      }),
      {
        status: 400,
      }
    );
  }

  // Password is correct
  if (password === import.meta.env.CONTENT_PASSWORD) {
    // const token = jwt.sign(
    //   { loggedIn: true },
    //   import.meta.env.CONTENT_PRIVATE_KEY,
    //   {
    //     expiresIn: "24h",
    //   }
    // );
    return new Response(
      JSON.stringify({
        message: "Login successful!",
        password,
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `auth_token=ABLUBLE; Path=/projects; HttpOnly`,
        },
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        message: "Login failed!",
      }),
      {
        status: 401,
      }
    );
  }
}
