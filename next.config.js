/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com', 'source.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },
    // Suppress Leaflet CSS warnings
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
        };
        return config;
    },
};

module.exports = nextConfig;
