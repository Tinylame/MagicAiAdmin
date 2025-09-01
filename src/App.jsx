import AppStyle from './styles/App.module.scss'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './utils/nprogress' // 导入 NProgress 配置

function App() {
  return (
    <div className={ AppStyle.App}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
