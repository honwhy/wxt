---
outline: deep
---

# 发布

WXT 可以将你的扩展打包为 ZIP，并提交到各大商店进行审核或自托管。

## 首次发布

如果你是第一次将扩展发布到商店，必须手动完成整个流程。WXT 不会帮你创建商店页面，每个商店都有独特的步骤和要求，你需要自行了解。

关于每个商店的具体细节，请参阅下方的商店部分。

- [Chrome 网上应用店](#chrome-web-store)
- [Firefox 附加组件商店](#firefox-addon-store)
- [Edge 附加组件](#edge-addons)

## 自动化

WXT 提供了两个命令，帮助你自动化提交新版本审核和发布的流程：

- `wxt submit init`：为 `wxt submit` 命令设置所有必需的密钥和选项
- `wxt submit`：将你的扩展新版本提交审核（审核通过后自动发布）

开始使用时，运行 `wxt submit init` 并按照提示操作，或运行 `wxt submit --help` 查看所有可用选项。完成后，你应该会有一个 `.env.submit` 文件！WXT 会使用此文件来提交你的更新。

> 在 CI 环境下，请确保你已将所有环境变量添加到 submit 步骤中。

要提交新版本进行发布，先构建你要发布的所有 ZIP 包：

```sh
wxt zip
wxt zip -b firefox
```

然后运行 `wxt submit` 命令，传入你要发布的所有 ZIP 文件。下面的例子会同时发布到三大主流商店：Chrome 网上应用店、Edge 附加组件和 Firefox 附加组件商店。

如果是第一次运行该命令，或者你最近更改了发布流程，建议先用 `--dry-run` 标志测试你的密钥。

```sh
wxt submit --dry-run \
  --chrome-zip .output/{your-extension}-{version}-chrome.zip \
  --firefox-zip .output/{your-extension}-{version}-firefox.zip --firefox-sources-zip .output/{your-extension}-{version}-sources.zip \
  --edge-zip .output/{your-extension}-{version}-chrome.zip
```

如果测试通过，去掉该标志进行正式发布：

```sh
wxt submit \
  --chrome-zip .output/{your-extension}-{version}-chrome.zip \
  --firefox-zip .output/{your-extension}-{version}-firefox.zip --firefox-sources-zip .output/{your-extension}-{version}-sources.zip \
  --edge-zip .output/{your-extension}-{version}-chrome.zip
```

:::warning
关于 `--firefox-sources-zip` 选项的更多细节，请参阅 [Firefox 附加组件商店](#firefox-addon-store) 部分。
:::

## GitHub Action

下面是一个 GitHub Action 示例，用于将新版本扩展提交审核。请确保你已将工作流中用到的所有密钥添加到仓库设置中。

```yml
name: Release

on:
  workflow_dispatch:

jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Zip extensions
        run: |
          pnpm zip
          pnpm zip:firefox

      - name: Submit to stores
        run: |
          pnpm wxt submit \
            --chrome-zip .output/*-chrome.zip \
            --firefox-zip .output/*-firefox.zip --firefox-sources-zip .output/*-sources.zip
        env:
          CHROME_EXTENSION_ID: ${{ secrets.CHROME_EXTENSION_ID }}
          CHROME_CLIENT_ID: ${{ secrets.CHROME_CLIENT_ID }}
          CHROME_CLIENT_SECRET: ${{ secrets.CHROME_CLIENT_SECRET }}
          CHROME_REFRESH_TOKEN: ${{ secrets.CHROME_REFRESH_TOKEN }}
          FIREFOX_EXTENSION_ID: ${{ secrets.FIREFOX_EXTENSION_ID }}
          FIREFOX_JWT_ISSUER: ${{ secrets.FIREFOX_JWT_ISSUER }}
          FIREFOX_JWT_SECRET: ${{ secrets.FIREFOX_JWT_SECRET }}
```

上面的 action 提供了一个基础工作流，包括 `zip` 和 `submit` 步骤。想要进一步增强你的 GitHub Action 并处理更复杂的场景，可以参考以下真实项目的例子。这些例子介绍了版本管理、changelog 生成和 GitHub 发布等高级功能，适用于不同需求：

- [`aklinker1/github-better-line-counts`](https://github.com/aklinker1/github-better-line-counts/blob/main/.github/workflows/submit.yml) - 使用 conventional commits，自动版本提升和 changelog 生成，手动触发，支持 dry run 测试
- [`GuiEpi/plex-skipper`](https://github.com/GuiEpi/plex-skipper/blob/main/.github/workflows/deploy.yml) - 当 `package.json` 版本变更时自动触发，创建并上传构建产物到 GitHub release。

> 这些例子旨在提供清晰的参考，是自定义你自己工作流的良好起点。欢迎根据项目需求自由探索和调整。

## 商店

### Chrome 网上应用店

> ✅ 支持 &bull; [开发者后台](https://chrome.google.com/webstore/developer/dashboard) &bull; [发布文档](https://developer.chrome.com/docs/webstore/publish/)

为 Chrome 创建 ZIP 包：

```sh
wxt zip
```

### Firefox 附加组件商店

> ✅ 支持 &bull; [开发者后台](https://addons.mozilla.org/developers/) &bull; [发布文档](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)

Firefox 要求你上传源码 ZIP。这样他们可以重建你的扩展，并以可读的方式审核代码。更多细节见 [Firefox 官方文档](https://extensionworkshop.com/documentation/publish/source-code-submission/)。

运行 `wxt zip -b firefox` 时，WXT 会同时打包扩展和源码。某些文件（如配置文件、隐藏文件、测试和被排除的入口文件）会自动从源码包中排除。但你仍需手动检查 ZIP，确保其中只包含重建扩展所需的文件。

如需自定义打包文件，可在配置文件中添加 `zip` 选项。

```ts [wxt.config.ts]
import { defineConfig } from 'wxt';

export default defineConfig({
  zip: {
    // ...
  },
});
```

如果你是第一次提交到 Firefox 附加组件商店，或最近更改了项目结构，请务必测试你的源码 ZIP！在解压后的目录下运行以下命令，应该可以重新构建你的扩展。

:::code-group

```sh [pnpm]
pnpm i
pnpm zip:firefox
```

```sh [npm]
npm i
npm run zip:firefox
```

```sh [yarn]
yarn
yarn zip:firefox
```

```sh [bun]
bun i
bun zip:firefox
```

:::

请确保你有 `README.md` 或 `SOURCE_CODE_REVIEW.md` 文件，并写明上述命令，方便 Firefox 团队了解如何构建你的扩展。

确保在主项目和源码包内运行 `wxt build -b firefox` 时，构建产物完全一致。

:::warning
如果你使用 `.env` 文件，它可能会影响输出目录中的 chunk hash。要么在运行 `wxt zip -b firefox` 前删除 .env 文件，要么通过 [`zip.includeSources`](/api/reference/wxt/interfaces/InlineConfig#includesources) 选项将其包含进源码包。注意不要在 `.env` 文件中包含任何敏感信息。

详见 Issue [#377](https://github.com/wxt-dev/wxt/issues/377)。
:::

#### 私有包

如果你使用了私有包，并且不想在审核过程中向 Firefox 团队提供你的认证 token，可以使用 `zip.downloadPackages` 下载私有包并包含进源码包。

```ts [wxt.config.ts]
export default defineConfig({
  zip: {
    downloadPackages: [
      '@mycompany/some-package',
      //...
    ],
  },
});
```

根据你的包管理器，源码包中的 `package.json` 会通过 `overrides` 或 `resolutions` 字段修改为使用已下载的依赖。

:::warning
WXT 使用命令 `npm pack <package-name>` 下载包。无论你用什么包管理器，都需要正确配置 `.npmrc` 文件。NPM 和 PNPM 都支持 `.npmrc`，但 Yarn 和 Bun 有各自的私有源认证方式，因此你需要额外添加 `.npmrc` 文件。
:::

### Safari

> 🚧 暂不支持

WXT 目前不支持 Safari 的自动化发布。Safari 扩展需要原生的 MacOS 或 iOS 应用包装，WXT 还无法生成。若需发布到 Safari，请参考以下指南：

- [将 Web 扩展转换为 Safari 扩展](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari) - “使用 Xcode 命令行工具将现有扩展转换为 Safari Web 扩展。”

运行 `safari-web-extension-converter` CLI 工具时，请传入 `.output/safari-mv2` 或 `.output/safari-mv3` 目录，而不是源码目录。

```sh
pnpm wxt build -b safari
xcrun safari-web-extension-converter .output/safari-mv2
```

### Edge 附加组件

> ✅ 支持 &bull; [开发者后台](https://aka.ms/PartnerCenterLogin) &bull; [发布文档](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)

无需为 Edge 单独创建 ZIP。如果你已经为 Chrome 网上应用店打包，可以直接复用 Chrome 的 ZIP 包。

但如果你有专为 Edge 定制的功能，可以用以下命令单独打包：

```sh
wxt zip -b edge
```
