/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "tailwindui.com",
        protocol: "https",
      },
      {
        hostname: "i.scdn.co",
        protocol: "https",
      },
      {
        hostname: "image-cdn-ak.spotifycdn.com",
        protocol: "https",
      },
      {
        hostname: "*.spotifycdn.com",
        protocol: "https",
      },
    ],
  },
};

export default config;
