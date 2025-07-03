import { DefaultTheme, defineConfig } from 'vitepress';
import typedocSidebar from '../api/reference/typedoc-sidebar.json';
import {
  menuGroup,
  menuItem,
  menuRoot,
  navItem,
  prepareTypedocSidebar,
} from './utils/menus';
import { meta, script } from './utils/head';
import footnote from 'markdown-it-footnote';
import { version as wxtVersion } from '../../packages/wxt/package.json';
import { version as i18nVersion } from '../../packages/i18n/package.json';
import { version as autoIconsVersion } from '../../packages/auto-icons/package.json';
import { version as unocssVersion } from '../../packages/unocss/package.json';
import { version as storageVersion } from '../../packages/storage/package.json';
import { version as analyticsVersion } from '../../packages/analytics/package.json';
import { version as runnerVersion } from '../../packages/runner/package.json';
import addKnowledge from 'vitepress-knowledge';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader,
} from 'vitepress-plugin-group-icons';
import { Feed } from 'feed';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const origin = 'https://wxt.dev';

const title = 'Next-gen Web Extension Framework';
const titleSuffix = ' – WXT';
const description =
  "WXT provides the best developer experience, making it quick, easy, and fun to develop web extensions. With built-in utilities for building, zipping, and publishing your extension, it's easy to get started.";
const ogTitle = `${title}${titleSuffix}`;
const ogUrl = origin;
const ogImage = `${origin}/social-preview.png`;

const otherPackages = {
  analytics: analyticsVersion,
  'auto-icons': autoIconsVersion,
  i18n: i18nVersion,
  storage: storageVersion,
  unocss: unocssVersion,
  runner: runnerVersion,
};

const knowledge = addKnowledge<DefaultTheme.Config>({
  serverUrl: 'https://knowledge.wxt.dev',
  paths: {
    '/': 'docs',
    '/api/': 'api-reference',
    '/blog/': 'blog',
  },
  layoutSelectors: {
    blog: '.container-content',
  },
  pageSelectors: {
    'examples.md': '#VPContent > .VPPage',
    'blog.md': '#VPContent > .VPPage',
  },
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: knowledge,
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh',
      link: '/zh',
      themeConfig: {
        nav: [
          navItem('指南', '/zh/guide/installation'),
          navItem('案例', '/examples'),
          navItem('API', '/api/reference/wxt'),
          navItem('博客', '/blog'),
          navItem(`v${wxtVersion}`, [
            navItem('wxt', [
              navItem(`v${wxtVersion}`, '/'),
              navItem(
                `Changelog`,
                'https://github.com/wxt-dev/wxt/blob/main/packages/wxt/CHANGELOG.md',
              ),
            ]),
            navItem(
              'Other Packages',
              Object.entries(otherPackages).map(([name, version]) =>
                navItem(`@wxt-dev/${name} — ${version}`, `/${name}`),
              ),
            ),
          ]),
        ],

        sidebar: {
          '/zh/guide/': menuRoot([
            menuGroup('快速上手', '/zh/guide/', [
              menuItem('介绍', 'introduction.md'),
              menuItem('安装', 'installation.md'),
            ]),
            menuGroup('功能要点', '/zh/guide/essentials/', [
              menuItem('项目结构', 'project-structure.md'),
              menuItem('入口点', 'entrypoints.md'),
              menuGroup(
                '配置',
                '/zh/guide/essentials/config/',
                [
                  menuItem('Manifest', 'manifest.md'),
                  menuItem('启动浏览器', 'browser-startup.md'),
                  menuItem('自动导包', 'auto-imports.md'),
                  menuItem('环境变量', 'environment-variables.md'),
                  menuItem('运行时配置', 'runtime.md'),
                  menuItem('Vite', 'vite.md'),
                  menuItem('构建模式', 'build-mode.md'),
                  menuItem('TypeScript', 'typescript.md'),
                  menuItem('Hooks', 'hooks.md'),
                  menuItem('入口加载器', 'entrypoint-loaders.md'),
                ],
                true,
              ),
              menuItem('扩展API', 'extension-apis.md'),
              menuItem('资源', 'assets.md'),
              menuItem('兼容多浏览器', 'target-different-browsers.md'),
              menuItem('内容脚本', 'content-scripts.md'),
              menuItem('Storage', 'storage.md'),
              menuItem('消息通信', 'messaging.md'),
              menuItem('国际化', 'i18n.md'),
              menuItem('脚本注入', 'scripting.md'),
              menuItem('WXT模块', 'wxt-modules.md'),
              menuItem('前端框架', 'frontend-frameworks.md'),
              menuItem('ES Modules', 'es-modules.md'),
              menuItem('远程代码', 'remote-code.md'),
              menuItem('单元测试', 'unit-testing.md'),
              menuItem('E2E Testing', 'e2e-testing.md'),
              menuItem('发布', 'publishing.md'),
              menuItem('Testing Updates', 'testing-updates.md'),
            ]),
            menuGroup('资源', '/zh/guide/resources/', [
              menuItem('对比', 'compare.md'),
              menuItem('常见问题', 'faq.md'),
              menuItem('社区', 'community.md'),
              menuItem('升级WXT', 'upgrading.md'),
              menuItem('迁移到WXT', 'migrate.md'),
              menuItem('WXT工作原理', 'how-wxt-works.md'),
            ]),
          ]),
          '/api/': menuRoot([
            menuGroup(
              'CLI Reference',
              '/api/cli/',
              [
                menuItem('wxt', 'wxt.md'),
                menuItem('wxt build', 'wxt-build.md'),
                menuItem('wxt zip', 'wxt-zip.md'),
                menuItem('wxt prepare', 'wxt-prepare.md'),
                menuItem('wxt clean', 'wxt-clean.md'),
                menuItem('wxt init', 'wxt-init.md'),
                menuItem('wxt submit', 'wxt-submit.md'),
                menuItem('wxt submit init', 'wxt-submit-init.md'),
              ],
              true,
            ),
            menuGroup(
              'API Reference',
              prepareTypedocSidebar(typedocSidebar),
              true,
            ),
          ]),
        },
      },
    },
    root: {
      label: 'English',
      lang: 'en',
    },
  },
  rewrites: {
    'zh/index.md': 'index.md',
    'zh/guide/:slug*': 'guide/:slug*',
  },
  titleTemplate: `:title${titleSuffix}`,
  title: 'WXT',
  description,
  vite: {
    clearScreen: false,
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          'wxt.config.ts': localIconLoader(
            import.meta.url,
            '../public/logo.svg',
          ),
        },
      }),
    ],
  },
  lastUpdated: true,
  sitemap: {
    hostname: origin,
  },

  async buildEnd(site) {
    // @ts-expect-error: knowledge.buildEnd is not typed, but it exists.
    await knowledge.buildEnd(site);

    // Only construct the RSS document for production builds
    const { default: blogDataLoader } = await import('./loaders/blog.data');
    const posts = await blogDataLoader.load();
    const feed = new Feed({
      copyright: 'MIT',
      id: 'wxt',
      title: 'WXT Blog',
      link: `${origin}/blog`,
    });
    posts.forEach((post) => {
      feed.addItem({
        date: post.frontmatter.date,
        link: new URL(post.url, origin).href,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
      });
    });
    // console.log('rss.xml:');
    // console.log(feed.rss2());
    await writeFile(join(site.outDir, 'rss.xml'), feed.rss2(), 'utf8');
  },

  head: [
    meta('og:type', 'website'),
    meta('og:title', ogTitle),
    meta('og:image', ogImage),
    meta('og:url', ogUrl),
    meta('og:description', description),
    meta('twitter:card', 'summary_large_image', { useName: true }),
    script('https://umami.aklinker1.io/script.js', {
      'data-website-id': 'c1840c18-a12c-4a45-a848-55ae85ef7915',
      async: '',
    }),
  ],

  markdown: {
    config: (md) => {
      md.use(footnote);
      md.use(groupIconMdPlugin);
    },
    languageAlias: {
      mjs: 'js',
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/logo.svg',
      alt: 'WXT logo',
    },

    footer: {
      message: [
        '<a class="light-netlify" href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" style="display: inline;" /></a>',
        '<a class="dark-netlify" href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" alt="Deploys by Netlify" style="display: inline;" /></a>',
        'Released under the <a href="https://github.com/wxt-dev/wxt/blob/main/LICENSE">MIT License</a>.',
      ].join('<br/>'),
      copyright:
        'Copyright © 2023-present <a href="https://github.com/aklinker1">Aaron Klinker</a>',
    },

    editLink: {
      pattern: 'https://github.com/wxt-dev/wxt/edit/main/docs/:path',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/ZFsZqGery9' },
      { icon: 'github', link: 'https://github.com/wxt-dev/wxt' },
    ],

    nav: [
      navItem('Guide', '/guide/installation'),
      navItem('Examples', '/examples'),
      navItem('API', '/api/reference/wxt'),
      navItem('Blog', '/blog'),
      navItem(`v${wxtVersion}`, [
        navItem('wxt', [
          navItem(`v${wxtVersion}`, '/'),
          navItem(
            `Changelog`,
            'https://github.com/wxt-dev/wxt/blob/main/packages/wxt/CHANGELOG.md',
          ),
        ]),
        navItem(
          'Other Packages',
          Object.entries(otherPackages).map(([name, version]) =>
            navItem(`@wxt-dev/${name} — ${version}`, `/${name}`),
          ),
        ),
      ]),
    ],

    sidebar: {
      '/guide/': menuRoot([
        menuGroup('Get Started', '/guide/', [
          menuItem('Introduction', 'introduction.md'),
          menuItem('Installation', 'installation.md'),
        ]),
        menuGroup('Essentials', '/guide/essentials/', [
          menuItem('Project Structure', 'project-structure.md'),
          menuItem('Entrypoints', 'entrypoints.md'),
          menuGroup(
            'Configuration',
            '/guide/essentials/config/',
            [
              menuItem('Manifest', 'manifest.md'),
              menuItem('Browser Startup', 'browser-startup.md'),
              menuItem('Auto-imports', 'auto-imports.md'),
              menuItem('Environment Variables', 'environment-variables.md'),
              menuItem('Runtime Config', 'runtime.md'),
              menuItem('Vite', 'vite.md'),
              menuItem('Build Mode', 'build-mode.md'),
              menuItem('TypeScript', 'typescript.md'),
              menuItem('Hooks', 'hooks.md'),
              menuItem('Entrypoint Loaders', 'entrypoint-loaders.md'),
            ],
            true,
          ),
          menuItem('Extension APIs', 'extension-apis.md'),
          menuItem('Assets', 'assets.md'),
          menuItem('Target Different Browsers', 'target-different-browsers.md'),
          menuItem('Content Scripts', 'content-scripts.md'),
          menuItem('Storage', 'storage.md'),
          menuItem('Messaging', 'messaging.md'),
          menuItem('I18n', 'i18n.md'),
          menuItem('Scripting', 'scripting.md'),
          menuItem('WXT Modules', 'wxt-modules.md'),
          menuItem('Frontend Frameworks', 'frontend-frameworks.md'),
          menuItem('ES Modules', 'es-modules.md'),
          menuItem('Remote Code', 'remote-code.md'),
          menuItem('Unit Testing', 'unit-testing.md'),
          menuItem('E2E Testing', 'e2e-testing.md'),
          menuItem('Publishing', 'publishing.md'),
          menuItem('Testing Updates', 'testing-updates.md'),
        ]),
        menuGroup('Resources', '/guide/resources/', [
          menuItem('Compare', 'compare.md'),
          menuItem('FAQ', 'faq.md'),
          menuItem('Community', 'community.md'),
          menuItem('Upgrading WXT', 'upgrading.md'),
          menuItem('Migrate to WXT', 'migrate.md'),
          menuItem('How WXT Works', 'how-wxt-works.md'),
        ]),
      ]),
      '/api/': menuRoot([
        menuGroup(
          'CLI Reference',
          '/api/cli/',
          [
            menuItem('wxt', 'wxt.md'),
            menuItem('wxt build', 'wxt-build.md'),
            menuItem('wxt zip', 'wxt-zip.md'),
            menuItem('wxt prepare', 'wxt-prepare.md'),
            menuItem('wxt clean', 'wxt-clean.md'),
            menuItem('wxt init', 'wxt-init.md'),
            menuItem('wxt submit', 'wxt-submit.md'),
            menuItem('wxt submit init', 'wxt-submit-init.md'),
          ],
          true,
        ),
        menuGroup('API Reference', prepareTypedocSidebar(typedocSidebar), true),
      ]),
    },
  },
});
