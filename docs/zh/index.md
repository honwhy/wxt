---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: 下一代 Web 扩展框架

hero:
  name: WXT
  text: 下一代 Web 扩展框架
  tagline: 一个开源工具，让 Web 扩展开发前所未有的快。
  image:
    src: /hero-logo.svg
    alt: WXT
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/installation
    - theme: alt
      text: 了解更多
      link: /guide/introduction

features:
  - icon: 🌐
    title: 支持的浏览器
    details: WXT 将为 Chrome、Firefox、Edge、Safari 以及任何基于 Chromium 的浏览器构建扩展。
    link: /guide/essentials/target-different-browsers
    linkText: 阅读文档
  - icon: ✅
    title: MV2 和 MV3
    details: 使用相同的代码库为任何浏览器构建 Manifest V2 或 V3 扩展。
    link: /guide/essentials/config/manifest
    linkText: 阅读文档
  - icon: ⚡
    title: 快速开发模式
    details: UI 开发享受闪电般的热模块替换（HMR），内容脚本/后台脚本支持快速重载，实现更快的迭代。
  - icon: 📂
    title: 基于文件的入口点
    details: Manifest 文件根据项目中的文件结构配合行内配置自动生成。
    link: /guide/essentials/project-structure
    linkText: 查看项目结构
  - icon: 🚔
    title: TypeScript
    details: 默认使用 TS，让您充满信心地创建大型项目。
  - icon: 🦾
    title: 自动导入
    details: 类 Nuxt 的自动导入功能，加速开发。
    link: /guide/essentials/config/auto-imports
    linkText: 阅读文档
  - icon: 🤖
    title: 自动化发布
    details: 自动打包（zip）、上传、提交并发布扩展。
  - icon: 🎨
    title: 前端框架无关
    details: 可与任何拥有 Vite 插件的前端框架配合使用。
    link: /guide/essentials/frontend-frameworks
    linkText: 添加框架
  - icon: 📦
    title: 模块系统
    details: 在多个扩展之间复用构建时和运行时代码。
    link: /guide/essentials/wxt-modules
    linkText: 阅读文档
  - icon: 🖍️
    title: 快速启动新项目
    details: 使用几个出色的项目模板快速开始。
    link: /guide/installation#bootstrap-project
    linkText: 查看模板
  - icon: 📏
    title: 打包分析
    details: 提供分析最终扩展包的工具，帮助最小化扩展体积。
  - icon: ⬇️
    title: 打包远程代码
    details: 下载并打包从 URL 导入的远程代码。
    link: /guide/essentials/remote-code
    linkText: 阅读文档
---

## 赞助商

WXT 是一个采用 [MIT 许可证](https://github.com/wxt-dev/wxt/blob/main/LICENSE) 的开源项目，其持续发展完全依赖于这些优秀支持者的资助。如果您也想加入他们，请考虑 [赞助 WXT 的开发](https://github.com/sponsors/wxt-dev)。

<a href="https://github.com/sponsors/wxt-dev"><img alt="WXT 赞助商" src="https://raw.githubusercontent.com/wxt-dev/static/refs/heads/main/sponsorkit/sponsors-wide.svg"></a>

## 将 <span style="color: var(--vp-c-brand-1)">开发者体验</span> 置于首位

WXT 通过提供打包发布工具、一流的开发模式、规范的项目结构等功能，简化了 Web 扩展的开发流程。更快地迭代、专注于开发功能而非构建脚本、充分利用 JavaScript 生态系统的所有资源。

<div style="margin: auto; width: 100%; max-width: 900px; text-align: center">
  <video src="https://github.com/wxt-dev/wxt/assets/10101283/4d678939-1bdb-495c-9c36-3aa281d84c94" controls></video>
  <br />
  <small>
    而且，谁会不喜欢一个美观的 CLI 呢？
  </small>
</div>

## 谁在使用 WXT？

久经实战考验，已为生产环境做好准备。探索使用 WXT 构建的 Web 扩展。

<ClientOnly>
  <UsingWxtSection />
</ClientOnly>
