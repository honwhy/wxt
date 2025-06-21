# TypeScript 配置

当你运行 [`wxt prepare`](/api/cli/wxt-prepare) 时，WXT 会在你的项目根目录下生成一个基础的 TSConfig 文件，路径为 `<rootDir>/.wxt/tsconfig.json`。

至少，你需要在根目录下创建一个 TSConfig 文件，如下所示：

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json",
}
```

如果你在一个 monorepo 中，你可能不想继承该配置。如果你不继承它，你需要将 `.wxt/wxt.d.ts` 添加到 TypeScript 项目中：

```ts
/// <reference path="./.wxt/wxt.d.ts" />
```

## 编译器选项

如需指定自定义编译器选项，请在 `<rootDir>/tsconfig.json` 中添加：

```jsonc
// <rootDir>/tsconfig.json
{
  "extends": ".wxt/tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve",
  },
}
```

## TSConfig 路径别名

WXT 提供了一组默认的路径别名。

| 别名 | 指向          | 示例                                            |
| ---- | ------------- | ----------------------------------------------- |
| `~~` | `<rootDir>/*` | `import "~~/scripts"`                           |
| `@@` | `<rootDir>/*` | `import "@@/scripts"`                           |
| `~`  | `<srcDir>/*`  | `import { toLowerCase } from "~/utils/strings"` |
| `@`  | `<srcDir>/*`  | `import { toLowerCase } from "@/utils/strings"` |

如需添加自定义别名，**不要**将它们添加到你的 `tsconfig.json`！请在 `wxt.config.ts` 中使用 [`alias` 选项](/api/reference/wxt/interfaces/InlineConfig#alias)。

下次运行 `wxt prepare` 时，这会将你的自定义别名添加到 `<rootDir>/.wxt/tsconfig.json`。它还会将你的别名添加到打包工具中，以便解析导入。

```ts
import { resolve } from 'node:path';

export default defineConfig({
  alias: {
    // 目录：
    testing: resolve('utils/testing'),
    // 文件：
    strings: resolve('utils/strings.ts'),
  },
});
```

```ts
import { fakeTab } from 'testing/fake-objects';
import { toLowerCase } from 'strings';
```
