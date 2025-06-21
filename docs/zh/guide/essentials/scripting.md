# 脚本注入（Scripting）

[Chrome 文档](https://developer.chrome.com/docs/extensions/reference/api/scripting) • [Firefox 文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting)

基础用法请参考上方浏览器官方文档。

## 执行脚本的返回值

使用 `browser.scripting.executeScript` 时，你可以执行内容脚本或未列出的脚本。要返回值，只需在脚本的 `main` 函数中返回一个值即可。

```ts
// entrypoints/background.ts
const res = await browser.scripting.executeScript({
  target: { tabId },
  files: ['content-scripts/example.js'],
});
console.log(res); // "Hello John!"
```

```ts
// entrypoints/example.content.ts
export default defineContentScript({
  registration: 'runtime',
  main(ctx) {
    console.log('Script was executed!');
    return 'Hello John!';
  },
});
```
