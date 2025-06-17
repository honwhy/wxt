import { defineConfig } from 'vitepress';
import {
  menuGroup,
  menuItem,
  menuRoot,
  navItem,
  prepareTypedocSidebar,
} from '../.vitepress/utils/menus';

export default defineConfig({
  themeConfig: {
    nav: [navItem('指南', '/zh/guide/installation')],
  },
});
