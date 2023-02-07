import { inject } from "@vercel/analytics";

inject({
  mode: import.meta.env.MODE,
  debug: import.meta.env.MODE === "development",
});
