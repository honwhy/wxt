# 测试更新

## 测试权限变更

当在更新过程中 `permissions`/`host_permissions` 发生变化时，根据具体变更内容，浏览器可能会在用户接受新权限之前禁用你的扩展。

你可以通过以下方式测试权限变更是否会导致扩展被禁用：

- Chromium：使用 [Google 的扩展更新测试工具](https://github.com/GoogleChromeLabs/extension-update-testing-tool)
- Firefox：参见他们的 [测试权限请求](https://extensionworkshop.com/documentation/develop/test-permission-requests/) 页面
- Safari：每个人最终都会在生产环境踩坑……🫡 祝你好运，战士

## 更新事件

你可以像下面这样设置一个回调，在扩展更新后运行：

```ts
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'update') {
    // 执行某些操作
  }
});
```

如果逻辑很简单，建议为这段逻辑编写单元测试。如果你需要手动测试此回调，可以：

1. 在开发模式下，移除 `if` 语句，然后在 `chrome://extensions` 页面重新加载扩展
2. 使用 [Google 的扩展更新测试工具](https://github.com/GoogleChromeLabs/extension-update-testing-tool)
