import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  minimum: 0.1,
  showSpinner: false,
  speed: 500,
  trickle: true,
  trickleRate: 0.02,
  trickleSpeed: 800
})

// 自定义样式 - 使用蓝色主题
const style = document.createElement('style')
style.textContent = `
  #nprogress .bar {
    background:rgb(86, 24, 255) !important;
    height: 3px !important;
  }
  
  #nprogress .peg {
    box-shadow: 0 0 10px #1890ff, 0 0 5px #1890ff !important;
  }
`
document.head.appendChild(style)

export default NProgress
