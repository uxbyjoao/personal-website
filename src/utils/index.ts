import jwt from "jsonwebtoken";

/**
 * Format a date to a human readable format
 * @param {Date} date - The date to format
 */
export function formatDate(date: Date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

/**
 * Checks if user is authenticated
 * @param {string} token A JWT token
 * @returns {boolean} Whether the token is valid
 */
export function checkAuth(token: string): boolean {
  let authenticated = false;
  if (token) {
    jwt.verify(token, import.meta.env.CONTENT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        return;
      } else {
        authenticated = decoded.loggedIn;
      }
    });
  }
  return authenticated;
}
