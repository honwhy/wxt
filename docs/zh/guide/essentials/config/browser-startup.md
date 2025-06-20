---
outline: deep
---

# 浏览器启动

> 完整配置列表请参阅 [API 参考文档](/api/reference/wxt/interfaces/WebExtConfig)。

在开发过程中，WXT 使用 Mozilla 的 [`web-ext`](https://www.npmjs.com/package/web-ext) 自动打开已安装扩展的浏览器窗口。

## 配置文件

你可以在 3 个位置配置浏览器启动：

1. `<rootDir>/web-ext.config.ts`：此文件会被版本控制系统忽略，允许你为特定项目配置自定义选项而不影响其他开发者

   ```ts [web-ext.config.ts]
   import { defineWebExtConfig } from 'wxt';

   export default defineWebExtConfig({
     // ...
   });
   ```

2. `<rootDir>/wxt.config.ts`：通过 [`webExt` 配置项](/api/reference/wxt/interfaces/InlineConfig#webext)，此文件包含在版本控制中
3. `$HOME/web-ext.config.ts`：为你计算机上的所有 WXT 项目提供默认值

## 实用方案

### 设置浏览器可执行文件

设置或自定义开发期间打开的浏览器：

```ts [web-ext.config.ts]
export default defineWebExtConfig({
  binaries: {
    chrome: '/path/to/chrome-beta', // 使用 Chrome Beta 版替代常规 Chrome
    firefox: 'firefoxdeveloperedition', // 使用 Firefox 开发者版替代常规 Firefox
    edge: '/path/to/edge', // 运行 "wxt -b edge" 时打开 Microsoft Edge
  },
});
```

默认情况下，WXT 会尝试自动发现 Chrome/Firefox 的安装位置。但如果 Chrome 安装在非标准位置，则需要如上所示手动设置。

### 持久化数据

默认情况下，为避免修改浏览器现有配置文件，`web-ext` 每次运行 `dev` 脚本时都会创建全新的配置文件。

目前只有基于 Chromium 的浏览器支持覆盖此行为，并在多次运行 `dev` 脚本时持久化数据。

要持久化数据，请设置 `--user-data-dir` 标志：

:::code-group

```ts [Mac/Linux]
export default defineWebExtConfig({
  chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
});
```

```ts [Windows]
import { resolve } from 'node:path';

export default defineWebExtConfig({
  // Windows 上路径必须是绝对路径
  chromiumProfile: resolve('.wxt/chrome-data'),
  keepProfileChanges: true,
});
```

:::

现在，下次运行 `dev` 脚本时，将在 `.wxt/chrome-data/{profile-name}` 中创建持久化配置文件。使用持久化配置文件，你可以安装开发工具扩展辅助开发，让浏览器记住登录信息等，而无需担心下次运行 `dev` 脚本时配置文件被重置。

:::tip
你可以为 `--user-data-dir` 使用任意目录，上面的示例为每个 WXT 项目创建了持久化配置文件。要为所有 WXT 项目创建配置文件，可以将 `chrome-data` 目录放在用户主目录下。
:::

### 禁用自动打开浏览器

如果更喜欢手动将扩展加载到浏览器中，可以禁用自动打开行为：

```ts [web-ext.config.ts]
export default defineWebExtConfig({
  disabled: true,
});
```
