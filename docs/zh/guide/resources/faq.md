---
outline: false
---

# 常见问题（FAQ）

关于如何使用 WXT 或其行为方式的常见问题。

[[toc]]

## 为什么内容脚本没有被添加到 manifest？

在开发过程中，WXT 会动态注册内容脚本，这样当你保存文件时可以单独重新加载内容脚本，而无需重新加载整个扩展。

要列出开发期间注册的内容脚本，请打开 service worker 的控制台并运行：

```js
await chrome.scripting.getRegisteredContentScripts();
```

## 如何在开发时禁用自动打开浏览器？

参见 <https://wxt.dev/guide/essentials/config/browser-startup.html#disable-opening-browser>

## 如何在开发时保持登录状态？

参见 <https://wxt.dev/guide/essentials/config/browser-startup.html#persist-data>

## 我的组件库在内容脚本中无法正常工作

当你使用 `createShadowRootUi` 时，通常有两个原因（或两者兼有）导致此问题：

1. 样式被添加到了 `ShadowRoot` 之外

   :::details
   一些组件库会通过添加 `<style>` 或 `<link>` 元素手动将 CSS 添加到页面。它们默认将该元素放在文档的 `<head>` 中。这会导致你的样式被放在 `ShadowRoot` 之外，而其隔离性会阻止样式应用到你的 UI 上。

   当库这样做时，**你需要告诉库将样式放在哪里**。以下是一些流行组件库的相关文档：

   - Ant Design: [`StyleProvider`](https://ant.design/docs/react/compatible-style#shadow-dom-usage)
   - Mantine: [`MantineProvider#getRootElement` 和 `MantineProvider#cssVariablesSelector`](https://mantine.dev/theming/mantine-provider/)

   > 如果你的库不在上面列表中，请尝试在其文档/issue 中搜索“shadow root”、“shadow dom”或“css container”。并非所有库都支持 shadow DOM，你可能需要提交 issue 请求此功能。

   下面是配置 Antd 样式的示例：

   ```tsx
   import { StyleProvider } from '@ant-design/cssinjs';
   import ReactDOM from 'react-dom/client';
   import App from './App.tsx';

   const ui = await create`ShadowRoot`Ui(ctx, {
     // ...
     onMount: (container, shadow) => {
       const cssContainer = shadow.querySelector('head')!;
       const root = ReactDOM.createRoot(container);
       root.render(
         <StyleProvider container={cssContainer}>
           <App />
         </StyleProvider>,
       );
       return root;
     },
   });
   ```

   :::

2. UI 元素被添加到了 `ShadowRoot` 之外

   ::::::details
   这通常是由于 `Teleport` 或 `Portal` 组件导致的，它们会将元素渲染到 DOM 的其他地方，通常是在文档的 `<body>` 中。这通常用于对话框或弹出组件。这样渲染的元素就在 `ShadowRoot` 之外，因此样式不会被应用。

   要解决此问题，**你需要同时为你的应用提供目标，并将目标传递给 `Teleport`/`Portal`**。

   首先，存储对 `ShadowRoot` 的 `<body>` 元素（不是文档的 `<body>`）的引用：

   :::code-group

   ```ts [Vue]
   import { createApp } from 'vue';
   import App from './App.vue';

   const ui = await create`ShadowRoot`Ui(ctx, {
     // ...
     onMount: (container, shadow) => {
       const teleportTarget = shadow.querySelector('body')!;
       const app = createApp(App)
         .provide('TeleportTarget', teleportTarget)
         .mount(container);
       return app;
     },
   });
   ui.mount();
   ```

   ```tsx [React]
   // hooks/PortalTargetContext.ts
   import { createContext } from 'react';

   export const PortalTargetContext = createContext<HTMLElement>();

   // entrypoints/example.content.ts
   import ReactDOM from 'react-dom/client';
   import App from './App.tsx';
   import PortalTargetContext from '~/hooks/PortalTargetContext';

   const ui = await create`ShadowRoot`Ui(ctx, {
     // ...
     onMount: (container, shadow) => {
       const portalTarget = shadow.querySelector('body')!;
       const root = ReactDOM.createRoot(container);
       root.render(
         <PortalTargetContext.Provider value={portalTarget}>
           <App />
         </PortalTargetContext.Provider>,
       );
       return root;
     },
   });
   ui.mount();
   ```

   :::

   然后在将 UI 的一部分传送/挂载到 DOM 的其他位置时使用该引用：

   :::code-group

   ```vue [Vue]
   <script lang="ts" setup>
   import { Teleport } from 'vue';

   const teleportTarget = inject('TeleportTarget');
   </script>

   <template>
     <div>
       <Teleport :to="teleportTarget">
         <dialog>My dialog</dialog>
       </Teleport>
     </div>
   </template>
   ```

   ```tsx [React]
   import { useContext } from 'react';
   import { createPortal } from 'react-dom';
   import PortalTargetContext from '~/hooks/PortalTargetContext';

   const MyComponent = () => {
     const portalTarget = useContext(PortalTargetContext);

     return <div>{createPortal(<dialog>My dialog</dialog>, portalTarget)}</div>;
   };
   ```

   :::

   如果你使用 ShadCN，[请参见这篇博客](https://aabidk.dev/blog/building-modern-cross-browser-web-extensions-content-scripts-and-ui/#using-radixui-portals-to-move-the-dialog-to-shadow-dom)。

   ::::::

这两个问题的根本原因相同：库将某些内容放在了 `ShadowRoot` 之外，而 `ShadowRoot` 的隔离性阻止了 CSS 应用于你的 UI。

这两个问题的解决方法也相同：告诉库将元素放在 `ShadowRoot` 内部，而不是外部。详见上文的具体说明和每个问题的示例修复方法。

## 有训练自 WXT 文档的 LLM 可以聊天吗？

有！页面右下角有“Ask AI”按钮，试试看！或者访问 <https://knowledge.wxt.dev/> 获得全屏体验。

此外，如果你想训练自己的模型或为编辑器提供上下文，可以使用本站托管的 LLM 知识文件：

<https://wxt.dev/knowledge/index.json>

你无需爬取整个网站，这些文件已经包含了用于训练 WXT LLM 的所有相关文档。当然你也可以自行爬取并生成自己的文件！

## 如何用 docker / [devcontainers](https://containers.dev) 运行我的 WXT 项目？

要在 devcontainer 中运行 WXT 开发服务器，并在浏览器中加载你的扩展开发版本：

1. **将你的项目目录绑定挂载到主机**
   如果你使用 VS Code，可以通过 `Dev Containers: Open Folder in Container...` 命令在容器中打开你的项目文件夹。这样可以保证该文件夹在主机和 devcontainer 之间同步，确保扩展的 `dist` 目录对主机可见。

2. **禁用自动打开浏览器**
   WXT 在开发时会自动打开浏览器，但由于你在容器中运行，它无法访问主机浏览器。请按照 [此处指南](https://wxt.dev/guide/essentials/config/browser-startup.html#disable-opening-browser) 在你的 `wxt.config.ts` 中禁用自动打开浏览器。

3. **让 WXT 监听所有网络接口**
   为了启用热重载，你的扩展需要连接到运行在容器内的 WXT 开发服务器。WXT 默认只监听 `localhost`，这会阻止来自 devcontainer 外部的连接。你可以通过 `wxt --host 0.0.0.0` 指定 WXT 监听所有接口来解决此问题。
