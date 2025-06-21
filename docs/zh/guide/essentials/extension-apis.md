# 扩展 API

[Chrome 文档](https://developer.chrome.com/docs/extensions/reference/api) • [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)

不同的浏览器为访问扩展 API 提供了不同的全局变量（chrome 提供 `chrome`，firefox 提供 `browser`，等等）。

WXT 将这两者合并为一个统一的 API，通过 `browser` 变量访问。

```ts
import { browser } from 'wxt/browser';

browser.action.onClicked.addListener(() => {
  // ...
});
```

:::tip
启用自动导入后，甚至无需从 `wxt/browser` 导入该变量！
:::

WXT 提供的 `browser` 变量只是浏览器在运行时提供的 `browser` 或 `chrome` 全局变量的简单导出：

<<< @/../packages/browser/src/index.mjs#snippet

这意味着你可以在 MV2 和 MV3 中都使用 promise 风格的 API，并且它可以在所有浏览器（Chromium、Firefox、Safari 等）中正常工作。

## 访问类型

所有类型都可以通过 WXT 的 `Browser` 命名空间访问：

```ts
import { type Browser } from 'wxt/browser';

function handleMessage(message: any, sender: Browser.runtime.MessageSender) {
  // ...
}
```

## 使用 `webextension-polyfill`

如果你希望在导入 `browser` 时使用 `webextension-polyfill`，可以通过安装 `@wxt-dev/webextension-polyfill` 包来实现。

请参阅其 [安装指南](https://github.com/wxt-dev/wxt/blob/main/packages/webextension-polyfill/README.md) 以开始使用。

## 特性检测

根据清单版本、浏览器和权限的不同，某些 API 在运行时可能不可用。如果某个 API 不可用，它将是 `undefined`。

:::warning
类型在这里不会帮到你。WXT 为 `browser` 提供的类型假定所有 API 都存在。你需要自己了解某个 API 是否可用。
:::

要检查某个 API 是否可用，请使用特性检测：

```ts
if (browser.runtime.onSuspend != null) {
  browser.runtime.onSuspend.addListener(() => {
    // ...
  });
}
```

在这里，[可选链](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 是你的好帮手：

```ts
browser.runtime.onSuspend?.addListener(() => {
  // ...
});
```

另外，如果你想在不同名称下使用类似的 API（以支持 MV2 和 MV3），可以这样做：

```ts
(browser.action ?? browser.browser_action).onClicked.addListener(() => {
  // ...
});
```
