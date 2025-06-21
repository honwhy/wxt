# 消息通信

[Chrome 文档](https://developer.chrome.com/docs/extensions/develop/concepts/messaging) • [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_background_scripts)

请阅读上面链接的文档，了解如何使用原生消息通信 API。

## 替代方案

原生 API 使用起来较为繁琐，对许多新的扩展开发者来说是一个难点。因此，WXT 推荐安装一个对原生 API 进行封装的 NPM 包。

以下是一些支持所有浏览器并可与 WXT 配合使用的流行消息通信库：

- [`trpc-chrome`](https://www.npmjs.com/package/trpc-chrome) - [tRPC](https://trpc.io/) 的 Web 扩展适配器。
- [`webext-bridge`](https://www.npmjs.com/package/webext-bridge) - 让 WebExtensions 消息通信变得非常简单，开箱即用。
- [`@webext-core/messaging`](https://www.npmjs.com/package/@webext-core/messaging) - 轻量级、类型安全的 web 扩展消息通信 API 封装库。
- [`@webext-core/proxy-service`](https://www.npmjs.com/package/@webext-core/proxy-service) - 类型安全的 web 扩展消息通信 API 封装库，可让你在任意上下文调用函数，并在后台执行。
- [`Comctx`](https://github.com/molvqingtai/comctx) - 跨上下文的 RPC 方案，具备类型安全和灵活适配能力。
