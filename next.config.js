/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
const withPWA = require('next-pwa')({
  dest: 'public',
  customWorkerDir: "src/workers",
})

module.exports = withPWA(nextConfig)
