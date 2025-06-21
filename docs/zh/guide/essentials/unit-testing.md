# 单元测试

[[toc]]

## Vitest

WXT 为单元测试提供了对 Vitest 的一流支持：

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  plugins: [WxtVitest()],
});
```

此插件会做以下几件事：

- 使用 [`@webext-core/fake-browser`](https://webext-core.aklinker1.io/fake-browser/installation) 提供的内存实现对扩展 API `browser` 进行 polyfill
- 添加 `wxt.config.ts` 中的所有 vite 配置或插件
- 配置自动导入（如果启用）
- 应用 WXT 内部 vite 插件，用于 [远程代码打包](/guide/essentials/remote-code) 等功能
- 设置 WXT 提供的全局变量（如 `import.meta.env.BROWSER`、`import.meta.env.MANIFEST_VERSION`、`import.meta.env.IS_CHROME` 等）
- 配置别名（`@/*`、`@@/*` 等），以便解析导入

以下是真实项目的单元测试配置。可以查看代码和测试，了解它们是如何编写的。

- [`aklinker1/github-better-line-counts`](https://github.com/aklinker1/github-better-line-counts)
- [`wxt-dev/examples` 的 Vitest 示例](https://github.com/wxt-dev/examples/tree/main/examples/vitest-unit-testing)

### 测试示例

本示例演示了在测试中无需 mock `browser.storage`（`wxt/utils/storage` 使用），因为 [`@webext-core/fake-browser`](https://webext-core.aklinker1.io/fake-browser/installation) 已经实现了内存存储，其行为与真实扩展中一致！

```ts
import { describe, it, expect } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

const accountStorage = storage.defineItem<Account>('local:account');

async function isLoggedIn(): Promise<Account> {
  const value = await accountStorage.getValue();
  return value != null;
}

describe('isLoggedIn', () => {
  beforeEach(() => {
    // 参考 https://webext-core.aklinker1.io/fake-browser/reseting-state
    fakeBrowser.reset();
  });

  it('should return true when the account exists in storage', async () => {
    const account: Account = {
      username: '...',
      preferences: {
        // ...
      },
    };
    await accountStorage.setValue(account);

    expect(await isLoggedIn()).toBe(true);
  });

  it('should return false when the account does not exist in storage', async () => {
    await accountStorage.deleteValue();

    expect(await isLoggedIn()).toBe(false);
  });
});
```

### Mock WXT API

首先，需要了解 `#imports` 模块的工作原理。当 WXT（和 vitest）在预处理步骤中看到此导入时，会将其替换为指向“真实”导入路径的多个导入。

例如，你在源码中这样写：

```ts
// 你的写法
import { injectScript, createShadowRootUi } from '#imports';
```

但 Vitest 实际看到的是：

```ts
import { injectScript } from 'wxt/utils/inject-script';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
```

所以，如果你想 mock `injectScript`，需要传入 `"wxt/utils/inject-script"`，而不是 `"#imports"`。

```ts
vi.mock("wxt/utils/inject-script", () => ({
  injectScript: ...
}))
```

可以参考项目的 `.wxt/types/imports-module.d.ts` 文件，查找 `#imports` 的真实导入路径。如果该文件不存在，请运行 [`wxt prepare`](/guide/essentials/config/typescript)。

## 其他测试框架

如果要使用其他测试框架，通常需要禁用自动导入、手动配置导入别名、手动 mock 扩展 API，并设置测试环境以支持你所用的所有 WXT 特性。

这是可行的，但需要更多配置。可以参考 Vitest 的配置，了解如何设置测试环境：

<https://github.com/wxt-dev/wxt/blob/main/packages/wxt/src/testing/wxt-vitest-plugin.ts>
