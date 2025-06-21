# 环境变量

## Dotenv 文件

WXT 支持与 [Vite 相同方式的 dotenv 文件](https://vite.dev/guide/env-and-mode.html#env-files)。你可以创建如下任意文件：

```plaintext
.env
.env.local
.env.[mode]
.env.[mode].local
.env.[browser]
.env.[browser].local
.env.[mode].[browser]
.env.[mode].[browser].local
```

这些文件中定义的环境变量都可以在运行时获取：

```sh
# .env
WXT_API_KEY=...
```

```ts
await fetch(`/some-api?apiKey=${import.meta.env.WXT_API_KEY}`);
```

请记得为你的环境变量加上 `WXT_` 或 `VITE_` 前缀，否则它们不会在运行时可用，这是 [Vite 的约定](https://vite.dev/guide/env-and-mode.html#env-files)。

## 内置环境变量

WXT 根据当前命令提供了一些自定义环境变量：

| 用法                               | 类型      | 说明                                           |
| ---------------------------------- | --------- | ---------------------------------------------- |
| `import.meta.env.MANIFEST_VERSION` | `2 │ 3`   | 目标 manifest 版本                             |
| `import.meta.env.BROWSER`          | `string`  | 目标浏览器                                     |
| `import.meta.env.CHROME`           | `boolean` | 等价于 `import.meta.env.BROWSER === "chrome"`  |
| `import.meta.env.FIREFOX`          | `boolean` | 等价于 `import.meta.env.BROWSER === "firefox"` |
| `import.meta.env.SAFARI`           | `boolean` | 等价于 `import.meta.env.BROWSER === "safari"`  |
| `import.meta.env.EDGE`             | `boolean` | 等价于 `import.meta.env.BROWSER === "edge"`    |
| `import.meta.env.OPERA`            | `boolean` | 等价于 `import.meta.env.BROWSER === "opera"`   |

你可以设置 [`targetBrowsers`](/api/reference/wxt/interfaces/InlineConfig#targetbrowsers) 选项，让 `BROWSER` 变量变成更具体的类型，比如 `"chrome" | "firefox"`。

你还可以访问所有 [Vite 的环境变量](https://vite.dev/guide/env-and-mode.html#env-variables)：

| 用法                   | 类型      | 说明                                                       |
| ---------------------- | --------- | ---------------------------------------------------------- |
| `import.meta.env.MODE` | `string`  | 扩展程序运行的 [模式](/guide/essentials/config/build-mode) |
| `import.meta.env.PROD` | `boolean` | 当 `NODE_ENV='production'` 时为真                          |
| `import.meta.env.DEV`  | `boolean` | 与 `import.meta.env.PROD` 相反                             |

:::details 其他 Vite 环境变量
Vite 还提供了另外两个环境变量，但在 WXT 项目中并不实用：

- `import.meta.env.BASE_URL`：请使用 `browser.runtime.getURL` 替代。
- `import.meta.env.SSR`：始终为 `false`。
  :::

## Manifest

要在 manifest 中使用环境变量，需要使用函数语法：

```ts
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: { // [!code --]
    oauth2: { // [!code --]
      client_id: import.meta.env.WXT_APP_CLIENT_ID // [!code --]
    } // [!code --]
  } // [!code --]
  manifest: () => ({ // [!code ++]
    oauth2: { // [!code ++]
      client_id: import.meta.env.WXT_APP_CLIENT_ID // [!code ++]
    } // [!code ++]
  }), // [!code ++]
});
```

WXT 只有在配置文件加载后才能读取你的 `.env` 文件。因此通过 manifest 的函数语法，可以等到 `.env` 文件加载进进程后再创建对象。

注意，Vite 的运行时环境变量（如 `import.meta.env.DEV`）不会被定义。你可以这样获取 mode：

```ts
export default defineConfig({
  manifest: ({ mode }) => {
    const isDev = mode === 'development';
    console.log('是否开发模式:', isDev);

    // ...
  },
});
```
