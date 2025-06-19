---
outline: deep
---

# 内容脚本

> 要创建内容脚本，请参阅[入口类型](/guide/essentials/entrypoints#content-scripts)。

## 上下文

内容脚本 `main` 函数的第一个参数是其"上下文"。

```ts
// entrypoints/example.content.ts
export default defineContentScript({
  main(ctx) {},
});
```

该对象负责跟踪内容脚本的上下文是否"失效"。默认情况下，大多数浏览器在扩展被卸载、更新或禁用时不会停止内容脚本。发生这种情况时，内容脚本会报告以下错误：

```plaintext
Error: Extension context invalidated. (错误：扩展上下文已失效)
```

`ctx` 对象提供多个辅助工具，用于在上下文失效后停止异步代码运行：

```ts
ctx.addEventListener(...);
ctx.setTimeout(...);
ctx.setInterval(...);
ctx.requestAnimationFrame(...);
// 以及更多
```

您也可以手动检查上下文是否失效：

```ts
if (ctx.isValid) {
  // 执行操作
}
// 或
if (ctx.isInvalid) {
  // 执行操作
}
```

## CSS

在常规 Web 扩展中，内容脚本的 CSS 通常是单独的 CSS 文件，在 manifest 的 CSS 数组中添加：

```json
{
  "content_scripts": [
    {
      "css": ["content/style.css"],
      "js": ["content/index.js"],
      "matches": ["*://*/*"]
    }
  ]
}
```

在 WXT 中，要向内容脚本添加 CSS，只需将 CSS 文件导入 JS 入口点，WXT 会自动将打包后的 CSS 输出添加到 `css` 数组。

```ts
// entrypoints/example.content/index.ts
import './style.css';

export default defineContentScript({
  // ...
});
```

要创建仅包含 CSS 文件的独立内容脚本：

1. 创建 CSS 文件：`entrypoints/example.content.css`
2. 使用 `build:manifestGenerated` 钩子将内容脚本添加到 manifest：

   ```ts [wxt.config.ts]
   export default defineConfig({
     hooks: {
       'build:manifestGenerated': (wxt, manifest) => {
         manifest.content_scripts ??= [];
         manifest.content_scripts.push({
           // 构建一次扩展以查看 CSS 写入位置
           css: ['content-scripts/example.css'],
           matches: ['*://*/*'],
         });
       },
     },
   });
   ```

## UI

WXT 提供 3 种内置工具，用于从内容脚本向页面添加 UI：

- [集成式](#integrated) - `createIntegratedUi`
- [Shadow Root](#shadow-root) - `createShadowRootUi`
- [IFrame](#iframe) - `createIframeUi`

每种方法都有其优缺点。

| 方法        | 样式隔离 |   事件隔离    | HMR | 使用页面上下文 |
| ----------- | :------: | :-----------: | :-: | :------------: |
| 集成式      |    ❌    |      ❌       | ❌  |       ✅       |
| Shadow Root |    ✅    | ✅ (默认关闭) | ❌  |       ✅       |
| IFrame      |    ✅    |      ✅       | ✅  |       ❌       |

### 集成式

集成式内容脚本 UI 与页面内容一起注入。这意味着它们会受到该页面 CSS 的影响。

:::code-group

```ts [原生JS]
// entrypoints/example-ui.content.ts
export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 向容器添加子元素
        const app = document.createElement('p');
        app.textContent = '...';
        container.append(app);
      },
    });

    // 调用 mount 将 UI 添加到 DOM
    ui.mount();
  },
});
```

```ts [Vue]
// entrypoints/example-ui.content/index.ts
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 创建应用并挂载到 UI 容器
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // UI 移除时卸载应用
        app.unmount();
      },
    });

    // 调用 mount 将 UI 添加到 DOM
    ui.mount();
  },
});
```

```tsx [React]
// entrypoints/example-ui.content/index.tsx
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 在 UI 容器上创建根并渲染组件
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // UI 移除时卸载根
        root.unmount();
      },
    });

    // 调用 mount 将 UI 添加到 DOM
    ui.mount();
  },
});
```

```ts [Svelte]
// entrypoints/example-ui.content/index.ts
import App from './App.svelte';
import { mount, unmount } from 'svelte';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 在 UI 容器内创建 Svelte 应用
        return mount(App, { target: container });
      },
      onRemove: (app) => {
        // UI 移除时销毁应用
        unmount(app);
      },
    });

    // 调用 mount 将 UI 添加到 DOM
    ui.mount();
  },
});
```

```tsx [Solid]
// entrypoints/example-ui.content/index.ts
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 将应用渲染到 UI 容器
        const unmount = render(() => <div>...</div>, container);
        return unmount;
      },
      onRemove: (unmount) => {
        // UI 移除时卸载应用
        unmount();
      },
    });

    // 调用 mount 将 UI 添加到 DOM
    ui.mount();
  },
});
```

:::

完整选项请参阅[API 参考](/api/reference/wxt/utils/content-script-ui/integrated/functions/createIntegratedUi)。

### Shadow Root

在 Web 扩展中，通常不希望内容脚本的 CSS 影响页面，反之亦然。[`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) API 是理想选择。

WXT 的 [`createShadowRootUi`](/api/reference/wxt/utils/content-script-ui/shadow-root/functions/createShadowRootUi) 抽象了所有 `ShadowRoot` 设置，使创建样式与页面隔离的 UI 变得简单。它还支持可选的 `isolateEvents` 参数以进一步隔离用户交互。

使用 `createShadowRootUi` 的步骤：

1. 在内容脚本顶部导入 CSS 文件
2. 在 `defineContentScript` 中设置 [`cssInjectionMode: "ui"`](/api/reference/wxt/interfaces/BaseContentScriptEntrypointOptions#cssinjectionmode)
3. 使用 `createShadowRootUi()` 定义 UI
4. 挂载 UI 使其对用户可见

:::code-group

```ts [原生JS]
// 1. 导入样式
import './style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. 设置 cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. 定义 UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        // 定义 UI 如何在容器内挂载
        const app = document.createElement('p');
        app.textContent = 'Hello world!';
        container.append(app);
      },
    });

    // 4. 挂载 UI
    ui.mount();
  },
});
```

```ts [Vue]
// 1. 导入样式
import './style.css';
import { createApp } from 'vue';
import App from './App.vue';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. 设置 cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. 定义 UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 定义 UI 如何在容器内挂载
        const app = createApp(App);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // UI 移除时卸载应用
        app?.unmount();
      },
    });

    // 4. 挂载 UI
    ui.mount();
  },
});
```

```tsx [React]
// 1. 导入样式
import './style.css';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. 设置 cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. 定义 UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 容器是 body，React 在 body 上创建根时会警告，因此创建包装 div
        const app = document.createElement('div');
        container.append(app);

        // 在 UI 容器上创建根并渲染组件
        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        // UI 移除时卸载根
        root?.unmount();
      },
    });

    // 4. 挂载 UI
    ui.mount();
  },
});
```

```ts [Svelte]
// 1. 导入样式
import './style.css';
import App from './App.svelte';
import { mount, unmount } from 'svelte';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. 设置 cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. 定义 UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 在 UI 容器内创建 Svelte 应用
        return mount(App, { target: container });
      },
      onRemove: (app) => {
        // UI 移除时销毁应用
        unmount(app);
      },
    });

    // 4. 挂载 UI
    ui.mount();
  },
});
```

```tsx [Solid]
// 1. 导入样式
import './style.css';
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['<all_urls>'],
  // 2. 设置 cssInjectionMode
  cssInjectionMode: 'ui',

  async main(ctx) {
    // 3. 定义 UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // 将应用渲染到 UI 容器
        const unmount = render(() => <div>...</div>, container);
      },
      onRemove: (unmount) => {
        // UI 移除时卸载应用
        unmount?.();
      },
    });

    // 4. 挂载 UI
    ui.mount();
  },
});
```

:::

完整选项请参阅[API 参考](/api/reference/wxt/utils/content-script-ui/shadow-root/functions/createShadowRootUi)。

完整示例：

- [react-content-script-ui](https://github.com/wxt-dev/examples/tree/main/examples/react-content-script-ui)
- [tailwindcss](https://github.com/wxt-dev/examples/tree/main/examples/tailwindcss)

### IFrame

如果不需要在内容脚本的同一框架中运行 UI，可以使用 IFrame 来托管 UI。由于 IFrame 仅托管 HTML 页面，因此**_支持 HMR_**。

WXT 提供辅助函数 [`createIframeUi`](/api/reference/wxt/utils/content-script-ui/iframe/functions/createIframeUi)，简化 IFrame 设置。

1. 创建将加载到 IFrame 中的 HTML 页面：

   ```html
   <!-- entrypoints/example-iframe.html -->
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>您的内容脚本 IFrame</title>
     </head>
     <body>
       <!-- ... -->
     </body>
   </html>
   ```

1. 将页面添加到 manifest 的 `web_accessible_resources`：

   ```ts [wxt.config.ts]
   export default defineConfig({
     manifest: {
       web_accessible_resources: [
         {
           resources: ['example-iframe.html'],
           matches: [...],
         },
       ],
     },
   });
   ```

1. 创建并挂载 IFrame：

   ```ts
   export default defineContentScript({
     matches: ['<all_urls>'],

     main(ctx) {
       // 定义 UI
       const ui = createIframeUi(ctx, {
         page: '/example-iframe.html',
         position: 'inline',
         anchor: 'body',
         onMount: (wrapper, iframe) => {
           // 向 iframe 添加样式（如宽度）
           iframe.width = '123';
         },
       });

       // 向用户显示 UI
       ui.mount();
     },
   });
   ```

完整选项请参阅[API 参考](/api/reference/wxt/utils/content-script-ui/iframe/functions/createIframeUi)。

## 隔离世界 vs 主世界

默认情况下，所有内容脚本在隔离上下文中运行，其中只有 DOM 与网页共享——称为"隔离世界"。在 MV3 中，Chromium 引入了在"主"世界运行内容脚本的能力——其中所有内容（不仅仅是 DOM）对内容脚本可用，就像脚本由网页加载一样。

您可以通过设置 `world` 选项为内容脚本启用此功能：

```ts
export default defineContentScript({
  world: 'MAIN',
});
```

但此方法有几个显著缺点：

- 不支持 MV2
- `world: "MAIN"` 仅受 Chromium 浏览器支持
- 主世界内容脚本无法访问扩展 API

相反，WXT 推荐使用 `injectScript` 函数手动将脚本注入主世界。这将解决上述缺点。

- `injectScript` 同时支持 MV2 和 MV3
- `injectScript` 支持所有浏览器
- 拥有"父"内容脚本意味着可以来回发送消息，从而可以访问扩展 API

使用 `injectScript` 需要两个入口点：一个内容脚本和一个未列出的脚本：

<!-- prettier-ignore -->
```html
📂 entrypoints/
   📄 example.content.ts
   📄 example-main-world.ts
```

```ts
// entrypoints/example-main-world.ts
export default defineUnlistedScript(() => {
  console.log('来自主世界的问候');
});
```

```ts
// entrypoints/example.content.ts
export default defineContentScript({
  matches: ['*://*/*'],
  async main() {
    console.log('正在注入脚本...');
    await injectScript('/example-main-world.js', {
      keepInDom: true,
    });
    console.log('完成!');
  },
});
```

```json
export default defineConfig({
  manifest: {
    // ...
    web_accessible_resources: [
      {
        resources: ["example-main-world.js"],
        matches: ["*://*/*"],
      }
    ]
  }
});
```

`injectScript` 通过创建指向脚本的 `script` 元素来工作。这会将脚本加载到页面上下文中，使其在主世界中运行。

`injectScript` 返回一个 Promise，当解析时表示脚本已被浏览器评估，您可以开始与之通信。

:::warning 警告：`run_at` 注意事项
在 MV3 中，`injectScript` 是同步的，注入的脚本将与内容脚本的 `run_at` 同时被评估。

但在 MV2 中，`injectScript` 必须 `fetch` 脚本的文本内容并创建内联 `<script>` 块。这意味着对于 MV2，脚本是异步注入的，不会与内容脚本的 `run_at` 同时被评估。
:::

## 挂载 UI 到动态元素

在许多情况下，可能需要将 UI 挂载到初始加载页面时不存在的 DOM 元素。要处理此情况，请使用 `autoMount` API 在目标元素动态出现时自动挂载 UI，并在元素消失时卸载。在 WXT 中，`anchor` 选项用于定位元素，支持基于其出现和移除的自动挂载/卸载。

```ts
export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      // 观察锚点元素
      anchor: '#your-target-dynamic-element',
      onMount: (container) => {
        // 向容器添加子元素
        const app = document.createElement('p');
        app.textContent = '...';
        container.append(app);
      },
    });

    // 调用 autoMount 观察锚点元素的添加/移除
    ui.autoMount();
  },
});
```

:::tip
当调用 `ui.remove` 时，`autoMount` 也会停止。
:::

完整选项请参阅[API 参考](/api/reference/wxt/utils/content-script-ui/types/interfaces/ContentScriptUi#automount)。

## 处理 SPA

为 SPA（单页面应用）和使用 HTML5 history 模式导航的网站编写内容脚本很困难，因为内容脚本仅在完整页面重载时运行。SPA 和利用 HTML5 history 模式的网站在**_更改路径时不会执行完整重载_**，因此您的内容脚本不会在预期时运行。

看一个例子。假设您想在观看 YouTube 视频时添加 UI：

```ts
export default defineContentScript({
  matches: ['*://*.youtube.com/watch*'],
  main(ctx) {
    console.log('YouTube 内容脚本已加载');

    mountUi(ctx);
  },
});

function mountUi(ctx: ContentScriptContext): void {
  // ...
}
```

您只会在重新加载观看页面或直接从另一个网站导航到它时看到"YouTube 内容脚本已加载"。

要解决此问题，需要手动监听路径更改，并在 URL 匹配预期时运行内容脚本。

```ts
const watchPattern = new MatchPattern('*://*.youtube.com/watch*');

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main(ctx) {
    ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
      if (watchPattern.includes(newUrl)) mainWatch(ctx);
    });
  },
});

function mainWatch(ctx: ContentScriptContext) {
  mountUi(ctx);
}
```
