/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
            default-src 'self';
            script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.sandbox.midtrans.com;
            connect-src 'self' https://app.sandbox.midtrans.com;
            frame-src https://app.sandbox.midtrans.com;
            img-src 'self' data:;
            style-src 'self' 'unsafe-inline';
            font-src 'self';
          `.replace(/\n/g, " "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
