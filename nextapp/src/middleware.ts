export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/lifts/:path*", "/programs/:path*"],
};
