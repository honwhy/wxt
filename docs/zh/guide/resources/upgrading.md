---
outline: deep
---

# 升级 WXT

## 概览

要将 WXT 升级到最新主版本：

1. 安装时跳过脚本，这样 `wxt prepare` 不会运行 —— 主版本变更后它很可能会报错（我们稍后再运行它）。

   ```sh
   pnpm i wxt@latest --ignore-scripts
   ```

2. 按照下方的升级步骤修复所有不兼容变更。
3. 运行 `wxt prepare`。它应该可以成功运行，之后类型错误也会消失。

   ```sh
   pnpm wxt prepare
   ```

4. 手动测试，确保开发模式和生产构建都能正常工作。

对于次版本或补丁版本的更新，无需特殊步骤。只需用你的包管理器更新即可：

```sh
pnpm i wxt@latest
```

---

下方列出了升级到新版本 WXT 时需要处理的所有不兼容变更。

目前，WXT 处于预发布阶段。这意味着第二位数字的变更（`v0.X`）被视为主版本变更，并包含不兼容变更。一旦 v1 发布，只有主版本号变更才会有不兼容变更。

## v0.19.0 &rarr; v0.20.0

v0.20 是一次重大更新！有许多不兼容变更，因为这个版本旨在作为 v1.0 的候选发布。如果一切顺利，v1.0 将不会有额外的不兼容变更。

:::tip
在更新代码前，请先通读所有变更内容。
:::

### 移除 `webextension-polyfill`

WXT 的 `browser` 不再使用 `webextension-polyfill`！

:::details 为什么？
见 <https://github.com/wxt-dev/wxt/issues/784>
:::

升级有两种方式：

1. **停止使用 polyfill**

   - 如果你已经在用 `extensionApi: "chrome"`，那你本来就没用 polyfill，无需更改！
   - 否则只需做一个更改：`browser.runtime.onMessage` 不再支持用 promise 返回响应：

     ```ts
     browser.runtime.onMessage.addListener(async () => { // [!code --]
       const res = await someAsyncWork(); // [!code --]
       return res; // [!code --]
     browser.runtime.onMessage.addListener(async (_message, _sender, sendResponse) => { // [!code ++]
       someAsyncWork().then((res) => { // [!code ++]
         sendResponse(res); // [!code ++]
       }); // [!code ++]
       return true; // [!code ++]
     });
     ```

2. **继续使用 polyfill** —— 如果你想继续用 polyfill，也可以！这样升级时就不用担心这部分了。

   - 安装 `webextension-polyfill` 和 WXT 的[新 polyfill 模块](https://www.npmjs.com/package/@wxt-dev/webextension-polyfill)：

     ```sh
     pnpm i webextension-polyfill @wxt-dev/webextension-polyfill
     ```

   - 在配置中添加 WXT 模块：

     ```ts [wxt.config.ts]
     export default defineConfig({
       modules: ['@wxt-dev/webextension-polyfill'],
     });
     ```

新的 `browser` 对象（及类型）由 WXT 的新包 [`@wxt-dev/browser`](https://www.npmjs.com/package/@wxt-dev/browser) 提供。该包延续了 WXT 为整个社区提供有用包的理念。就像 [`@wxt-dev/storage`](https://www.npmjs.com/package/@wxt-dev/storage)、[`@wxt-dev/i18n`](https://www.npmjs.com/package/@wxt-dev/i18n)、[`@wxt-dev/analytics`](https://www.npmjs.com/package/@wxt-dev/analytics) 一样，它设计为可在任何 web 扩展项目中轻松使用，不仅限于 WXT 项目，并为所有浏览器和 manifest 版本提供一致的 API。

### 移除 `extensionApi` 配置

`extensionApi` 配置已被移除。此前，该配置用于在 v0.20.0 之前切换到新的 `browser` 对象。

如果你的 `wxt.config.ts` 文件中有它，请将其移除：

```ts [wxt.config.ts]
export default defineConfig({
  extensionApi: 'chrome', // [!code --]
});
```

### 扩展 API 类型变更

随着 v0.20 引入新的 `browser`，类型的获取方式也变了。WXT 现在基于 `@types/chrome` 提供类型，而不是 `@types/webextension-polyfill`。

这些类型与 MV3 API 更同步，bug 更少，结构更清晰，没有自动生成的名称。

要获取类型，请使用 `wxt/browser` 中的 `Browser` 命名空间：

<!-- prettier-ignore -->
```ts
import type { Runtime } from 'wxt/browser'; // [!code --]
import type { Browser } from 'wxt/browser'; // [!code ++]

function getMessageSenderUrl(sender: Runtime.MessageSender): string { // [!code --]
function getMessageSenderUrl(sender: Browser.runtime.MessageSender): string { // [!code ++]
  // ...
}
```

> 如果你用自动导入，`Browser` 会自动可用，无需手动导入。

并非所有类型名都与 `@types/webextension-polyfill` 一致。你需要根据实际用到的 `browser.*` API 查找新的类型名。

### `public/` 和 `modules/` 目录位置变更

`public/` 和 `modules/` 目录的默认位置已变更，以更好地与其他框架（Nuxt、Next、Astro 等）保持一致。现在，每个路径都相对于项目**根目录**，而不是 src 目录。

- 如果你用的是默认文件结构，无需更改。
- 如果你设置了自定义 `srcDir`，有两种选择：

  1. 将你的 `public/` 和 `modules/` 目录移到项目根目录：
     <!-- prettier-ignore -->
     ```html
      📂 {rootDir}/
         📁 modules/ <!-- [!code ++] -->
         📁 public/ <!-- [!code ++] -->
         📂 src/
            📁 components/
            📁 entrypoints/
            📁 modules/ <!-- [!code --] -->
            📁 public/ <!-- [!code --] -->
            📁 utils/
            📄 app.config.ts
         📄 wxt.config.ts
      ```

  2. 保持目录不变，并在项目配置中指定：

     ```ts [wxt.config.ts]
     export default defineConfig({
       srcDir: 'src',
       publicDir: 'src/public', // [!code ++]
       modulesDir: 'src/modules', // [!code ++]
     });
     ```

### 导入路径变更与 `#imports`

`wxt/sandbox`、`wxt/client`、`wxt/storage` 导出的 API 已迁移到 `wxt/utils/*` 下的独立导出。

:::details 为什么？
随着 WXT 的发展，越来越多的工具被加入，带副作用的工具如果未被 tree-shake，会被打包进最终产物。

这会导致问题，因为不是每个入口点都能用所有 API。有些 API 只能在 background 用，沙盒页面不能用扩展 API 等。这会导致 JS 在顶层作用域报错，阻止代码运行。

将每个工具拆分为独立模块可以解决这个问题，确保你只在能运行的入口点导入对应 API 和副作用。
:::

请参考更新后的 [API 参考](/api/reference/) 查看新的导入路径。

不过，你无需记住这些新路径！v0.20 新增了虚拟模块 `#imports`，开发者只需从这里导入即可。详见 [博客](/blog/2024-12-06-using-imports-module)。

所以升级时，只需将所有从 `wxt/storage`、`wxt/client`、`wxt/sandbox` 的导入替换为 `#imports`：

```ts
import { storage } from 'wxt/storage'; // [!code --]
import { defineContentScript } from 'wxt/sandbox'; // [!code --]
import { ContentScriptContext, useAppConfig } from 'wxt/client'; // [!code --]
import { storage } from '#imports'; // [!code ++]
import { defineContentScript } from '#imports'; // [!code ++]
import { ContentScriptContext, useAppConfig } from '#imports'; // [!code ++]
```

你可以合并为一个导入语句，但直接查找替换每条语句更简单。

```ts
import { storage } from 'wxt/storage'; // [!code --]
import { defineContentScript } from 'wxt/sandbox'; // [!code --]
import { ContentScriptContext, useAppConfig } from 'wxt/client'; // [!code --]
import {
  // [!code ++]
  storage, // [!code ++]
  defineContentScript, // [!code ++]
  ContentScriptContext, // [!code ++]
  useAppConfig, // [!code ++]
} from '#imports'; // [!code ++]
```

:::tip
要让类型生效，安装 v0.20 后需运行 `wxt prepare` 生成新的 TypeScript 声明。
:::

### `createShadowRootUi` CSS 变更

WXT 现在通过在 shadow root 内设置 `all: initial`，重置了网页继承的样式（如 `visibility`、`color`、`font-size` 等）。

:::warning
这不会影响 `rem` 单位。如果网页设置了 HTML 元素的 `font-size`，你仍需用 `postcss-rem-to-px` 或类似库。
:::

如果你用到了 `createShadowRootUi`：

1. 移除所有手动重置特定网站样式的 CSS。例如：

   <!-- prettier-ignore -->
   ```css [entrypoints/reddit.content/style.css]
   body { /* [!code --] */
     /* 覆盖 Reddit 默认的 "hidden" 可见性 */ /* [!code --] */
     visibility: visible !important; /* [!code --] */
   } /* [!code --] */
   ```

2. 仔细检查你的 UI 是否与之前一致。

如果新行为有问题，你可以禁用它，继续用原有 CSS：

```ts
const ui = await createShadowRootUi({
  inheritStyles: true, // [!code ++]
  // ...
});
```

### 默认输出目录变更

[`outDirTemplate`](/api/reference/wxt/interfaces/InlineConfig#outdirtemplate) 配置的默认值已变更。现在，不同构建模式输出到不同目录：

- `--mode production` &rarr; `.output/chrome-mv3`：生产构建不变
- `--mode development` &rarr; `.output/chrome-mv3-dev`：开发模式目录加 `-dev` 后缀，不再覆盖生产构建
- `--mode custom` &rarr; `.output/chrome-mv3-custom`：自定义模式以 `-[mode]` 结尾

如需旧行为（所有输出写到同一目录），设置 `outDirTemplate`：

```ts [wxt.config.ts]
export default defineConfig({
  outDirTemplate: '{{browser}}-mv{{manifestVersion}}', // [!code ++]
});
```

:::warning
如果你之前手动加载过开发版扩展，请从新的 dev 输出目录卸载并重新安装。
:::

### 移除已废弃 API

- `entrypointLoader` 选项：WXT 现在用 `vite-node` 导入入口点。
  <!-- markdownlint-disable-next-line MD051 -->
  > v0.19.0 已废弃，迁移见 [v0.19 部分](#v0-18-5-rarr-v0-19-0)。
- `transformManifest` 选项：用 `build:manifestGenerated` 钩子替代：
  <!-- prettier-ignore -->
  ```ts [wxt.config.ts]
  export default defineConfig({
    transformManifest(manifest) { // [!code --]
    hooks: { // [!code ++]
      'build:manifestGenerated': (_, manifest) => { // [!code ++]
         // ...
      }, // [!code ++]
    },
  });
  ```

### 新的废弃项

#### `runner` API 重命名

为与 `web-ext.config.ts` 文件名保持一致，"runner" API 及配置项已重命名。你仍可用旧名，但它们已废弃，将在未来版本移除：

1. `runner` 选项重命名为 `webExt`：

   ```ts [wxt.config.ts]
   export default defineConfig({
     runner: { // [!code --]
     webExt: { // [!code ++]
       startUrls: ["https://wxt.dev"],
     },
   });
   ```

2. `defineRunnerConfig` 重命名为 `defineWebExtConfig`：

   ```ts [web-ext.config.ts]
   import { defineRunnerConfig } from 'wxt'; // [!code --]
   import { defineWebExtConfig } from 'wxt'; // [!code ++]
   ```

3. `ExtensionRunnerConfig` 类型重命名为 `WebExtConfig`

   ```ts
   import type { ExtensionRunnerConfig } from 'wxt'; // [!code --]
   import type { WebExtConfig } from 'wxt'; // [!code ++]
   ```

## v0.18.5 &rarr; v0.19.0

### `vite-node` 入口点加载器

默认入口点加载器已改为 `vite-node`。如果你用的 NPM 包依赖 `webextension-polyfill`，需加到 Vite 的 `ssr.noExternal` 选项：

<!-- prettier-ignore -->
```ts [wxt.config.ts]
export default defineConfig({
  vite: () => ({ // [!code ++]
    ssr: { // [!code ++]
      noExternal: ['@webext-core/messaging', '@webext-core/proxy-service'], // [!code ++]
    }, // [!code ++]
  }), // [!code ++]
});
```

> [查看完整文档](/guide/essentials/config/entrypoint-loaders#vite-node) 了解更多。

:::details 此变更带来：

可导入变量并在入口点选项中使用：

```ts [entrypoints/content.ts]
import { GOOGLE_MATCHES } from '~/utils/constants'

export default defineContentScript({
  matches: [GOOGLE_MATCHES],
  main: () => ...,
})
```

可用 Vite 特有 API（如 `import.meta.glob`）定义入口点选项：

```ts [entrypoints/content.ts]
const providers: Record<string, any> = import.meta.glob('../providers/*', {
  eager: true,
});

export default defineContentScript({
  matches: Object.values(providers).flatMap(
    (provider) => provider.default.paths,
  ),
  async main() {
    console.log('Hello content.');
  },
});
```

总之，现在可以在入口点的 `main` 函数外导入和执行代码 —— 以前不行。但仍建议避免在 `main` 外运行代码，以保证构建速度。

:::

如需继续用旧方式，在 `wxt.config.ts` 中添加：

```ts [wxt.config.ts]
export default defineConfig({
  entrypointLoader: 'jiti', // [!code ++]
});
```

:::warning
`entrypointLoader: "jiti"` 已废弃，下个主版本将移除。
:::

### 移除 CJS 支持

WXT 不再支持 Common JS。如果你用 CJS，迁移步骤如下：

1. 在 `package.json` 中加上 [`"type": "module"`](https://nodejs.org/api/packages.html#type)。
2. 将用 CJS 语法的 `.js` 文件扩展名改为 `.cjs`，或改为 ESM 语法。

Vite 也有 ESM 迁移指南，详见：<https://vitejs.dev/guide/migration#deprecate-cjs-node-api>

## v0.18.0 &rarr; v0.18.5

> 此版本发布时未视为不兼容变更……但其实应该算。

### 新增 `modules/` 目录

WXT 现在识别 `modules/` 目录为 [WXT 模块](/guide/essentials/wxt-modules) 文件夹。

如果你已有 `<srcDir>/modules` 或 `<srcDir>/Modules` 目录，`wxt prepare` 等命令会失败。

你有两种选择：

1. 【推荐】保持文件原位，并告知 WXT 查找其他目录：

   ```ts [wxt.config.ts]
   export default defineConfig({
     modulesDir: 'wxt-modules', // 默认为 "modules"
   });
   ```

2. 重命名你的 `modules` 目录。

## v0.17.0 &rarr; v0.18.0

### 自动将 MV3 `host_permissions` 转为 MV2 `permissions`

> 出于谨慎，此变更被标为不兼容，因为权限生成方式变了。

如果你在 `wxt.config.ts` 的 manifest 中列出了 `host_permissions` 并已发布扩展，请务必检查所有目标浏览器的 `.output/*/manifest.json` 文件，确保 `permissions` 和 `host_permissions` 未发生变化。权限变更可能导致扩展升级后被禁用，用户流失，请务必核对。

## v0.16.0 &rarr; v0.17.0

### Storage - `defineItem` 需 `defaultValue` 选项

如果你用带版本的 `defineItem` 且无默认值，现在需加 `defaultValue: null`，并更新第一个类型参数：

```ts
const item = storage.defineItem<number>("local:count", { // [!code --]
const item = storage.defineItem<number | null>("local:count", { // [!code ++]
defaultValue: null, // [!code ++]
  version: ...,
  migrations: ...,
})
```

如果不传第二个 options 参数，仍默认为可空类型。

```ts
const item: WxtStorageItem<number | null> =
  storage.defineItem<number>('local:count');
const value: number | null = await item.getValue();
```

### Storage - 修正 `watch` 回调类型

> 如果你不用 TypeScript，这只是类型变更，不影响功能。

```ts
const item = storage.defineItem<number>('local:count', { defaultValue: 0 });
item.watch((newValue: number | null, oldValue: number | null) => { // [!code --]
item.watch((newValue: number, oldValue: number) => { // [!code ++]
  // ...
});
```

## v0.15.0 &rarr; v0.16.0

### 输出目录结构变更

输出目录下 JS 入口点位置已变。除非你有后处理需求，否则无需更改。

```plaintext
.output/
  <target>/
    chunks/
      some-shared-chunk-<hash>.js
      popup-<hash>.js // [!code --]
    popup.html
    popup.html
    popup.js // [!code ++]
```

## v0.14.0 &rarr; v0.15.0

### `zip.ignoredSources` 重命名为 `zip.excludeSources`

```ts [wxt.config.ts]
export default defineConfig({
  zip: {
    ignoredSources: [
      /*...*/
    ], // [!code --]
    excludeSources: [
      /*...*/
    ], // [!code ++]
  },
});
```

### 未文档常量重命名

[#380](https://github.com/wxt-dev/wxt/pull/380) 中重命名了用于运行时检测构建配置的未文档常量。现已在此文档：<https://wxt.dev/guide/multiple-browsers.html#runtime>

- `__BROWSER__` → `import.meta.env.BROWSER`
- `__COMMAND__` → `import.meta.env.COMMAND`
- `__MANIFEST_VERSION__` → `import.meta.env.MANIFEST_VERSION`
- `__IS_CHROME__` → `import.meta.env.CHROME`
- `__IS_FIREFOX__` → `import.meta.env.FIREFOX`
- `__IS_SAFARI__` → `import.meta.env.SAFARI`
- `__IS_EDGE__` → `import.meta.env.EDGE`
- `__IS_OPERA__` → `import.meta.env.OPERA`

## v0.13.0 &rarr; v0.14.0

### Content Script UI API 变更

`createContentScriptUi`、`createContentScriptIframe` 及部分选项已重命名：

- `createContentScriptUi({ ... })` &rarr; `createShadowRootUi({ ... })`
- `createContentScriptIframe({ ... })` &rarr; `createIframeUi({ ... })`
- `type: "inline" | "overlay" | "modal"` 改为 `position: "inline" | "overlay" | "modal"`
- `onRemove` 现在在 UI 从 DOM 移除**之前**调用，之前是移除后
- `mount` 选项重命名为 `onMount`，以与 `onRemove` 匹配

## v0.12.0 &rarr; v0.13.0

### 新的 `wxt/storage` API

`wxt/storage` 不再依赖 [`unstorage`](https://www.npmjs.com/package/unstorage)。部分 `unstorage` API（如 `prefixStorage`）已移除，其他如 `snapshot` 变为新 `storage` 对象的方法。大部分标准用法不变。详见 <https://wxt.dev/guide/storage> 和 <https://wxt.dev/api/reference/wxt/storage/>（[#300](https://github.com/wxt-dev/wxt/pull/300)）

## v0.11.0 &rarr; v0.12.0

### API 导出变更

`defineContentScript` 和 `defineBackground` 现在从 `wxt/sandbox` 导出，不再是 `wxt/client`。（[#284](https://github.com/wxt-dev/wxt/pull/284)）

- 如果你用自动导入，无需更改。
- 如果你禁用了自动导入，需手动更新导入语句：

  ```ts
  import { defineBackground, defineContentScript } from 'wxt/client'; // [!code --]
  import { defineBackground, defineContentScript } from 'wxt/sandbox'; // [!code ++]
  ```

## v0.10.0 &rarr; v0.11.0

### Vite 5

你需要将其他 Vite 插件升级到支持 Vite 5 的版本。

## v0.9.0 &rarr; v0.10.0

### 扩展图标发现

WXT 不再自动发现 `.png` 以外的图标。如果你之前用 `.jpg`、`.jpeg`、`.bmp` 或 `.svg`，需将图标转为 `.png`，或手动在 `wxt.config.ts` 的 manifest 中添加。

## v0.8.0 &rarr; v0.9.0

### 默认移除 `WebWorker` 类型

默认从 `.wxt/tsconfig.json` 移除了 [`"WebWorker"` 类型](https://www.typescriptlang.org/tsconfig/lib.html)。该类型适用于用 service worker 的 MV3 项目。

如需恢复，在项目 TSConfig 中添加：

```json
{
  "extends": "./.wxt/tsconfig.json",
  "compilerOptions": {
    // [!code ++]
    "lib": ["ESNext", "DOM", "WebWorker"] // [!code ++]
  } // [!code ++]
}
```

## v0.7.0 &rarr; v0.8.0

### `defineUnlistedScript`

未列出的脚本现在必须 `export default defineUnlistedScript(...)`。

### `BackgroundDefinition` 类型

将 `BackgroundScriptDefintition` 重命名为 `BackgroundDefinition`。

## v0.6.0 &rarr; v0.7.0

### Content Script CSS 输出位置变更

内容脚本 CSS 以前输出到 `assets/<name>.css`，现在为 `content-scripts/<name>.css`，与文档一致。

## v0.5.0 &rarr; v0.6.0

### `vite` 配置需为函数

`vite` 配置项现在必须为函数。如果你之前用对象，改为 `vite: { ... }` 到 `vite: () => ({ ... })`。

## v0.4.0 &rarr; v0.5.0

### 还原 public 目录位置

默认 `publicDir` 从 `<rootDir>/public` 改回 `<srcDir>/public`。

## v0.3.0 &rarr; v0.4.0

### 更新默认路径别名

在 `.wxt/tsconfig.json` 中使用相对路径别名。

## v0.2.0 &rarr; v0.3.0

### 移动 public 目录

默认 `publicDir` 从 `<srcDir>/public` 改为 `<rootDir>/public`。

### 提升类型安全

为 `browser.runtime.getURL` 增加类型安全。

## v0.1.0 &rarr; v0.2.0

### 重命名 `defineBackground`

将 `defineBackgroundScript` 重命名为 `defineBackground`。
