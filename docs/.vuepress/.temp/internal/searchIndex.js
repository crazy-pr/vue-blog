export const searchIndex = [
  {
    "title": "介绍",
    "headers": [
      {
        "level": 2,
        "title": "规范",
        "slug": "规范",
        "link": "#规范",
        "children": []
      },
      {
        "level": 2,
        "title": "注意事项",
        "slug": "注意事项",
        "link": "#注意事项",
        "children": []
      },
      {
        "level": 2,
        "title": "运行",
        "slug": "运行",
        "link": "#运行",
        "children": []
      },
      {
        "level": 2,
        "title": "codeShow演示",
        "slug": "codeshow演示",
        "link": "#codeshow演示",
        "children": []
      },
      {
        "level": 2,
        "title": "相关链接",
        "slug": "相关链接",
        "link": "#相关链接",
        "children": []
      }
    ],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "第一项",
    "headers": [],
    "path": "/testGroup/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "测试第二项",
    "headers": [],
    "path": "/testGroup/second.html",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSearchIndex) {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  })
}
