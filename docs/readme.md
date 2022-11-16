---
 title: '介绍'
 order: 0
---

[基于vuepress2.X版本](https://v2.vuepress.vuejs.org/zh/)

> vuepress@2.X
>
> vue@3.X
>
> elementPlus@2.x

# /docs 目录下

## 规范

1. `/docs/readme.md`或`/docs/index.md`会被视为网站首页，其路由为`/`;
2. 文件夹及md文件均以`小驼峰命名`；
3. 约定以`Group`结尾的文件夹将会作为一个组；
4. `Group文件夹`可以创建`config.json`文件用于配置组信息，若没有则以注释内容配置组信息，格式如下：

  ```json
          {
            "text": "测试分组", // 没有则以文件夹名称为text
            "order": 2, // 组排序，number类型，没有则为0
            "collapsable": false // 组默认展开或收起，不写默认false
            // 其他组配置项
          }
  ```

5. 每个`Group文件夹`文件夹下面的`index.md`或者`readme.md`文件将会被视为该分组下首页，其路由为`/xxxGroup/`；
6. 每个`.md`文件第一行应为如下[格式](https://v2.vuepress.vuejs.org/zh/guide/page.html#frontmatter)，均为可选：

  ```json
          ---
          title: '介绍' // 没有则以文件名称为title
          order: 0 // number类型，没有则为0
          ---
  ```

**注意key-value间的空格**，生成侧边栏数据时会读取`.md`文件夹下第一行的该声明内容，若未声明，则会以文件名为左侧标题名称且排序为0，文档搜索也是依据该格式下的title；

## 注意事项

1. 每次增删`.md`文件或组都需要重新生成一下侧边栏数据；
2. 同级目录下存在`index.md`和`readme.md`，左侧栏都会显示这两个路由名，但内容为后生成路由的那个文件；
3. 非`Group`结尾的文件夹下的文件，将会以一级菜单形式粗在于左侧栏；
4. `/.vuepress/components`文件夹存放的是vue3.x组件，不会自动全局注册，需要在`.vuepress/client.js`中`enhance`下注册，可以在`.md`文件中直接使用；
5. `/.vuepress/components`文件夹下`codeShow.vue`是用于组件演示使用，类似于element组件库演示那种类型，具体参考底部示例；
6. 侧边栏默认是全展开的形式；
7. 文中有二级标题的，点击该导航后将会在侧边栏生成二级导航，这种就是一篇到底的形式，采用锚点定位方式，如本页。
8. 打包后的`/dist`文件夹在`.vuepress`文件夹下

## 运行

先生成侧边栏目录：

`npm run nav`

会生成/utils/sidebar.js文件，里面是侧边栏的数组

本地运行：

`npm run dev`

打包：

`npm run build`

## codeShow演示

**注意：直接预览md文件不会渲染组件**

<CodeShow>

  <template #examples>
    <Test />
  </template>

```vue
        <template>
          <div>
            <el-button type="primary">按钮</el-button>
          </div>
        </template>

        <script setup>
        </script>

        <style>
        </style>
```

</CodeShow>

## 相关链接

[vuepress](https://v2.vuepress.vuejs.org/zh/)

[码云地址](https://gitee.com/mosowe/vuepress3)
