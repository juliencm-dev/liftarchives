/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

const nextConfig = {
  ...withPWA({
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
    },
  }),
  output: "standalone",
};

export default nextConfig;
