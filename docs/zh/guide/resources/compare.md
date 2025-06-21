# 对比

让我们来对比一下 WXT 与 [Plasmo](https://docs.plasmo.com/framework)（另一个框架）和 [CRXJS](https://crxjs.dev/vite-plugin)（一个打包插件）的功能。

## 总览

- ✅ - 完全支持
- 🟡 - 部分支持
- ❌ - 不支持

| 功能                                           |   WXT   | Plasmo  |  CRXJS  |
| ---------------------------------------------- | :-----: | :-----: | :-----: |
| 维护状态                                       |   ✅    | 🟡 [^n] | 🟡 [^m] |
| 支持所有浏览器                                 |   ✅    |   ✅    | 🟡 [^j] |
| 支持 MV2                                       |   ✅    |   ✅    | 🟡 [^a] |
| 支持 MV3                                       |   ✅    |   ✅    | 🟡 [^a] |
| 创建扩展 ZIP 包                                |   ✅    |   ✅    |   ❌    |
| 创建 Firefox 源码 ZIP 包                       |   ✅    |   ❌    |   ❌    |
| 一流的 TypeScript 支持                         |   ✅    |   ✅    |   ✅    |
| 入口文件自动发现                               | ✅ [^b] | ✅ [^b] |   ❌    |
| 内联入口配置                                   |   ✅    |   ✅    | ❌ [^i] |
| 自动导入                                       |   ✅    |   ❌    |   ❌    |
| 可复用模块系统                                 |   ✅    |   ❌    |   ❌    |
| 支持所有前端框架                               |   ✅    | 🟡 [^c] |   ✅    |
| 框架特定入口（如 `Popup.tsx`）                 | 🟡 [^d] | ✅ [^e] |   ❌    |
| 自动化发布                                     |   ✅    |   ✅    |   ❌    |
| 远程代码打包（如 Google Analytics）            |   ✅    |   ✅    |   ❌    |
| 非公开 HTML 页面                               |   ✅    |   ✅    |   ✅    |
| 非公开脚本                                     |   ✅    |   ❌    |   ❌    |
| ESM 内容脚本                                   | ❌ [^l] |   ❌    |   ✅    |
| <strong style="opacity: 50%">开发模式</strong> |         |         |         |
| `.env` 文件                                    |   ✅    |   ✅    |   ✅    |
| 启动浏览器并安装扩展                           |   ✅    |   ❌    |   ❌    |
| UI 热更新（HMR）                               |   ✅    | 🟡 [^f] |   ✅    |
| HTML 文件变更自动刷新                          |   ✅    | 🟡 [^g] |   ✅    |
| 内容脚本变更自动刷新                           |   ✅    | 🟡 [^g] |   ✅    |
| 后台脚本变更自动刷新                           | 🟡 [^g] | 🟡 [^g] | 🟡 [^g] |
| 遵循内容脚本 `run_at`                          |   ✅    |   ✅    | ❌ [^h] |
| <strong style="opacity: 50%">内置封装</strong> |         |         |         |
| 存储                                           |   ✅    |   ✅    | ❌ [^k] |
| 消息通信                                       | ❌ [^k] |   ✅    | ❌ [^k] |
| 内容脚本 UI                                    |   ✅    |   ✅    | ❌ [^k] |
| 国际化（I18n）                                 |   ✅    |   ❌    |   ❌    |

[^a]: 仅支持 MV2 或 MV3，不支持同时支持。

[^b]: 基于文件。

[^c]: 仅支持 React、Vue 和 Svelte。

[^d]: `.html`、`.ts`、`.tsx`。

[^e]: `.html`、`.ts`、`.tsx`、`.vue`、`.svelte`。

[^f]: 仅支持 React。

[^g]: 会重载整个扩展。

[^h]: ESM 风格加载器是异步运行的。

[^i]: 入口配置全部在 `manifest.json` 中设置。

[^j]: 自 `v2.0.0-beta.23` 起，但 v2 正式版尚未发布。

[^k]: 没有内置的 API 封装。但你仍然可以通过 `chrome`/`browser` 全局对象或第三方 NPM 包访问标准 API。

[^l]: 进行中，进展缓慢。关注 [wxt-dev/wxt#357](https://github.com/wxt-dev/wxt/issues/357) 获取最新进展。

[^m]: 见 [crxjs/chrome-extension-tools#974](https://github.com/crxjs/chrome-extension-tools/discussions/974)

[^n]: 目前处于维护模式，几乎没有维护者或新功能开发（见 [wxt-dev/wxt#1404 (comment)](https://github.com/wxt-dev/wxt/pull/1404#issuecomment-2643089518)\_
