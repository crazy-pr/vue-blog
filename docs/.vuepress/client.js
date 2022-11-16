import {
    defineClientConfig
} from '@vuepress/client'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import CodeShow from './components/codeShow.vue'
import Test from './components/test.vue'

export default defineClientConfig({
    enhance({
        app,
        router,
        siteData
    }) {
        app.use(ElementPlus)
        app.component('CodeShow', CodeShow)
        app.component('Test', Test)
    },
    setup() {},
    rootComponents: [],
})