/* eslint-disable @typescript-eslint/no-var-requires */
/* tslint:disable:object-literal-sort-keys */
const { compose } = require('ramda');
const BrotliPlugin = require('brotli-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withTM = require('next-transpile-modules')(['@smar/ui']);

const enhance = compose(withTM, withBundleAnalyzer);

console.log('env!', process.env.NEXT_PUBLIC_APP_URL);

module.exports = enhance({
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // compress: false, // nginx should care about gzip

  // experimental: { modern: true },

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

    // responsive images
    config.module.rules.push({
      test: /\.(jpe?g|png)$/i,
      loader: 'responsive-loader',
      options: {
        adapter: require('responsive-loader/sharp'),
        disable: process.env.NODE_ENV !== 'production',
        esModule: false,
        outputPath: `${isServer ? '../' : ''}static/media/`,
        publicPath: `/_next/static/media/`,
        quality: 92,
      },
    });

    return config;
  },
});
