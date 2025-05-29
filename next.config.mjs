// تنظیمات Next.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // این گزینه در نسخه فعلی Next.js شما باعث خطا می‌شود.
  allowedDevOrigins: ['http://localhost:3000', 'http://172.27.97.86:3000'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: 'process/browser',
      };
    }
    return config;
  },
};

export default nextConfig;
