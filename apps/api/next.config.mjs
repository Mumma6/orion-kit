/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const allowedOrigin = process.env.NODE_ENV === 'production' 
      ? "https://orion-kit-app.vercel.app" 
      : "http://localhost:3001";
    
    return [
      {
        // Apply CORS headers to all routes (API endpoints)
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // IMPORTANT: Must use specific origin when using credentials, not wildcard
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie" },
        ],
      },
    ];
  },
}

export default nextConfig


