export const siteData = JSON.parse("{\"base\":\"/dist/\",\"lang\":\"zh-CN\",\"title\":\"mosowe@vuepress3\",\"description\":\"mosowe的个人积累\",\"head\":[[\"link\",{\"rel\":\"icon\",\"href\":\"https://static-c3d2938e-a10f-4b38-b1d5-791a37326313.bspapp.com/mosoweLogo.png\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
