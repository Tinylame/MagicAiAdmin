# Store 持久化配置说明

## 📁 项目结构（简化版）

```
src/store/
├── constants.js              # 存储常量和工具函数
├── store.js                  # store主文件
├── title/                    # title模块
│   ├── index.js             # title数据处理
│   └── persistConfig.js     # title持久化配置（完全独立）
└── README.md                # 本说明文件
```

## 🔧 配置说明

### 当前配置
- **title模块**: 启用会话存储持久化
- **存储方式**: sessionStorage (关闭标签页后清除)
- **持久化范围**: title模块的所有状态

## 🚀 添加新模块持久化

### 1. 创建模块的持久化配置文件

```javascript
// src/store/user/persistConfig.js
import { STORAGE_TYPE, getStorage } from '../constants';

// 是否启用持久化（在这里控制开关）
export const USER_PERSIST_ENABLED = true;

// 持久化配置
export const userPersistConfig = {
  key: 'user',
  storage: getStorage(STORAGE_TYPE.LOCAL), // 可选择LOCAL或SESSION
};
```

### 2. 在 `store.js` 中导入并使用

```javascript
// src/store/store.js
import userReducer from './user';
import { userPersistConfig, USER_PERSIST_ENABLED } from './user/persistConfig';

const rootReducer = {
  title: createPersistedReducer(titleReducer, titlePersistConfig, TITLE_PERSIST_ENABLED),
  user: createPersistedReducer(userReducer, userPersistConfig, USER_PERSIST_ENABLED),
};
```

## 💡 设计优势

- **🎯 完全独立**: 每个模块完全管理自己的持久化
- **🔧 简单配置**: 只需要在模块内配置，无需额外文件
- **⚡ 即插即用**: 想要持久化就加配置，不要就不加
- **🎛️ 灵活控制**: 每个模块独立选择存储方式和开关

## 🔄 使用方式

### 启用/关闭持久化
修改模块的 `persistConfig.js` 中的 `ENABLED` 变量：
```javascript
export const TITLE_PERSIST_ENABLED = true;  // 启用
export const TITLE_PERSIST_ENABLED = false; // 关闭
```

### 切换存储方式
修改模块的 `persistConfig.js` 中的 `storage` 配置：
```javascript
// 本地存储（永久保存）
storage: getStorage(STORAGE_TYPE.LOCAL)

// 会话存储（关闭标签页清除）
storage: getStorage(STORAGE_TYPE.SESSION)
```