# Vite

WXT 在底层使用 [Vite](https://vitejs.dev/) 来打包你的扩展程序。

本页将介绍如何自定义你项目的 Vite 配置。更多关于配置打包工具的信息，请参考 [Vite 官方文档](https://vite.dev/config/)。

:::tip
大多数情况下，你无需更改 Vite 的构建设置。WXT 已经提供了合理的默认值，能够输出所有应用商店都接受的有效扩展包。
:::

## 修改 Vite 配置

你可以通过 `wxt.config.ts` 文件修改 Vite 配置：

```ts [wxt.config.ts]
import { defineConfig } from 'wxt';

export default defineConfig({
  vite: () => ({
    // 在这里覆盖配置，写法与 vite.config.ts 文件中的 defineConfig({ ... }) 相同
  }),
});
```

## 添加 Vite 插件

要添加插件，先安装对应的 NPM 包，然后将其添加到 Vite 配置中：

```ts [wxt.config.ts]
import { defineConfig } from 'wxt';
import VueRouter from 'unplugin-vue-router/vite';

export default defineConfig({
  vite: () => ({
    plugins: [
      VueRouter({
        /* ... */
      }),
    ],
  }),
});
```

:::warning
由于 WXT 协调 Vite 构建的方式，有些插件可能无法按预期工作。例如，`vite-plugin-remove-console` 通常只会在生产环境构建（`vite build`）时运行。然而，WXT 在开发期间会结合使用 dev server 和 build，因此你需要手动指定插件的运行时机：

```ts [wxt.config.ts]
import { defineConfig } from 'wxt';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  vite: (configEnv) => ({
    plugins:
      configEnv.mode === 'production'
        ? [removeConsole({ includes: ['log'] })]
        : [],
  }),
});
```

如果你在使用某个插件时遇到问题，可以在 [GitHub issues](https://github.com/wxt-dev/wxt/issues?q=is%3Aissue+label%3A%22vite+plugin%22) 搜索相关问题。

如果没有找到相关问题，请[新建一个 issue](https://github.com/wxt-dev/wxt/issues/new/choose)。
:::
