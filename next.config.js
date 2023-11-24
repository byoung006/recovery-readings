/** @type {import('next').NextConfig} */
const AA_API_URL = process.env.AA_API_URL
const TWENTY_FOUR_HRS_API_URL = process.env.TWENTY_FOUR_HRS_API_URL
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/aa/api/:path*',
        destination: `${AA_API_URL }/:path*`,
      },
      {
        source: '/24hrs/api/:path*',
        destination: `${TWENTY_FOUR_HRS_API_URL}/:path*`
      }
    ]
  },
}

module.exports = nextConfig
