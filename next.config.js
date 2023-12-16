/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            bufferutil: 'commonjs bufferutil'
        });

        return config;
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'yt3.googleusercontent.com',
                port: ''
            }
        ]
    }
};

module.exports = nextConfig;
