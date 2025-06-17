# 安装

全新启动一个项目，从头开始，或[迁移已有项目](/guide/resources/migrate)。

[[toc]]

## 启动项目

运行 [`init` 命令](/api/cli/wxt-init)，并按照提示操作。

:::code-group

```sh [PNPM]
pnpm dlx wxt@latest init
```

```sh [Bun]
bunx wxt@latest init
```

```sh [NPM]
npx wxt@latest init
```

```sh [Yarn]
# 初始使用 NPM，当提示选择包管理器时选择 Yarn
npx wxt@latest init
```

:::

:::info 启动模板：
[<Icon name="TypeScript" style="margin-left: 16px;" />Vanilla](https://github.com/wxt-dev/wxt/tree/main/templates/vanilla)<br/>[<Icon name="Vue" style="margin-left: 16px;" />Vue](https://github.com/wxt-dev/wxt/tree/main/templates/vue)<br/>[<Icon name="React" style="margin-left: 16px;" />React](https://github.com/wxt-dev/wxt/tree/main/templates/react)<br/>[<Icon name="Svelte" style="margin-left: 16px;" />Svelte](https://github.com/wxt-dev/wxt/tree/main/templates/svelte)<br/>[<Icon name="Solid" icon="https://www.solidjs.com/img/favicons/favicon-32x32.png"  style="margin-left: 16px;" />Solid](https://github.com/wxt-dev/wxt/tree/main/templates/solid)

<small style="opacity: 50%">所有模板默认使用 TypeScript。如需使用 JavaScript，请更改文件扩展名。</small>
:::

### 演示

![wxt init demo](/assets/init-demo.gif)

一旦你运行了 `dev` 命令，就可以继续查看 [下一步](#next-steps)！

## 从头开始

1. 创建一个新项目

2. 安装 WXT：

3. 添加一个入口文件 `my-project/entrypoints/background.ts`：

4. 在 `package.json` 中添加脚本：

   ```json [package.json]
   {
     "scripts": {
       "dev": "wxt", // [!code ++]
       "dev:firefox": "wxt -b firefox", // [!code ++]
       "build": "wxt build", // [!code ++]
       "build:firefox": "wxt build -b firefox", // [!code ++]
       "zip": "wxt zip", // [!code ++]
       "zip:firefox": "wxt zip -b firefox", // [!code ++]
       "postinstall": "wxt prepare" // [!code ++]
     }
   }
   ```

5. 在开发模式下运行你的扩展

   WXT 会自动打开浏览器窗口并安装你的扩展。

## 下一步

- 继续阅读 WXT 的[项目结构](/guide/essentials/project-structure)和其他核心概念
- 配置开发模式下的[自动启动浏览器](/guide/essentials/config/browser-startup)
- 浏览 [WXT 示例库](/examples)，学习如何使用特定 API 或完成常见任务
- 查看[社区页面](/guide/resources/community)，了解社区贡献的资源！
