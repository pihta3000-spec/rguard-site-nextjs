/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Нативный модуль better-sqlite3 не бандлим — грузим из node_modules в рантайме
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
