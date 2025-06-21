---
outline: deep
---

# 迁移到 WXT

> 如果你在迁移到 WXT 时遇到问题，欢迎在 GitHub 上[发起讨论](https://github.com/wxt-dev/wxt/discussions/new?category=q-a)或在 [Discord](https://discord.gg/ZFsZqGery9) 中寻求帮助！

## 概览

始终建议先生成一个新的 vanilla 项目，然后将其内容逐个文件合并到你的项目中。

```sh
cd path/to/your/project
pnpm dlx wxt@latest init example-wxt --template vanilla
```

通常，你需要：

&ensp;<input type="checkbox" /> 安装 `wxt`<br />
&ensp;<input type="checkbox" /> 在你的项目 `tsconfig.json` 中[扩展 `.wxt/tsconfig.json`](/guide/essentials/config/typescript#typescript-configuration)<br />
&ensp;<input type="checkbox" /> 更新/创建 `package.json` 脚本以使用 `wxt`（不要忘记 `postinstall`）<br />
&ensp;<input type="checkbox" /> 将入口文件移入 `entrypoints/` 目录<br />
&ensp;<input type="checkbox" /> 将资源文件移入 `assets/` 或 `public/` 目录<br />
&ensp;<input type="checkbox" /> 将 `manifest.json` 内容迁移到 `wxt.config.ts`<br />
&ensp;<input type="checkbox" /> 将自定义导入语法转换为 Vite 兼容格式<br />
&ensp;<input type="checkbox" /> 为 JS 入口文件添加默认导出（`defineBackground`、`defineContentScript` 或 `defineUnlistedScript`）<br />
&ensp;<input type="checkbox" /> 使用 `browser` 全局对象替换 `chrome`<br />
&ensp;<input type="checkbox" /> ⚠️ 对比最终的 `manifest.json` 文件，确保权限和 host 权限未发生变化<br/>
:::warning
如果你的扩展已经在 Chrome Web Store 上线，请使用 [Google 的更新测试工具](https://github.com/GoogleChromeLabs/extension-update-testing-tool) 确保没有请求新的权限。
:::

每个项目都不同，因此没有一套通用的迁移方案。只需确保 `wxt dev` 能运行，`wxt build` 能生成可用的扩展，并且 `manifest.json` 中的权限列表没有变化。如果这些都没问题，你就完成了迁移！

## 常用工具/框架

以下是针对其他流行框架/构建工具的具体迁移步骤。

### Plasmo

1. 安装 `wxt`
2. 将入口文件移入 `entrypoints/` 目录
   - 对于 JS 入口文件，将用于配置 JS 入口的具名导出合并到 WXT 的默认导出中
   - 对于 HTML 入口文件，不能直接使用 JSX/Vue/Svelte 文件，需要创建 HTML 文件并手动创建和挂载你的应用。可参考 [React](https://github.com/wxt-dev/wxt/tree/main/templates/react/entrypoints/popup)、[Vue](https://github.com/wxt-dev/wxt/tree/main/templates/vue/entrypoints/popup) 和 [Svelte](https://github.com/wxt-dev/wxt/tree/main/templates/svelte/src/entrypoints/popup) 模板。
3. 将公共 `assets/*` 移入 `public/` 目录
4. 如果你使用 CSUI，迁移到 WXT 的 `createContentScriptUi`
5. 将 Plasmo 的自定义导入解析转换为 Vite 格式
6. 如果通过 URL 导入远程代码，需添加 `url:` 前缀以兼容 WXT
7. 用 [WXT 构建模式](/guide/essentials/config/build-mode)（`--mode`）替换你的 [Plasmo 标签](https://docs.plasmo.com/framework/workflows/build#with-a-custom-tag)（`--tag`）
8. ⚠️ 对比旧的生产 manifest 与 `.output/*/manifest.json`，内容应保持一致。如有不同，调整入口文件和配置直到一致。

### CRXJS

如果你使用了 CRXJS 的 vite 插件，只需简单重构！CRXJS 和 WXT 的主要区别在于如何决定构建哪些入口。CRXJS 通过 `manifest`（以及 vite 配置中的“unlisted”入口）决定，WXT 则通过 `entrypoints` 目录下的文件决定。

迁移步骤：

1. 将所有入口文件移入 `entrypoints` 目录，并重构为 WXT 风格（TS 文件需有默认导出）。
2. 将[入口特定选项从 manifest 中移出](/guide/essentials/entrypoints#defining-manifest-options)，放到入口文件本身（如 content script 的 `matches` 或 `run_at`）。
3. 将其他 `manifest.json` 选项[迁移到 `wxt.config.ts` 文件](/guide/essentials/config/manifest)，如权限等。
4. 为简化起见，建议一开始[禁用自动导入](/guide/essentials/config/auto-imports#disabling-auto-imports)（除非你已通过 `unimport` 或 `unplugin-auto-imports` 使用）。迁移完成后可按需开启。
5. 更新你的 `package.json`，包含所有 [WXT 推荐脚本（见第 4 步）](/guide/installation#from-scratch)
6. 特别注意添加 `"postinstall": "wxt prepare"` 脚本到 `package.json`。
7. 删除你的 `vite.config.ts` 文件。将插件迁移到 `wxt.config.ts`。如使用前端框架，[安装对应的 WXT 模块](/guide/essentials/frontend-frameworks)。
8. 更新你的 typescript 项目。[扩展 WXT 生成的配置](/guide/essentials/config/typescript)，并[将路径别名添加到 `wxt.config.ts`](/guide/essentials/config/typescript#tsconfig-paths)。
9. ⚠️ 对比旧的生产 manifest 与 `.output/*/manifest.json`，内容应保持一致。如有不同，调整入口文件和配置直到一致。

迁移示例：[GitHub Better Line Counts - CRXJS &rarr; WXT](https://github.com/aklinker1/github-better-line-counts/commit/39d766d2ba86866efefc2e9004af554ee434e2a8)

### `vite-plugin-web-extension`

你已经在用 Vite，因此只需简单重构。

1. 安装 `wxt`
2. 将入口文件迁移并重构为 WXT 风格（带默认导出）
3. 更新 package.json 脚本以使用 `wxt`
4. 添加 `"postinstall": "wxt prepare"` 脚本
5. 将 `manifest.json` 迁移到 `wxt.config.ts`
6. 将 `vite.config.ts` 中的自定义设置迁移到 `wxt.config.ts`
7. ⚠️ 对比旧的生产 manifest 与 `.output/*/manifest.json`，内容应保持一致。如有不同，调整入口文件和配置直到一致。
