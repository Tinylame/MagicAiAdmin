// title模块的持久化配置
import { STORAGE_TYPE, getStorage } from '../constants';

// 是否启用持久化（在这里控制开关）
export const TITLE_PERSIST_ENABLED = true;

// title模块的持久化配置
export const titlePersistConfig = {
  key: 'title',                                    // 存储的key
  storage: getStorage(STORAGE_TYPE.SESSION),       // 使用会话存储
  
};