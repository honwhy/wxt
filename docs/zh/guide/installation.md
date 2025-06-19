# 安装

引导一个新项目、从头开始，或[迁移现有项目](/guide/resources/migrate)。

[[toc]]

## 引导项目

运行[`init`命令](/api/cli/wxt-init)，并按照提示操作。

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
# 初始使用 NPM，但提示时选择 Yarn
npx wxt@latest init
```

:::

:::info 入门模板：
[<Icon name="TypeScript" style="margin-left: 16px;" />原生开发](https://github.com/wxt-dev/wxt/tree/main/templates/vanilla)<br/>[<Icon name="Vue" style="margin-left: 16px;" />Vue](https://github.com/wxt-dev/wxt/tree/main/templates/vue)<br/>[<Icon name="React" style="margin-left: 16px;" />React](https://github.com/wxt-dev/wxt/tree/main/templates/react)<br/>[<Icon name="Svelte" style="margin-left: 16px;" />Svelte](https://github.com/wxt-dev/wxt/tree/main/templates/svelte)<br/>[<Icon name="Solid" icon="https://www.solidjs.com/img/favicons/favicon-32x32.png" style="margin-left: 16px;" />Solid](https://github.com/wxt-dev/wxt/tree/main/templates/solid)

<small style="opacity: 50%">所有模板默认使用 TypeScript。如需使用 JavaScript，请更改文件扩展名。</small>
:::

### 演示

![wxt init 演示](/assets/init-demo.gif)

运行 `dev` 命令后，继续[后续步骤](#next-steps)！

## 从头开始

1. 创建新项目
   :::code-group

   ```sh [PNPM]
   cd my-project
   pnpm init
   ```

   ```sh [Bun]
   cd my-project
   bun init
   ```

   ```sh [NPM]
   cd my-project
   npm init
   ```

   ```sh [Yarn]
   cd my-project
   yarn init
   ```

   :::

2. 安装 WXT：
   :::code-group

   ```sh [PNPM]
   pnpm i -D wxt
   ```

   ```sh [Bun]
   bun i -D wxt
   ```

   ```sh [NPM]
   npm i -D wxt
   ```

   ```sh [Yarn]
   yarn add --dev wxt
   ```

   :::

3. 添加入口点 `my-project/entrypoints/background.ts`：
   :::code-group

   ```ts
   export default defineBackground(() => {
     console.log('Hello world!');
   });
   ```

   :::

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

5. 在开发模式下运行扩展
   :::code-group

   ```sh [PNPM]
   pnpm dev
   ```

   ```sh [Bun]
   bun run dev
   ```

   ```sh [NPM]
   npm run dev
   ```

   ```sh [Yarn]
   yarn dev
   ```

   :::
   WXT 将自动打开已安装您扩展的浏览器窗口。

## 后续步骤

- 继续阅读 WXT 的[项目结构](/guide/essentials/project-structure)和其他核心概念
- 配置开发模式下[浏览器自动启动](/guide/essentials/config/browser-startup)
- 探索 [WXT 示例库](/examples)了解特定 API 的使用方法或常见任务
- 查看[社区资源页](/guide/resources/community)获取社区制作的资源列表！
