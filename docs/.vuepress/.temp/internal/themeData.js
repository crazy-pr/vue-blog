export const themeData = JSON.parse("{\"logo\":\"https://static-c3d2938e-a10f-4b38-b1d5-791a37326313.bspapp.com/mosoweLogo.png\",\"lastUpdated\":true,\"lastUpdatedText\":\"更新时间\",\"navbar\":[{\"text\":\"CSDN博客\",\"link\":\"https://blog.csdn.net/skyblacktoday\"},{\"text\":\"码云\",\"link\":\"https://gitee.com/mosowe\"},{\"text\":\"更多\",\"children\":[{\"text\":\"mosowejs\",\"link\":\"\"},{\"text\":\"elementPlusPro\",\"link\":\"\"},{\"text\":\"elementPro\",\"link\":\"\"},{\"text\":\"uniappPlugins\",\"link\":\"\"}]}],\"sidebar\":[{\"link\":\"/\",\"text\":\"介绍\",\"order\":0},{\"text\":\"测试分组\",\"order\":2,\"collapsable\":false,\"sidebarDepth\":1,\"children\":[{\"link\":\"/testGroup/\",\"text\":\"第一项\",\"order\":0},{\"link\":\"/testGroup/second.md\",\"text\":\"测试第二项\",\"order\":1}],\"type\":\"group\"}],\"contributors\":true,\"contributorsText\":\"mosowe\",\"smoothScroll\":true,\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
