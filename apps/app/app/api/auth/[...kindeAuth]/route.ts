import { handleAuth } from "@workspace/auth/server";

export const GET = handleAuth({
  signIn: "/sign-in",
  signUp: "/sign-up",
});
