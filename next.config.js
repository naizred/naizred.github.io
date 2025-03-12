module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mocks 'fs' for the client-side bundle
      config.resolve.fallback = {
        fs: false,
        // Add any other node modules that you need to mock
      };
    }
    return config;
  },
};
