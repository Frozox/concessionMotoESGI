/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    POSTGRES_CON_STRING: process.env.POSTGRES_CON_STRING
  }
}

module.exports = nextConfig
