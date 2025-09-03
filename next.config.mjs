/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dog-shelter-api-66zi.onrender.com', pathname: '/**' },
      { protocol: 'http',  hostname: 'localhost', port: '3001', pathname: '/**' }, // локальний бек
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },      // <- додали Pexels
    ],
  },

};
export default nextConfig;
