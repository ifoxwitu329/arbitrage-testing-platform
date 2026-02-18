'use strict';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        API_URL: 'https://api.example.com',
    },
};

module.exports = nextConfig;
