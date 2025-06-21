# 自动导入（Auto-imports）

WXT 使用了和 Nuxt 相同的工具 [`unimport`](https://www.npmjs.com/package/unimport) 来实现自动导入。

```ts
export default defineConfig({
  // 参见 https://www.npmjs.com/package/unimport#configurations
  imports: {
    // ...
  },
});
```

默认情况下，WXT 会自动为它自己的所有 API 以及你项目中的部分目录设置自动导入：

- `<srcDir>/components/*`
- `<srcDir>/composables/*`
- `<srcDir>/hooks/*`
- `<srcDir>/utils/*`

这些目录下文件的所有具名和默认导出都可以在项目的其他地方直接使用，无需手动导入。

要查看完整的自动导入 API 列表，可以运行 [`wxt prepare`](/api/cli/wxt-prepare) 并查看你项目中的 `.wxt/types/imports-module.d.ts` 文件。

## TypeScript

为了让 TypeScript 和你的编辑器识别自动导入的变量，你需要运行 [`wxt prepare` 命令](/api/cli/wxt-prepare)。

建议将该命令添加到你的 `postinstall` 脚本中，这样在安装依赖后编辑器就能正确识别类型错误：

```jsonc
// package.json
{
  "scripts": {
    "postinstall": "wxt prepare", // [!code ++]
  },
}
```

## ESLint

ESLint 默认并不知道自动导入的变量，除非你在 ESLint 的 `globals` 中显式定义。WXT 会在检测到你的项目安装了 ESLint 时自动生成相关配置。如果没有自动生成，你也可以手动让 WXT 生成。

:::code-group

```ts [ESLint 9]
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
});
```

```ts [ESLint 8]
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 8,
    },
  },
});
```

:::

然后在你的 ESLint 配置中引入并使用生成的文件：

:::code-group

```js [ESLint 9]
// eslint.config.mjs
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default [
  autoImports,
  {
    // 你的其他配置...
  },
];
```

```js [ESLint 8]
// .eslintrc.mjs
export default {
  extends: ['./.wxt/eslintrc-auto-import.json'],
  // 你的其他配置...
};
```

:::

## 禁用自动导入

并不是所有开发者都喜欢自动导入。要禁用自动导入，只需将 `imports` 设置为 `false`。

```ts
export default defineConfig({
  imports: false, // [!code ++]
});
```

## 显式导入（`#imports`）

你可以通过 `#imports` 模块手动导入 WXT 的所有 API：

```ts
import {
  createShadowRootUi,
  ContentScriptContext,
  MatchPattern,
} from '#imports';
```

想了解 `#imports` 模块的更多信息，请阅读[相关博客文章](/blog/2024-12-06-using-imports-module)。

如果你禁用了自动导入，仍然建议通过 `#imports` 从同一个地方导入所有 API。
