const path = require('path');

module.exports = {
  title: 'UPE Program - Component Documentation',
  components: 'src/components/ui/**/*.{js,jsx,ts,tsx}',
  ignore: [
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.stories.{js,jsx,ts,tsx}',
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
  },
  styles: {
    StyleGuide: {
      '@global body': {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ].join(','),
      },
    },
  },
  theme: {
    color: {
      base: '#0a0a0a',
      light: '#767676',
      lightest: '#ccc',
      link: '#3b82f6',
      linkHover: '#2563eb',
      focus: 'rgba(59, 130, 246, .25)',
      border: '#e5e7eb',
      name: '#16a34a',
      type: '#dc2626',
      error: '#dc2626',
      baseBackground: '#ffffff',
      codeBackground: '#f9fafb',
      sidebarBackground: '#f9fafb',
      ribbonBackground: '#3b82f6',
      ribbonText: '#ffffff',
    },
    fontFamily: {
      base: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      monospace: ['Consolas', '"Monaco"', '"Courier New"', 'monospace'].join(','),
    },
  },
  sections: [
    {
      name: 'Introducción',
      content: 'docs/introduction.md',
    },
    {
      name: 'Componentes UI',
      components: 'src/components/ui/**/*.{jsx,tsx}',
      exampleMode: 'expand',
      usageMode: 'expand',
    },
  ],
  styleguideDir: 'styleguide-build',
  assetsDir: 'public',
  pagePerSection: true,
  require: [path.join(__dirname, 'src/index.css')],
  template: {
    head: {
      links: [
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
};
