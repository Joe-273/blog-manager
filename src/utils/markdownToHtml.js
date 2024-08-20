// markdown转为html
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

// markdown->html
const md = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    // 直接渲染代码块，不应用语言类
    return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})
md.use(markdownItAnchor, {
  level: [1, 2, 3, 4, 5, 6], // 生成锚链接的标题级别
  permalink: true, // 显示锚链接
  permalinkBefore: true, // 锚链接显示在标题前面
  permalinkSymbol: '' // 锚链接的符号
})

export default md
