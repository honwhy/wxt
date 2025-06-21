# 存储

[Chrome 文档](https://developer.chrome.com/docs/extensions/reference/api/storage) • [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage)

你可以使用原生 API（见上方文档）、使用 [WXT 内置的存储 API](/storage)，或从 NPM 安装一个包。

## 替代方案

1. [`wxt/utils/storage`](/storage)（推荐）：WXT 自带了对原生存储 API 的封装，简化了常见用例

2. 自己实现：如果你正在迁移到 WXT 并且已经有了自己的存储封装，可以继续使用它。将来如果你想删除那部分代码，可以使用这些替代方案之一，但在迁移过程中没有必要替换已经可用的代码。

3. 其他 NPM 包：[有很多对存储 API 的封装包](https://www.npmjs.com/search?q=chrome%20storage)，你可以选择自己喜欢的。这里有一些流行的包：
   - [`webext-storage`](https://www.npmjs.com/package/webext-storage) - 一个更易用的、带类型的 Web 扩展存储 API
   - [`@webext-core/storage`](https://www.npmjs.com/package/@webext-core/storage) - 一个类型安全、类似 localStorage 的 Web 扩展存储 API 封装
