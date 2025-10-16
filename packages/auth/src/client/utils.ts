export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Only use cookies - no localStorage for security
  const cookies = document.cookie.split(";");
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("auth=")
  );
  return authCookie ? authCookie.split("=")[1] || null : null;
}
