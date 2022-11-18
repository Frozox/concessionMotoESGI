/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    POSTGRES_CON_STRING: process.env.POSTGRES_CON_STRING,
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
  }
}

module.exports = nextConfig
