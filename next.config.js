/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        return config;
        },
    // the API serves /account/ with the trailing slash, so leave proxied paths
    // alone instead of bouncing them through a redirect
    skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
