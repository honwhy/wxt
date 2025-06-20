# Manifest

在 WXT 中，你的源代码中没有 `manifest.json` 文件。相反，WXT 会从多个来源生成清单文件：

- 在 `wxt.config.ts` 文件中[定义的全局选项](#global-options)
- 在入口点中[定义的特定入口点选项](/guide/essentials/entrypoints#defining-manifest-options)
- 添加到项目中的 [WXT 模块](/guide/essentials/wxt-modules)可以修改你的清单
- 项目中定义的 [Hooks](/guide/essentials/config/hooks) 可以修改你的清单

运行 `wxt build` 时，你的扩展的 `manifest.json` 将输出到 `.output/{target}/manifest.json`。

## 全局选项

要将属性添加到清单中，请在 `wxt.config.ts` 中使用 `manifest` 配置：

```ts
export default defineConfig({
  manifest: {
    // 在此处放置手动更改
  },
});
```

你也可以将清单定义为一个函数，并使用 JavaScript 根据目标浏览器、模式等动态生成它。

```ts
export default defineConfig({
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      // ...
    };
  },
});
```

### MV2 和 MV3 兼容性

向清单添加属性时，请尽可能使用 MV3 格式定义属性。当目标为 MV2 时，WXT 会自动将这些属性转换为其 MV2 格式。

例如，对于此配置：

```ts
export default defineConfig({
  manifest: {
    action: {
      default_title: 'Some Title',
    },
    web_accessible_resources: [
      {
        matches: ['*://*.google.com/*'],
        resources: ['icon/*.png'],
      },
    ],
  },
});
```

WXT 将生成以下清单：

:::code-group

```json [MV2]
{
  "manifest_version": 2,
  // ...
  "browser_action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": ["icon/*.png"]
}
```

```json [MV3]
{
  "manifest_version": 3,
  // ...
  "action": {
    "default_title": "Some Title"
  },
  "web_accessible_resources": [
    {
      "matches": ["*://*.google.com/*"],
      "resources": ["icon/*.png"]
    }
  ]
}
```

:::

你也可以指定仅适用于单个清单版本的属性，它们将在目标为其他清单版本时被移除。

## 名称

> [Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/manifest/name/)

如果未通过 `manifest` 配置提供，清单的 `name` 属性将默认使用 `package.json` 中的 `name` 属性。

## 版本和版本名称

> [Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/manifest/version/)

你的扩展的 `version` 和 `version_name` 基于 `package.json` 中的 `version`。

- `version_name` 是列出的确切字符串
- `version` 是清理后的字符串，移除了任何无效后缀

示例：

```json
// package.json
{
  "version": "1.3.0-alpha2"
}
```

```json
// .output/<target>/manifest.json
{
  "version": "1.3.0",
  "version_name": "1.3.0-alpha2"
}
```

如果你的 `package.json` 中不存在版本，则默认为 `"0.0.0"`。

## 图标

WXT 通过查看 `public/` 目录中的文件自动发现扩展图标：

```plaintext
public/
├─ icon-16.png
├─ icon-24.png
├─ icon-48.png
├─ icon-96.png
└─ icon-128.png
```

具体来说，图标必须匹配以下正则表达式之一才能被发现：

<<< @/../packages/wxt/src/core/utils/manifest.ts#snippet

如果你不喜欢这些文件名，或者你正在迁移到 WXT 且不想重命名文件，可以在清单中手动指定 `icon`：

```ts
export default defineConfig({
  manifest: {
    icons: {
      16: '/extension-icon-16.png',
      24: '/extension-icon-24.png',
      48: '/extension-icon-48.png',
      96: '/extension-icon-96.png',
      128: '/extension-icon-128.png',
    },
  },
});
```

或者，你可以使用 [`@wxt-dev/auto-icons`](https://www.npmjs.com/package/@wxt-dev/auto-icons) 让 WXT 按所需尺寸生成图标。

## 权限

> [Chrome 文档](https://developer.chrome.com/docs/extensions/reference/permissions/)

大多数情况下，你需要手动向清单添加权限。只有在少数特定情况下权限会自动添加：

- 开发期间：将添加 `tabs` 和 `scripting` 权限以启用热重载。
- 存在 `sidepanel` 入口点时：添加 `sidepanel` 权限。

```ts
export default defineConfig({
  manifest: {
    permissions: ['storage', 'tabs'],
  },
});
```

## 主机权限

> [Chrome 文档](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions#host-permissions)

```ts
export default defineConfig({
  manifest: {
    host_permissions: ['https://www.google.com/*'],
  },
});
```

:::warning
如果你使用主机权限并同时针对 MV2 和 MV3，请确保仅为每个版本包含所需的主机权限：

```ts
export default defineConfig({
  manifest: ({ manifestVersion }) => ({
    host_permissions: manifestVersion === 2 ? [...] : [...],
  }),
});
```

:::

## 默认区域设置

```ts
export default defineConfig({
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
  },
});
```

> 有关扩展国际化的完整指南，请参阅 [I18n 文档](/guide/essentials/i18n)。

## 操作

在 MV2 中，你有两个选项：[`browser_action`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action) 和 [`page_action`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/page_action)。在 MV3 中，它们被合并为单一的 [`action`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/action) API。

默认情况下，当生成 `action` 时，WXT 在目标为 MV2 时会回退到 `browser_action`。

### 带弹出页的操作

要生成点击图标后显示 UI 的清单，只需创建一个 [Popup 入口点](/guide/essentials/entrypoints#popup)。如果要在 MV2 中使用 `page_action`，请在 HTML 文档的头部添加以下元标签：

```html
<meta name="manifest.type" content="page_action" />
```

### 不带弹出页的操作

如果你想使用 `activeTab` 权限或 `browser.action.onClicked` 事件，但不想显示弹出页：

1. 如果存在 [Popup 入口点](/guide/essentials/entrypoints#popup)，请删除它
2. 向清单添加 `action` 键：

   ```ts
   export default defineConfig({
     manifest: {
       action: {},
     },
   });
   ```

与带弹出页的操作相同，WXT 在 MV2 下会回退到使用 `browser_action`。要改用 `page_action`，还需添加该键：

```ts
export default defineConfig({
  manifest: {
    action: {},
    page_action: {},
  },
});
```
