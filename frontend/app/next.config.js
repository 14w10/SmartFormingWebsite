/* eslint-disable @typescript-eslint/no-var-requires */
/* tslint:disable:object-literal-sort-keys */
const { compose } = require('ramda');
const BrotliPlugin = require('brotli-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const withTM = require('next-transpile-modules')(['@smar/ui']);

const enhance = compose(withTM, withBundleAnalyzer);

module.exports = enhance({
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  compress: false, // nginx should care about gzip

  webpack(config, { dev, isServer }) {
    if (dev) {
      config.plugins.push(
        new CircularDependencyPlugin({
          cwd: process.cwd(),
          exclude: /node_modules/,
          failOnError: true,
        }),
      );
    }

    // enable client compression
    if (!dev && !isServer) {
      config.plugins.push(new BrotliPlugin({ test: /\.(js|css|html|svg)$/ }));
    }

    config.module.rules.push({
      test: /\.(svg|ico)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: '[name]-[hash].[ext]',
            outputPath: `${isServer ? '../' : ''}static/media/`,
            publicPath: `/_next/static/media/`,
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.tsx$/,
      use: [
        {
          loader: 'astroturf/loader',
          options: { extension: '.module.css' },
        },
      ],
    });

    // bundle styles to single file to avoid sc vs css conflicts
    if (config.optimization.splitChunks.cacheGroups) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss|sass)$/,
        chunks: 'all',
        enforce: true,
      };
    }

    return config;
  },
  async rewrites() {
    if (process.env.PROXY_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.PROXY_URL}/:path*`, // The :path parameter isn't used here so will be automatically passed in the query
        },
      ];
    } else {
      return [];
    }
  },
});
