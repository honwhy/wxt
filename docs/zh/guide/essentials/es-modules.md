# ES 模块

你的源代码应始终以 ESM（ES Modules）方式编写。不过，你可以控制入口文件是否以 ESM 方式打包。

## HTML 页面 <Badge type="warning" text="≥0.0.1" />

Vite 仅支持将 HTML 页面中的 JS 以 ESM 方式打包。请确保你的 `<script>` 标签添加了 `type="module"`：

<!-- prettier-ignore -->
```html
<script src="./main.ts"></script> <!-- [!code --] -->
<script src="./main.ts" type="module"></script> <!-- [!code ++] -->
```

## 后台脚本 <Badge type="warning" text="≥0.16.0" />

默认情况下，你的后台脚本会被打包为单个 IIFE 文件。你可以通过在后台入口文件中设置 `type: "module"` 来更改这一点：

```ts
export default defineBackground({
  type: 'module', // [!code ++]
  main() {
    // ...
  },
});
```

这将把输出格式更改为 ESM，允许后台脚本与 HTML 页面之间进行代码分割，并在 manifest 中设置 `"type": "module"`。

:::warning
只有 MV3 支持 ESM 后台脚本/Service Worker。如果目标为 MV2，则 `type` 选项会被忽略，后台始终会被打包为单个 IIFE 文件。
:::

## 内容脚本

WXT 目前还不支持将内容脚本内置打包为 ESM。后续计划会支持 chunk 拆分以减小包体积，但暂不支持 HMR。由于存在多项技术难题，目前无法实现通用的 HMR 方案。详情可见 [Content Script ESM Support #357](https://github.com/wxt-dev/wxt/issues/357)。

如果你迫切需要 ESM 支持，可以手动实现。参考 [ESM Content Script UI](https://github.com/wxt-dev/examples/tree/main/examples/esm-content-script-ui) 示例了解如何操作。
