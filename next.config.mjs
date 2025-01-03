/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qfbrqgdzhcnvmqggsbsw.supabase.co',
        pathname: '/**', // Permitir cualquier ruta
      },
    ],
  },
  transpilePackages: ['swiper', 'ssr-window', 'dom7'],
};
  
  export default nextConfig;