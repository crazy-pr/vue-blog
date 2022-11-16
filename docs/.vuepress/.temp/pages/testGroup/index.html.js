export const data = JSON.parse("{\"key\":\"v-227a247b\",\"path\":\"/testGroup/\",\"title\":\"第一项\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"第一项\",\"order\":0},\"excerpt\":\"\",\"headers\":[{\"level\":2,\"title\":\"二级的\",\"slug\":\"二级的\",\"link\":\"#二级的\",\"children\":[{\"level\":3,\"title\":\"三级的\",\"slug\":\"三级的\",\"link\":\"#三级的\",\"children\":[]}]}],\"git\":{},\"filePathRelative\":\"testGroup/index.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
