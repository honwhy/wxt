# 针对不同浏览器进行构建

使用 WXT 构建扩展时，你可以为不同的浏览器和清单（manifest）版本创建多个构建版本。

## 针对特定浏览器

使用 `-b` CLI 标志为特定浏览器创建单独的扩展构建。默认情况下，目标是 `chrome`。

```sh
wxt            # 等同于: wxt -b chrome
wxt -b firefox
wxt -b custom
```

在开发过程中，如果你指定了 Firefox 作为目标，Firefox 会被打开。其他字符串默认会打开 Chrome。如需自定义打开哪些浏览器，请参阅 [设置浏览器二进制文件](/guide/essentials/config/browser-startup#set-browser-binaries)。

此外，WXT 在运行时定义了多个常量，你可以用来检测当前使用的是哪个浏览器：

```ts
if (import.meta.env.BROWSER === 'firefox') {
  console.log('仅在 Firefox 构建中执行某些操作');
}
if (import.meta.env.FIREFOX) {
  // 简写，与上面的 if 语句等价
}
```

更多详情请阅读 [内置环境变量](/guide/essentials/config/environment-variables.html#built-in-environment-variables)。

## 针对特定 Manifest 版本

如需针对特定的 manifest 版本进行构建，请使用 `--mv2` 或 `--mv3` CLI 标志。

:::tip 默认 Manifest 版本
默认情况下，WXT 会为 Safari 和 Firefox 目标构建 MV2，为所有其他浏览器构建 MV3。
:::

与浏览器类似，你可以在运行时通过 [内置环境变量](/guide/essentials/config/environment-variables.html#built-in-environment-variables) 获取目标 manifest 版本：

```ts
if (import.meta.env.MANIFEST_VERSION === 2) {
  console.log('仅在 MV2 构建中执行某些操作');
}
```

## 过滤入口文件

每个入口文件都可以通过 `include` 和 `exclude` 选项，在针对特定浏览器构建时进行包含或排除。

以下是一些示例：

- 仅在目标为 `firefox` 时构建内容脚本：

  ```ts
  export default defineContentScript({
    include: ['firefox'],

    main(ctx) {
      // ...
    },
  });
  ```

- 仅为除 `chrome` 以外的所有目标构建 HTML 文件：

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="manifest.exclude" content="['chrome', ...]" />
    </head>
    <body>
      <!-- ... -->
    </body>
  </html>
  ```

另外，你也可以使用 [`filterEntrypoints` 配置](/api/reference/wxt/interfaces/InlineConfig#filterentrypoints) 来列出你想要构建的所有入口文件。
