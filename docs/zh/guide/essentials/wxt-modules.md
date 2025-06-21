# WXT 模块

WXT 提供了一个“模块系统”，允许你在构建流程的不同阶段运行代码以进行修改。

[[toc]]

## 添加模块

有两种方式可以向你的项目添加模块：

1. **NPM**：安装一个 NPM 包，比如 [`@wxt-dev/auto-icons`](https://www.npmjs.com/package/@wxt-dev/auto-icons)，并将其添加到你的配置中：

   ```ts [wxt.config.ts]
   export default defineConfig({
     modules: ['@wxt-dev/auto-icons'],
   });
   ```

   > 在 NPM 上搜索 ["wxt module"](https://www.npmjs.com/search?q=wxt%20module) 是查找已发布 WXT 模块的好方法。

2. **本地**：在项目的 `modules/` 目录下添加一个文件：

   ```plaintext
   <rootDir>/
     modules/
       my-module.ts
   ```

   > 想了解如何编写自己的模块，请阅读 [编写模块](/guide/essentials/wxt-modules) 文档。

## 模块选项

WXT 模块可能需要或允许设置自定义选项来改变其行为。选项分为两类：

1. **构建时**：在构建过程中使用的任何配置，比如功能开关
2. **运行时**：在运行时访问的任何配置，比如回调函数

构建时选项放在你的 `wxt.config.ts` 中，而运行时选项放在 [`app.config.ts` 文件](/guide/essentials/config/runtime) 中。具体每个模块需要哪些选项以及放在哪里，请参考各模块的文档。

如果你使用 TypeScript，模块会增强 WXT 的类型，因此如果选项缺失或不正确会有类型错误。

## 执行顺序

模块的加载顺序与钩子的执行顺序一致。详情请参考 [钩子文档](/guide/essentials/config/hooks#execution-order)。

## 编写模块

下面是一个基础的 WXT 模块示例：

```ts
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    // 你的模块代码...
  },
});
```

每个模块的 setup 函数会在 `wxt.config.ts` 文件加载后执行。`wxt` 对象提供了编写模块所需的一切：

- 使用 `wxt.hook(...)` 钩入构建生命周期并进行修改
- 使用 `wxt.config` 获取项目 `wxt.config.ts` 文件的解析配置
- 使用 `wxt.logger` 向控制台输出日志
- 以及更多！

完整属性和函数列表请参考 [API 参考](/api/reference/wxt/interfaces/Wxt)。

另外一定要阅读所有 [可用钩子](https://wxt.dev/api/reference/wxt/interfaces/WxtHooks) 的介绍——它们对编写模块至关重要。

### 配方

模块较为复杂，需要对 WXT 的代码和工作原理有更深入的理解。最好的学习方式是看示例。

#### 更新解析配置

```ts
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('config:resolved', () => {
      wxt.config.outDir = 'dist';
    });
  },
});
```

#### 添加构建时配置

```ts
import { defineWxtModule } from 'wxt/modules';
import 'wxt';

export interface MyModuleOptions {
  // 在这里添加你的构建时选项...
}
declare module 'wxt' {
  export interface InlineConfig {
    // 为 wxt.config.ts 中的 "myModule" 键添加类型
    myModule: MyModuleOptions;
  }
}

export default defineWxtModule<AnalyticModuleOptions>({
  configKey: 'myModule',

  // 构建时配置通过 setup 的第二个参数获取
  setup(wxt, options) {
    console.log(options);
  },
});
```

#### 添加运行时配置

```ts
import { defineWxtModule } from 'wxt/modules';
import 'wxt/utils/define-app-config';

export interface MyModuleRuntimeOptions {
  // 在这里添加你的运行时选项...
}
declare module 'wxt/utils/define-app-config' {
  export interface WxtAppConfig {
    myModule: MyModuleOptions;
  }
}
```

运行时选项可通过如下方式获取

```ts
const config = useAppConfig();
console.log(config.myModule);
```

这在[生成运行时代码](#generate-runtime-module)时非常有用。

#### 生成输出文件

```ts
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    // 相对于输出目录
    const generatedFilePath = 'some-file.txt';

    wxt.hook('build:publicAssets', (_, assets) => {
      assets.push({
        relativeDest: generatedFilePath,
        contents: 'some generated text',
      });
    });

    wxt.hook('build:manifestGenerated', (_, manifest) => {
      manifest.web_accessible_resources ??= [];
      manifest.web_accessible_resources.push({
        matches: ['*://*'],
        resources: [generatedFilePath],
      });
    });
  },
});
```

该文件可在运行时加载：

```ts
const res = await fetch(browser.runtime.getURL('/some-text.txt'));
```

#### 添加自定义入口

在发现 `entrypoints/` 目录下的现有文件后，可以使用 `entrypoints:found` 钩子添加自定义入口。

:::info
`entrypoints:found` 钩子会在对入口列表进行校验之前触发。因此，任何自定义入口仍会被检查是否重名，并在调试时记录。
:::

```ts
import { defineWxtModule } from 'wxt/modules';

export default defineWxtModule({
  setup(wxt) {
    wxt.hook('entrypoints:found', (_, entrypointInfos) => {
      // 添加你的新入口
      entrypointInfos.push({
        name: 'my-custom-script',
        inputPath: 'path/to/custom-script.js',
        type: 'content-script',
      });
    });
  },
});
```

#### 生成运行时代码模块

在 `.wxt` 目录下创建文件，添加别名用于导入，并为导出的变量添加自动导入。

```ts
import { defineWxtModule } from 'wxt/modules';
import { resolve } from 'node:path';

export default defineWxtModule({
  imports: [
    // 添加自动导入
    { from: '#analytics', name: 'analytics' },
    { from: '#analytics', name: 'reportEvent' },
    { from: '#analytics', name: 'reportPageView' },
  ],

  setup(wxt) {
    const analyticsModulePath = resolve(
      wxt.config.wxtDir,
      'analytics/index.ts',
    );
    const analyticsModuleCode = `
      import { createAnalytics } from 'some-module';

      export const analytics = createAnalytics(useAppConfig().analytics);
      export const { reportEvent, reportPageView } = analytics;
    `;

    addAlias(wxt, '#analytics', analyticsModulePath);

    wxt.hook('prepare:types', async (_, entries) => {
      entries.push({
        path: analyticsModulePath,
        text: analyticsModuleCode,
      });
    });
  },
});
```

#### 生成声明文件

```ts
import { defineWxtModule } from 'wxt/modules';
import { resolve } from 'node:path';

export default defineWxtModule({
  setup(wxt) {
    const typesPath = resolve(wxt.config.wxtDir, 'my-module/types.d.ts');
    const typesCode = `
      // 声明全局类型，进行类型增强
    `;

    wxt.hook('prepare:types', async (_, entries) => {
      entries.push({
        path: 'my-module/types.d.ts',
        text: `
          // 声明全局类型，进行类型增强等
        `,
        // 重要 - 没有这行你的声明文件不会被 TS 项目包含：
        tsReference: true,
      });
    });
  },
});
```

### 示例模块

你还可以阅读其他人编写并发布的模块代码。以下是一些示例：

- [`@wxt-dev/auto-icons`](https://github.com/wxt-dev/wxt/blob/main/packages/auto-icons)
- [`@wxt-dev/i18n`](https://github.com/wxt-dev/wxt/blob/main/packages/i18n)
- [`@wxt-dev/module-vue`](https://github.com/wxt-dev/wxt/blob/main/packages/module-vue)
- [`@wxt-dev/module-solid`](https://github.com/wxt-dev/wxt/blob/main/packages/module-solid)
- [`@wxt-dev/module-react`](https://github.com/wxt-dev/wxt/blob/main/packages/module-react)
- [`@wxt-dev/module-svelte`](https://github.com/wxt-dev/wxt/blob/main/packages/module-svelte)
