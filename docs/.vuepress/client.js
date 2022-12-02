import {
    defineClientConfig
} from '@vuepress/client'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineClientConfig({
    enhance({
        app,
        router,
        siteData
    }) {
        app.use(ElementPlus)
        // 自动注册components下的vue组件
        const ctx =
            import.meta.globEager('./components/*.vue')

        Object.keys(ctx).forEach((item) => {
            const component = ctx[item].default
            app.component(item.replace(/(\.\/components\/)|(\.vue)/g, ''), component)
        })
    },
    setup() {},
    rootComponents: [],
})