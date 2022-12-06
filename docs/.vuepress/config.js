import {
    defineUserConfig
} from 'vuepress'
import {
    defaultTheme
} from 'vuepress'
import {
    searchPlugin
} from '@vuepress/plugin-search'
import { containerPlugin } from '@vuepress/plugin-container'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
    base: '/dist/',
    lang: 'zh-CN',
    title: 'mosowe@vuepress3',
    description: 'mosowe的个人积累',
    head: [
        ['link', {
            rel: 'icon',
            href: 'https://static-c3d2938e-a10f-4b38-b1d5-791a37326313.bspapp.com/mosoweLogo.png'
        }] // 需要被注入到当前页面的 HTML <head> 中的标签
    ],
    theme: defaultTheme({
        logo: 'https://static-c3d2938e-a10f-4b38-b1d5-791a37326313.bspapp.com/mosoweLogo.png',
        lastUpdated: true, // string | boolean
        lastUpdatedText: '更新时间',
        // 默认主题配置
        navbar: [{
                text: "CSDN博客",
                link: "https://blog.csdn.net/skyblacktoday"
            },
            {
                text: "码云",
                link: "https://gitee.com/mosowe"
            },
            {
                text: "更多",
                children: [{
                        text: "mosowejs",
                        link: "",
                    },
                    {
                        text: "elementPlusPro",
                        link: "",
                    },
                    {
                        text: "elementPro",
                        link: "",
                    },
                    {
                        text: "uniappPlugins",
                        link: "",
                    },
                ],
            },
        ],
        sidebar: require("../../utils/sidebar"),
        contributors: true,
        contributorsText: '贡献者',
        smoothScroll: true,
    }),
    markdown: {
      importCode: {
        handleImportPath: (str) =>
          str.replace(/^@/, path.resolve(__dirname, './components')),
      },
    },
    plugins: [
        searchPlugin(),
        registerComponentsPlugin({
          componentsDir: path.resolve(__dirname, './components'),
        }),
        containerPlugin({
          type:"demo",
          before: (info) => `
          <ClientOnly>
            <codeShow>
              <template #examples>
                ${info}
              </template>
          `,
          after: () => `</codeShow></ClientOnly>`
        })
    ],
})