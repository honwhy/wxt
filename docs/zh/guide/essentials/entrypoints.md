---
outline: deep
---

# 入口点（Entrypoints）

WXT 在打包你的扩展程序时，会使用 `entrypoints/` 目录内的文件作为输入。这些文件可以是 HTML、JS、CSS 或 Vite 支持的任何变体文件类型（TS、JSX、SCSS 等）。

## 文件夹结构

在 `entrypoints/` 目录中，入口点被定义为其中的单个文件或目录（包含一个 `index` 文件）。

:::code-group

<!-- prettier-ignore -->
```html [单个文件]
📂 entrypoints/
   📄 {name}.{ext}
```

<!-- prettier-ignore -->
```html [目录]
📂 entrypoints/
   📂 {name}/
      📄 index.{ext}
```

:::

入口点的 `name` 决定了入口点的类型。例如，要添加一个["后台"入口点](#background)，以下任意文件均可生效：

:::code-group

<!-- prettier-ignore -->
```html [单个文件]
📂 entrypoints/
   📄 background.ts
```

<!-- prettier-ignore -->
```html [目录]
📂 entrypoints/
   📂 background/
      📄 index.ts
```

:::

完整的入口点类型列表及其文件名模式，请参阅[入口点类型](#entrypoint-types)章节。

### 包含其他文件

当使用入口点目录 `entrypoints/{name}/index.{ext}` 时，你可以在 `index` 文件旁边添加相关文件。

<!-- prettier-ignore -->
```html
📂 entrypoints/
   📂 popup/
      📄 index.html     ← 此文件是入口点
      📄 main.ts
      📄 style.css
   📂 background/
      📄 index.ts       ← 此文件是入口点
      📄 alarms.ts
      📄 messaging.ts
   📂 youtube.content/
      📄 index.ts       ← 此文件是入口点
      📄 style.css
```

:::danger
**切勿**将入口点相关文件直接放在 `entrypoints/` 目录中。WXT 会将其视为入口点并尝试构建，通常会导致错误。

应使用目录存放该入口点：

<!-- prettier-ignore -->
```html
📂 entrypoints/
   📄 popup.html <!-- [!code --] -->
   📄 popup.ts <!-- [!code --] -->
   📄 popup.css <!-- [!code --] -->
   📂 popup/ <!-- [!code ++] -->
      📄 index.html <!-- [!code ++] -->
      📄 main.ts <!-- [!code ++] -->
      📄 style.css <!-- [!code ++] -->
```

:::

### 深层嵌套的入口点

虽然 `entrypoints/` 目录可能类似于 Nuxt 或 Next.js 等 Web 框架的 `pages/` 目录，但它**不支持**以相同方式进行深层嵌套入口点。

入口点必须位于零级或一级深度，WXT 才能发现并构建它们：

<!-- prettier-ignore -->
```html
📂 entrypoints/
   📂 youtube/ <!-- [!code --] -->
       📂 content/ <!-- [!code --] -->
          📄 index.ts <!-- [!code --] -->
          📄 ... <!-- [!code --] -->
       📂 injected/ <!-- [!code --] -->
          📄 index.ts <!-- [!code --] -->
          📄 ... <!-- [!code --] -->
   📂 youtube.content/ <!-- [!code ++] -->
      📄 index.ts <!-- [!code ++] -->
      📄 ... <!-- [!code ++] -->
   📂 youtube-injected/ <!-- [!code ++] -->
      📄 index.ts <!-- [!code ++] -->
      📄 ... <!-- [!code ++] -->
```

## 未列出的入口点（Unlisted Entrypoints）

在 Web 扩展中，有两种类型的入口点：

1. **已列出（Listed）**：在 `manifest.json` 中被引用
2. **未列出（Unlisted）**：未在 `manifest.json` 中被引用

在 WXT 文档的其余部分中，已列出的入口点按其名称引用。例如：

- Popup（弹出页）
- Options（选项页）
- Background（后台）
- Content Script（内容脚本）

然而，并非所有 Web 扩展中的入口点都在清单中列出。有些未在清单中列出，但仍被扩展使用。例如：

- 安装扩展时在新标签页显示的欢迎页面
- 由内容脚本注入主世界的 JS 文件

有关如何添加未列出入口点的详细信息，请参阅：

- [未列出的页面](#unlisted-pages)
- [未列出的脚本](#unlisted-scripts)
- [未列出的 CSS](#unlisted-css)

## 定义清单选项

大多数已列出的入口点都有需要添加到 `manifest.json` 的选项。但在 WXT 中，你无需在单独文件中定义这些选项，而是*在入口点文件本身内部定义这些选项*。

例如，以下是如何为内容脚本定义 `matches`：

```ts [entrypoints/content.ts]
export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
  main() {
    // ...
  },
});
```

对于 HTML 入口点，选项通过 `<meta>` 标签配置。例如，为 MV2 弹出页使用 `page_action`：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta name="manifest.type" content="page_action" />
  </head>
</html>
```

> 有关每个入口点内可配置选项的列表及定义方式，请参阅[入口点类型](#entrypoint-types)章节。

在构建扩展时，WXT 会查看入口点中定义的选项，并据此生成清单文件。

## 入口点类型

### 后台（Background）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/manifest/background/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background)

<EntrypointPatterns
  :patterns="[
    ['background.[jt]s', 'background.js'],
    ['background/index.[jt]s', 'background.js'],
  ]"
/>

:::code-group

```ts [最简形式]
export default defineBackground(() => {
  // 后台加载时执行
});
```

```ts [带清单选项]
export default defineBackground({
  // 设置清单选项
  persistent: undefined | true | false,
  type: undefined | 'module',

  // 设置 include/exclude 以从某些构建中移除后台
  include: undefined | string[],
  exclude: undefined | string[],

  main() {
    // 后台加载时执行，不能是异步函数
  },
});
```

:::

对于 MV2，后台作为脚本添加到后台页面。对于 MV3，后台变为 Service Worker。

定义后台入口点时，请记住 WXT 会在构建过程中在 NodeJS 环境中导入此文件。这意味着你不能在 `main` 函数之外放置任何运行时代码。

<!-- prettier-ignore -->
```ts
browser.action.onClicked.addListener(() => { // [!code --]
  // ... // [!code --]
}); // [!code --]

export default defineBackground(() => {
  browser.action.onClicked.addListener(() => { // [!code ++]
    // ... // [!code ++]
  }); // [!code ++]
});
```

更多详情请参阅[入口点加载器](/guide/essentials/config/entrypoint-loaders)文档。

### 书签页（Bookmarks）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/override/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/chrome_url_overrides)

<EntrypointPatterns
  :patterns="[
    ['bookmarks.html', 'bookmarks.html'],
    ['bookmarks/index.html', 'bookmarks.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>标题</title>
    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

定义书签页入口点时，WXT 会自动更新清单，用你的 HTML 页面覆盖浏览器的书签页面。

### 内容脚本（Content Scripts）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)

<EntrypointPatterns
  :patterns="[
    ['content.[jt]sx?', 'content-scripts/content.js'],
    ['content/index.[jt]sx?', 'content-scripts/content.js'],
    ['{name}.content.[jt]sx?', 'content-scripts/{name}.js'],
    ['{name}.content/index.[jt]sx?', 'content-scripts/{name}.js'],
  ]"
/>

```ts
export default defineContentScript({
  // 设置清单选项
  matches: string[],
  excludeMatches: undefined | [],
  includeGlobs: undefined | [],
  excludeGlobs: undefined | [],
  allFrames: undefined | true | false,
  runAt: undefined | 'document_start' | 'document_end' | 'document_idle',
  matchAboutBlank: undefined | true | false,
  matchOriginAsFallback: undefined | true | false,
  world: undefined | 'ISOLATED' | 'MAIN',

  // 设置 include/exclude 以从某些构建中移除后台
  include: undefined | string[],
  exclude: undefined | string[],

  // 配置 CSS 注入页面的方式
  cssInjectionMode: undefined | "manifest" | "manual" | "ui",

  // 配置内容脚本的注册方式/时机
  registration: undefined | "manifest" | "runtime",

  main(ctx: ContentScriptContext) {
    // 内容脚本加载时执行，可以是异步函数
  },
});
```

定义内容脚本入口点时，请记住 WXT 会在构建过程中在 NodeJS 环境中导入此文件。这意味着你不能在 `main` 函数之外放置任何运行时代码。

<!-- prettier-ignore -->
```ts
browser.runtime.onMessage.addListener((message) => { // [!code --]
  // ... // [!code --]
}); // [!code --]

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message) => { // [!code ++]
    // ... // [!code ++]
  }); // [!code ++]
});
```

更多详情请参阅[入口点加载器](/guide/essentials/config/entrypoint-loaders)文档。

有关在内容脚本中创建 UI 和包含 CSS 的更多信息，请参阅[内容脚本 UI](/guide/essentials/content-scripts)。

### 开发者工具（Devtools）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/devtools/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/devtools_page)

<EntrypointPatterns
  :patterns="[
    ['devtools.html', 'devtools.html'],
    ['devtools/index.html', 'devtools.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

请参考[开发者工具示例](https://github.com/wxt-dev/examples/tree/main/examples/devtools-extension#readme)来添加不同的面板和窗格。

### 历史记录页（History）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/override/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/chrome_url_overrides)

<EntrypointPatterns
  :patterns="[
    ['history.html', 'history.html'],
    ['history/index.html', 'history.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>标题</title>
    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

定义历史记录页入口点时，WXT 会自动更新清单，用你的 HTML 页面覆盖浏览器的历史记录页面。

### 新标签页（Newtab）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/override/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/chrome_url_overrides)

<EntrypointPatterns
  :patterns="[
    ['newtab.html', 'newtab.html'],
    ['newtab/index.html', 'newtab.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>标题</title>
    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

定义新标签页入口点时，WXT 会自动更新清单，用你的 HTML 页面覆盖浏览器的新标签页。

### 选项页（Options）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/options/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/options_ui)

<EntrypointPatterns
  :patterns="[
    ['options.html', 'options.html'],
    ['options/index.html', 'options.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>选项标题</title>

    <!-- 自定义清单选项 -->
    <meta name="manifest.open_in_tab" content="true|false" />
    <meta name="manifest.chrome_style" content="true|false" />
    <meta name="manifest.browser_style" content="true|false" />

    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

### 弹出页（Popup）

[Chrome 文档](https://developer.chrome.com/docs/extensions/reference/action/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest/json/action)

<EntrypointPatterns
  :patterns="[
    ['popup.html', 'popup.html'],
    ['popup/index.html', 'popup.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- 设置清单中的 `action.default_title` -->
    <title>默认弹出页标题</title>

    <!-- 自定义清单选项 -->
    <meta
      name="manifest.default_icon"
      content="{
        16: '/icon-16.png',
        24: '/icon-24.png',
        ...
      }"
    />
    <meta name="manifest.type" content="page_action|browser_action" />
    <meta name="manifest.browser_style" content="true|false" />

    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

### 沙盒页（Sandbox）

[Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/manifest/sandbox/)

:::warning 仅限 Chromium
Firefox 不支持沙盒页面。
:::

<EntrypointPatterns
  :patterns="[
    ['sandbox.html', 'sandbox.html'],
    ['sandbox/index.html', 'sandbox.html'],
    ['{name}.sandbox.html', '{name}.html'],
    ['{name}.sandbox/index.html', '{name}.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>标题</title>

    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

### 侧边面板（Side Panel）

[Chrome 文档](https://developer.chrome.com/docs/extensions/reference/sidePanel/) &bull; [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars)

<EntrypointPatterns
  :patterns="[
    ['sidepanel.html', 'sidepanel.html'],
    ['sidepanel/index.html', 'sidepanel.html'],
    ['{name}.sidepanel.html', '{name}.html` '],
    ['{name}.sidepanel/index.html', '{name}.html` '],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>默认侧边面板标题</title>

    <!-- 自定义清单选项 -->
    <meta
      name="manifest.default_icon"
      content="{
        16: '/icon-16.png',
        24: '/icon-24.png',
        ...
      }"
    />
    <meta name="manifest.open_at_install" content="true|false" />
    <meta name="manifest.browser_style" content="true|false" />

    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

在 Chrome 中，侧边面板使用 `side_panel` API，而 Firefox 使用 `sidebar_action` API。

### 未列出的 CSS（Unlisted CSS）

<EntrypointPatterns
  :patterns="[
    ['{name}.(css|scss|sass|less|styl|stylus)', '{name}.css'],
    ['{name}/index.(css|scss|sass|less|styl|stylus)', '{name}.css'],
    ['content.(css|scss|sass|less|styl|stylus)', 'content-scripts/content.css'],
    ['content/index.(css|scss|sass|less|styl|stylus)', 'content-scripts/content.css'],
    ['{name}.content.(css|scss|sass|less|styl|stylus)', 'content-scripts/{name}.css'],
    ['{name}.content/index.(css|scss|sass|less|styl|stylus)', 'content-scripts/{name}.css'],
  ]"
/>

```css
body {
  /* ... */
}
```

按照 Vite 指南设置你选择的预处理器：<https://vitejs.dev/guide/features.html#css-pre-processors>

CSS 入口点始终未列出。要将 CSS 添加到内容脚本，请参阅[内容脚本](/guide/essentials/content-scripts#css)文档。

### 未列出的页面（Unlisted Pages）

<EntrypointPatterns
  :patterns="[
    ['{name}.html', '{name}.html'],
    ['{name}/index.html', '{name}.html'],
  ]"
/>

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>标题</title>

    <!-- 设置 include/exclude 以从某些构建中移除页面 -->
    <meta name="manifest.include" content="['chrome', ...]" />
    <meta name="manifest.exclude" content="['chrome', ...]" />
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

在运行时，未列出的页面可通过 `/{name}.html` 访问：

```ts
const url = browser.runtime.getURL('/{name}.html');

console.log(url); // "chrome-extension://{id}/{name}.html"
window.open(url); // 在新标签页中打开页面
```

### 未列出的脚本（Unlisted Scripts）

<EntrypointPatterns
  :patterns="[
    ['{name}.[jt]sx?', '{name}.js'],
    ['{name}/index.[jt]sx?', '{name}.js'],
  ]"
/>

:::code-group

```ts [最简形式]
export default defineUnlistedScript(() => {
  // 脚本加载时执行
});
```

```ts [带选项]
export default defineUnlistedScript({
  // 设置 include/exclude 以从某些构建中移除脚本
  include: undefined | string[],
  exclude: undefined | string[],

  main() {
    // 脚本加载时执行
  },
});
```

:::

在运行时，未列出的脚本可通过 `/{name}.js` 访问：

```ts
const url = browser.runtime.getURL('/{name}.js');

console.log(url); // "chrome-extension://{id}/{name}.js"
```

你需要负责在需要的地方加载/运行这些脚本。如有必要，请勿忘记将脚本和/或任何相关资源添加到 [`web_accessible_resources`](https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources)。

定义未列出的脚本时，请记住 WXT 会在构建过程中在 NodeJS 环境中导入此文件。这意味着你不能在 `main` 函数之外放置任何运行时代码。

<!-- prettier-ignore -->
```ts
document.querySelectorAll('a').forEach((anchor) => { // [!code --]
  // ... // [!code --]
}); // [!code --]

export default defineUnlistedScript(() => {
  document.querySelectorAll('a').forEach((anchor) => { // [!code ++]
    // ... // [!code ++]
  }); // [!code ++]
});
```

更多详情请参阅[入口点加载器](/guide/essentials/config/entrypoint-loaders)文档。
