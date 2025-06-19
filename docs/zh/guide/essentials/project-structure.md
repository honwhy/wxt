# 项目结构

WXT 遵循严格的项目结构。默认情况下，它是一个扁平的文件夹结构，如下所示：

<!-- prettier-ignore -->
```html
📂 {rootDir}/
   📁 .output/
   📁 .wxt/
   📁 assets/
   📁 components/
   📁 composables/
   📁 entrypoints/
   📁 hooks/
   📁 modules/
   📁 public/
   📁 utils/
   📄 .env
   📄 .env.publish
   📄 app.config.ts
   📄 package.json
   📄 tsconfig.json
   📄 web-ext.config.ts
   📄 wxt.config.ts
```

以下是这些文件和目录的简要说明：

- `.output/`: 所有构建产物将输出到此目录
- `.wxt/`: 由 WXT 生成，包含 TS 配置
- `assets/`: 包含所有应由 WXT 处理的 CSS、图片和其他资源
- `components/`: **默认自动导入**，包含 UI 组件
- `composables/`: **默认自动导入**，包含项目中 Vue 组合式函数的源代码
- `entrypoints/`: 包含所有将被捆绑到你的扩展中的入口点
- `hooks/`: **默认自动导入**，包含项目中 React 和 Solid 钩子的源代码
- `modules/`: 包含项目的[本地 WXT 模块](/guide/essentials/wxt-modules)
- `public/`: 包含任何你想要原样复制到输出文件夹的文件，不会被 WXT 处理
- `utils/`: **默认自动导入**，包含项目中各处使用的通用工具函数
- `.env`: 包含[环境变量](/guide/essentials/config/environment-variables)
- `.env.publish`: 包含用于[发布](/guide/essentials/publishing)的环境变量
- `app.config.ts`: 包含[运行时配置](/guide/essentials/config/runtime)
- `package.json`: 你的包管理器使用的标准文件
- `tsconfig.json`: 告诉 TypeScript 如何运行的配置文件
- `web-ext.config.ts`: 配置[浏览器启动](/guide/essentials/config/browser-startup)
- `wxt.config.ts`: WXT 项目的主配置文件

## 添加 `src/` 目录

许多开发者喜欢使用 `src/` 目录来将源代码与配置文件分开。你可以在 `wxt.config.ts` 文件中启用它：

```ts [wxt.config.ts]
export default defineConfig({
  srcDir: 'src',
});
```

启用后，你的项目结构应如下所示：

<!-- prettier-ignore -->
```html
📂 {rootDir}/
   📁 .output/
   📁 .wxt/
   📁 modules/
   📁 public/
   📂 src/
      📁 assets/
      📁 components/
      📁 composables/
      📁 entrypoints/
      📁 hooks/
      📁 utils/
      📄 app.config.ts
   📄 .env
   📄 .env.publish
   📄 package.json
   📄 tsconfig.json
   📄 web-ext.config.ts
   📄 wxt.config.ts
```

## 自定义其他目录

你可以配置以下目录：

<!-- prettier-ignore -->
```ts [wxt.config.ts]
export default defineConfig({
  // 相对于项目根目录
  srcDir: "src",             // 默认值: "."
  modulesDir: "wxt-modules", // 默认值: "modules"
  outDir: "dist",            // 默认值: ".output"
  publicDir: "static",       // 默认值: "public"

  // 相对于 srcDir
  entrypointsDir: "entries", // 默认值: "entrypoints"
})
```

你可以使用绝对路径或相对路径。
