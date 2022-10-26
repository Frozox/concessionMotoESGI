/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    POSTGRES_USER: 'root',
    POSTGRES_PASSWORD: 'root',
    POSTGRES_DB: 'concession-moto-egsi',
    POSTGRES_CON_STRING: 'postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5432/${POSTGRES_DB}'
  }
}

module.exports = nextConfig
