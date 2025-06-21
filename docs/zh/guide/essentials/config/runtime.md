# 运行时配置

> 此 API 仍在开发中，更多功能即将推出！

在一个地方定义运行时配置，`<srcDir>/app.config.ts`：

```ts
import { defineAppConfig } from '#imports';

// 为你的配置定义类型
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    theme?: 'light' | 'dark';
  }
}

export default defineAppConfig({
  theme: 'dark',
});
```

:::warning
此文件会被提交到仓库，因此不要在这里放任何密钥。请使用 [环境变量](/guide/essentials/config/environment-variables)。
:::

要访问运行时配置，WXT 提供了 `useAppConfig` 函数：

```ts
import { useAppConfig } from '#imports';

console.log(useAppConfig()); // { theme: "dark" }
```

## 在 App Config 中使用环境变量

你可以在 `app.config.ts` 文件中使用环境变量。

```ts
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    apiKey?: string;
    skipWelcome: boolean;
  }
}

export default defineAppConfig({
  apiKey: import.meta.env.WXT_API_KEY,
  skipWelcome: import.meta.env.WXT_SKIP_WELCOME === 'true',
});
```

这样做有几个优点：

- 在一个文件中定义所有期望的环境变量
- 将字符串转换为其他类型，如布尔值或数组
- 如果没有提供环境变量，可以设置默认值
