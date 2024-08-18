// html转为markdown
import TurndownService from 'turndown'

// html->markdown
const turndownService = new TurndownService()
// 添加自定义规则，移除带锚点链接的 <a> 标签
turndownService.addRule('removeAnchors', {
  filter: (node) => {
    // 选择所有 href 以 "#" 开头的 <a> 标签
    return node.nodeName === 'A' && node.getAttribute('href').startsWith('#')
  },
  replacement: (content) => {
    // 返回标题的纯内容，忽略 <a> 标签
    return content
  }
})
// 添加自定义规则来处理代码块
turndownService.addRule('codeBlock', {
  filter: 'pre',
  replacement: (content, node) => {
    const code = node.querySelector('code')
    const codeContent = code ? code.textContent : content
    return '\n```\n' + codeContent + '\n```\n'
  }
})

export default turndownService
