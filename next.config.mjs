/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Нативный модуль better-sqlite3 не бандлим — грузим из node_modules в рантайме
  serverExternalPackages: ['better-sqlite3'],
  async headers() {
    return [
      {
        source: '/:path*.(mp4|webm|webp|jpg|jpeg|png|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=604800',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
