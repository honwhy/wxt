# 资源文件

## `/assets` 目录

所有在 `<srcDir>/assets/` 目录内导入或引用的资源文件都将经过 WXT 构建工具的处理。

访问方式如下：

:::code-group

```ts [JavaScript]
import imageUrl from '~/assets/image.png';

const img = document.createElement('img');
img.src = imageUrl;
```

```html [HTML]
<!-- 在 HTML 标签中必须使用相对路径 -->
<img src="../assets/image.png" />
```

```css [CSS]
.bg-image {
  background-image: url(~/assets/image.png);
}
```

```vue [Vue]
<script>
import image from '~/assets/image.png';
</script>

<template>
  <img :src="image" />
</template>
```

```jsx [JSX]
import image from '~/assets/image.png';

<img src={image} />;
```

:::

## `/public` 目录

`<rootDir>/public/` 内的文件会直接复制到输出目录，不经过 WXT 构建工具处理。

访问方式如下：

:::code-group

```ts [JavaScript]
import imageUrl from '/image.png';

const img = document.createElement('img');
img.src = imageUrl;
```

```html [HTML]
<img src="/image.png" />
```

```css [CSS]
.bg-image {
  background-image: url(/image.png);
}
```

```vue [Vue]
<template>
  <img src="/image.png" />
</template>
```

```jsx [JSX]
<img src="/image.png" />
```

:::

:::warning
默认情况下，内容脚本(content scripts) **_无法_** 访问 `public/` 目录的资源。要在内容脚本中使用公共资源，必须将其添加到清单文件的 [`web_accessible_resources` 数组](/api/reference/wxt/type-aliases/UserManifest#web-accessible-resources)中。
:::

## 在内容脚本中使用资源

内容脚本中的资源处理方式有所不同。默认导入资源时仅返回资源路径，因为 Vite 假设您从相同域名加载资源。

但在内容脚本中，域名由浏览器标签页决定。若尝试获取资源（手动加载或作为 `<img>` 的 `src`），系统会从标签页网站加载，而非您的扩展程序。

解决方法：使用 `browser.runtime.getURL` 将路径转为完整 URL：

```ts [entrypoints/content.ts]
import iconUrl from '/icon/128.png';

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log(iconUrl); // "/icon/128.png"
    console.log(browser.runtime.getURL(iconUrl)); // "chrome-extension://<id>/icon/128.png"
  },
});
```

## WASM 文件处理

`.wasm` 文件的加载方式因包而异，但基本流程相似：通过 JS API 加载并执行 `.wasm` 文件。

在扩展程序中需注意两点：

1. 需将 `.wasm` 文件复制到输出目录以供加载
2. 必须导入 JS API 来加载初始化 `.wasm` 文件（通常由 NPM 包提供）

### 实战示例

假设内容脚本需要将 TS 代码解析为 AST，我们使用 [`@oxc-parser/wasm`](https://www.npmjs.com/package/@oxc-parser/wasm)：

#### 步骤 1：复制 WASM 文件

通过 [WXT 模块](/guide/essentials/wxt-modules)复制文件：

```ts
// modules/oxc-parser-wasm.ts
import { resolve } from 'node:path';

export default defineWxtModule((wxt) => {
  wxt.hook('build:publicAssets', (_, assets) => {
    assets.push({
      absoluteSrc: resolve(
        'node_modules/@oxc-parser/wasm/web/oxc_parser_wasm_bg.wasm',
      ),
      relativeDest: 'oxc_parser_wasm_bg.wasm',
    });
  });
});
```

运行 `wxt build` 后，WASM 文件将出现在 `.output/chrome-mv3` 目录！

#### 步骤 2：配置可访问资源

添加至 `web_accessible_resources`：

```ts [wxt.config.ts]
export default defineConfig({
  manifest: {
    web_accessible_resources: [
      {
        matches: ['*://*.github.com/*'],
        resources: ['/oxc_parser_wasm_bg.wasm'],
      },
    ],
  },
});
```

#### 步骤 3：加载并初始化 WASM

在内容脚本中执行：

```ts [entrypoints/content.ts]
import initWasm, { parseSync } from '@oxc-parser/wasm';

export default defineContentScript({
  matches: '*://*.github.com/*',
  async main(ctx) {
    if (!location.pathname.endsWith('.ts')) return;

    // 从 GitHub 获取代码文本
    const code = document.getElementById(
      'read-only-cursor-text-area',
    )?.textContent;
    if (!code) return;
    const sourceFilename = document.getElementById('file-name-id')?.textContent;
    if (!sourceFilename) return;

    // 加载 WASM 文件
    await initWasm({
      module_or_path: browser.runtime.getURL('/oxc_parser_wasm_bg.wasm'),
    });

    // 加载完成后即可使用解析功能
    const ast = parseSync(code, { sourceFilename });
    console.log(ast);
  },
});
```

> 关键差异：在扩展程序中必须显式传递 WASM 文件的完整 URL（通过 `browser.runtime.getURL` 获取），而标准 Web 项目通常使用默认路径。

运行扩展后，即可看到 OXC 成功解析 TS 文件！
