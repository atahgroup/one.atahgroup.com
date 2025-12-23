import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://fastly.picsum.photos/id/444/200/200.jpg?hmac=j2rJG0CKjM3Pmd7gDrCI5-1pYZIh4tjiScLDa5xS_KU"
      ),
    ],
  },
};

export default nextConfig;
