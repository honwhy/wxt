# 前端框架

## 内置模块

WXT 为最流行的前端框架预配置了模块：

- [`@wxt-dev/module-react`](https://github.com/wxt-dev/wxt/tree/main/packages/module-react)
- [`@wxt-dev/module-vue`](https://github.com/wxt-dev/wxt/tree/main/packages/module-vue)
- [`@wxt-dev/module-svelte`](https://github.com/wxt-dev/wxt/tree/main/packages/module-svelte)
- [`@wxt-dev/module-solid`](https://github.com/wxt-dev/wxt/tree/main/packages/module-solid)

安装你所用框架的模块，然后将其添加到配置中：

:::code-group

```ts [React]
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
});
```

```ts [Vue]
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
});
```

```ts [Svelte]
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-svelte'],
});
```

```ts [Solid]
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-solid'],
});
```

:::

## 添加 Vite 插件

如果你的框架没有官方的 WXT 模块，也没关系！WXT 支持任何带有 Vite 插件的框架。

只需将 Vite 插件添加到你的配置中即可！在 HTML 页面或内容脚本中使用该框架就能正常工作 👍

```ts
import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
});
```

> WXT 模块只是简化了配置并添加了自动导入。它们和上面的方法区别不大。

## 多应用

由于浏览器扩展通常包含多个 UI，分布在多个入口点（弹窗、选项页、更新日志、侧边栏、内容脚本等），你需要为每个入口点创建独立的应用实例。

通常，这意味着每个入口点都应该是一个包含自己文件的目录。推荐的文件夹结构如下：

<!-- prettier-ignore -->
```html
📂 {srcDir}/
   📂 assets/          <---------- 放置共享资源
      📄 tailwind.css
   📂 components/
      📄 Button.tsx
   📂 entrypoints/
      📂 options/       <--------- 用一个包含 index.html 的文件夹作为入口
         📁 pages/      <--------- 如果有路由页面，可以放在这里
         📄 index.html
         📄 App.tsx
         📄 main.tsx    <--------- 在这里创建并挂载你的应用
         📄 style.css   <--------- 入口点专属样式
         📄 router.ts
```

## 配置路由

所有框架都带有路由器，用于通过 URL 路径构建多页面应用……但浏览器扩展并不是这样工作的。由于 HTML 文件是静态的，比如 `chrome-extension://{id}/popup.html`，无法通过更改整个路径来实现路由。

因此，你需要将路由器配置为“hash”模式，将路由信息放在 URL 的 hash 部分，而不是路径（例如：`popup.html#/` 和 `popup.html#/account/settings`）。

请参考你所用路由器的文档，了解 hash 模式及其启用方式。以下是一些流行路由器的文档链接：

- [`react-router`](https://reactrouter.com/en/main/routers/create-hash-router)
- [`vue-router`](https://router.vuejs.org/guide/essentials/history-mode.html#Hash-Mode)
- [`svelte-spa-router`](https://www.npmjs.com/package/svelte-spa-router#hash-based-routing)
- [`solid-router`](https://github.com/solidjs/solid-router?tab=readme-ov-file#hash-mode-router)
