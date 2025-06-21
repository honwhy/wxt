# 远程代码

WXT 会自动下载并打包带有 `url:` 前缀的导入，这样扩展程序就不会依赖远程代码，[这是 Google 对 MV3 的要求](https://developer.chrome.com/docs/extensions/migrating/improve-security/#remove-remote-code)。

## Google Analytics

例如，你可以这样导入 Google Analytics：

```ts
// utils/google-analytics.ts
import 'url:https://www.googletagmanager.com/gtag/js?id=G-XXXXXX';

window.dataLayer = window.dataLayer || [];
// 注意：这一行与 Google 官方文档不同
window.gtag = function () {
  dataLayer.push(arguments);
};
gtag('js', new Date());
gtag('config', 'G-XXXXXX');
```

然后你可以在 HTML 文件中导入它以启用 Google Analytics：

```ts
// popup/main.ts
import '~/utils/google-analytics';

gtag('event', 'event_name', {
  key: 'value',
});
```
