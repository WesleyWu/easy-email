import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
// @ts-ignore
import path from 'path';
import styleImport from 'vite-plugin-style-import';
import { injectHtml } from 'vite-plugin-html';

export default defineConfig({
  server: {
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      'easy-email-editor/lib/style.css': path.resolve(
        __dirname,
        'package.json'
      ), // 没有用的，只是防止css 404报错
      'easy-email-extensions/lib/style.css': path.resolve(
        __dirname,
        'package.json'
      ), // 没有用的，只是防止css 404报错
      react: path.resolve('./node_modules/react'),
      'react-final-form': path.resolve(
        __dirname,
        './node_modules/react-final-form'
      ),
      '@demo': path.resolve(__dirname, './src'),
      '@extensions': path.resolve('../packages/easy-email-extensions/src'),
      '@core': path.resolve('../packages/easy-email-core/src'),
      '@arco-themes': path.resolve('./node_modules/@arco-themes'),
      '@': path.resolve('../packages/easy-email-editor/src'),
      'easy-email-core': path.resolve(
        '../packages/easy-email-core/src/index.tsx'
      ),
      'easy-email-editor': path.resolve(
        '../packages/easy-email-editor/src/index.tsx'
      ),
      'easy-email-extensions': path.resolve(
        '../packages/easy-email-extensions/src/index.tsx'
      ),
    },
  },

  define: {},
  build: {
    minify: 'terser',
    manifest: true,
    sourcemap: true,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/html2canvas\/.*/.test(id)) {
            return 'html2canvas';
          }
          if (/\/node_modules\/lodash\/.*/.test(id)) {
            return 'lodash';
          }
          if (/\/node_modules\/mjml-browser\/.*/.test(id)) {
            return 'mjml-browser';
          }
          if (/easy-email.*/.test(id)) {
            return 'easy-email-editor';
          }
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'dashes',
    },
    preprocessorOptions: {
      scss: {},
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    styleImport({
      libs: [
        // Dynamic import @arco-design styles
        {
          libraryName: '@arco-design/web-react',
          libraryNameChangeCase: 'pascalCase',
          esModule: true,
          resolveStyle: (name) =>
            `@arco-design/web-react/es/${name}/style/index`,
        },
        {
          libraryName: '@arco-design/web-react/icon',
          libraryNameChangeCase: 'pascalCase',
          resolveStyle: (name) =>
            `@arco-design/web-react/icon/react-icon/${name}`,
          resolveComponent: (name) =>
            `@arco-design/web-react/icon/react-icon/${name}`,
        },
      ],
    }),
    reactRefresh(),

    injectHtml({
      data: {
        analysis:
          process.env.NODE_ENV !== 'development'
            ? `
        <script async type="text/javascript">
        (function (c, l, a, r, i, t, y) {
          c[a] =
            c[a] ||
            function () {
              (c[a].q = c[a].q || []).push(arguments);
            };
          t = l.createElement(r);
          t.async = 1;
          t.src = 'https://www.clarity.ms/tag/' + i;
          y = l.getElementsByTagName(r)[0];
          y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', '85gnvzh5py');
      </script>
      <style>
        a[title='站长统计'] {
          visibility: hidden;
          display: none !important;
        }
      </style>
      <script
        async
        type="text/javascript"
        src="https://s9.cnzz.com/z_stat.php?id=1280025969&web_id=1280025969"
      ></script>

        `
            : '',
        buildTime: `<meta name="updated-time" content="${new Date().toUTCString()}" />`
      },
    }),
  ].filter(Boolean),
});
