# 构建模式

由于 WXT 基于 Vite 构建，因此它以相同的方式支持 [模式（Modes）](https://vite.dev/guide/env-and-mode.html#modes)。

在运行任何 dev 或 build 命令时，可以传递 `--mode` 标志：

```sh
wxt --mode production
wxt build --mode development
wxt zip --mode testing
```

默认情况下，dev 命令的 `--mode` 为 `development`，其他所有命令（build、zip 等）的 `--mode` 为 `production`。

## 运行时获取模式

你可以在扩展中通过 `import.meta.env.MODE` 访问当前模式：

```ts
switch (import.meta.env.MODE) {
  case 'development': // ...
  case 'production': // ...

  // 使用 --mode 指定的自定义模式
  case 'testing': // ...
  case 'staging': // ...
  // ...
}
```
