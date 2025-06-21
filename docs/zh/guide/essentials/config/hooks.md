# 钩子（Hooks）

WXT 包含一个允许你在构建过程中进行钩入并做出更改的系统。

## 添加钩子

添加钩子最简单的方法是在 `wxt.config.ts` 文件中。下面是一个在 `manifest.json` 文件写入输出目录前进行修改的示例钩子：

```ts [wxt.config.ts]
export default defineConfig({
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      if (wxt.config.mode === 'development') {
        manifest.title += ' (DEV)';
      }
    },
  },
});
```

大多数钩子会提供 `wxt` 对象作为第一个参数。它包含了解析后的配置和当前构建的其他信息。其他参数可以通过引用进行修改，从而改变构建系统的不同部分。

将这种一次性的钩子放在配置文件中很简单，但如果你发现自己写了很多钩子，建议将它们提取到 [WXT 模块](/guide/essentials/wxt-modules) 中。

## 执行顺序

由于钩子可以在多个地方定义，包括 [WXT 模块](/guide/essentials/wxt-modules)，因此它们的执行顺序可能很重要。钩子的执行顺序如下：

1. NPM 模块，按照 [`modules` 配置](/api/reference/wxt/interfaces/InlineConfig#modules) 中的顺序
2. 用户模块，位于 [`/modules` 文件夹](/guide/essentials/project-structure)中，按字母顺序加载
3. 在你的 `wxt.config.ts` 文件中列出的钩子

要查看你项目的实际顺序，可以运行 `wxt prepare --debug` 并查找 "Hook execution order"：

```plaintext
⚙ Hook execution order:
⚙   1. wxt:built-in:unimport
⚙   2. src/modules/auto-icons.ts
⚙   3. src/modules/example.ts
⚙   4. src/modules/i18n.ts
⚙   5. wxt.config.ts > hooks
```

更改执行顺序很简单：

- 给你的用户模块加上数字前缀（数字越小越先加载）：
  <!-- prettier-ignore -->
  ```html
  📁 modules/
     📄 0.my-module.ts
     📄 1.another-module.ts
  ```

- 如果你需要让某个 NPM 模块在用户模块之后运行，只需将其作为用户模块引入，并给文件名加上数字前缀即可！

  ```ts
  // modules/2.i18n.ts
  export { default } from '@wxt-dev/i18n/module';
  ```
