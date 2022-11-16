<template><div><p><a href="https://v2.vuepress.vuejs.org/zh/" target="_blank" rel="noopener noreferrer">基于vuepress2.X版本<ExternalLinkIcon/></a></p>
<blockquote>
<p>vuepress@2.X</p>
<p>vue@3.X</p>
<p>elementPlus@2.x</p>
</blockquote>
<h1 id="docs-目录下" tabindex="-1"><a class="header-anchor" href="#docs-目录下" aria-hidden="true">#</a> /docs 目录下</h1>
<h2 id="规范" tabindex="-1"><a class="header-anchor" href="#规范" aria-hidden="true">#</a> 规范</h2>
<ol>
<li><code v-pre>/docs/readme.md</code>或<code v-pre>/docs/index.md</code>会被视为网站首页，其路由为<code v-pre>/</code>;</li>
<li>文件夹及md文件均以<code v-pre>小驼峰命名</code>；</li>
<li>约定以<code v-pre>Group</code>结尾的文件夹将会作为一个组；</li>
<li><code v-pre>Group文件夹</code>可以创建<code v-pre>config.json</code>文件用于配置组信息，若没有则以注释内容配置组信息，格式如下：</li>
</ol>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>        <span class="token punctuation">{</span>
          <span class="token property">"text"</span><span class="token operator">:</span> <span class="token string">"测试分组"</span><span class="token punctuation">,</span> <span class="token comment">// 没有则以文件夹名称为text</span>
          <span class="token property">"order"</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token comment">// 组排序，number类型，没有则为0</span>
          <span class="token property">"collapsable"</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token comment">// 组默认展开或收起，不写默认false</span>
          <span class="token comment">// 其他组配置项</span>
        <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5">
<li>每个<code v-pre>Group文件夹</code>文件夹下面的<code v-pre>index.md</code>或者<code v-pre>readme.md</code>文件将会被视为该分组下首页，其路由为<code v-pre>/xxxGroup/</code>；</li>
<li>每个<code v-pre>.md</code>文件第一行应为如下<a href="https://v2.vuepress.vuejs.org/zh/guide/page.html#frontmatter" target="_blank" rel="noopener noreferrer">格式<ExternalLinkIcon/></a>，均为可选：</li>
</ol>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>        ---
        title<span class="token operator">:</span> '介绍' <span class="token comment">// 没有则以文件名称为title</span>
        order<span class="token operator">:</span> <span class="token number">0</span> <span class="token comment">// number类型，没有则为0</span>
        ---
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意key-value间的空格</strong>，生成侧边栏数据时会读取<code v-pre>.md</code>文件夹下第一行的该声明内容，若未声明，则会以文件名为左侧标题名称且排序为0，文档搜索也是依据该格式下的title；</p>
<h2 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项" aria-hidden="true">#</a> 注意事项</h2>
<ol>
<li>每次增删<code v-pre>.md</code>文件或组都需要重新生成一下侧边栏数据；</li>
<li>同级目录下存在<code v-pre>index.md</code>和<code v-pre>readme.md</code>，左侧栏都会显示这两个路由名，但内容为后生成路由的那个文件；</li>
<li>非<code v-pre>Group</code>结尾的文件夹下的文件，将会以一级菜单形式粗在于左侧栏；</li>
<li><code v-pre>/.vuepress/components</code>文件夹存放的是vue3.x组件，不会自动全局注册，需要在<code v-pre>.vuepress/client.js</code>中<code v-pre>enhance</code>下注册，可以在<code v-pre>.md</code>文件中直接使用；</li>
<li><code v-pre>/.vuepress/components</code>文件夹下<code v-pre>codeShow.vue</code>是用于组件演示使用，类似于element组件库演示那种类型，具体参考底部示例；</li>
<li>侧边栏默认是全展开的形式；</li>
<li>文中有二级标题的，点击该导航后将会在侧边栏生成二级导航，这种就是一篇到底的形式，采用锚点定位方式，如本页。</li>
<li>打包后的<code v-pre>/dist</code>文件夹在<code v-pre>.vuepress</code>文件夹下</li>
</ol>
<h2 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h2>
<p>先生成侧边栏目录：</p>
<p><code v-pre>npm run nav</code></p>
<p>会生成/utils/sidebar.js文件，里面是侧边栏的数组</p>
<p>本地运行：</p>
<p><code v-pre>npm run dev</code></p>
<p>打包：</p>
<p><code v-pre>npm run build</code></p>
<h2 id="codeshow演示" tabindex="-1"><a class="header-anchor" href="#codeshow演示" aria-hidden="true">#</a> codeShow演示</h2>
<p><strong>注意：直接预览md文件不会渲染组件</strong></p>
<CodeShow>
  <template #examples>
    <Test />
  </template>
<div class="language-vue line-numbers-mode" data-ext="vue"><pre v-pre class="language-vue"><code>        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>primary<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>按钮<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>

        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
        </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">></span></span><span class="token style"><span class="token language-css">
        </span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeShow>
<h2 id="相关链接" tabindex="-1"><a class="header-anchor" href="#相关链接" aria-hidden="true">#</a> 相关链接</h2>
<p><a href="https://v2.vuepress.vuejs.org/zh/" target="_blank" rel="noopener noreferrer">vuepress<ExternalLinkIcon/></a></p>
<p><a href="https://gitee.com/mosowe/vuepress3" target="_blank" rel="noopener noreferrer">码云地址<ExternalLinkIcon/></a></p>
</div></template>


