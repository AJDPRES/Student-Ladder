export { auth as middleware } from "./src/auth";

export const config = {
  matcher: ["/admin/:path*", "/saved", "/settings", "/employer/:path*"],
};
