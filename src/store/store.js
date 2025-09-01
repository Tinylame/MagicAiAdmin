import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import titleReducer from './title';
import dataRefreshReducer from './dataRefresh';
import { titlePersistConfig, TITLE_PERSIST_ENABLED } from './title/persistConfig';

// 根据模块配置决定是否持久化每个reducer
const createPersistedReducer = (reducer, persistConfig, enabled) => {
  if (enabled && persistConfig) {
    // 如果启用持久化，使用persistReducer包装
    return persistReducer(persistConfig, reducer);
  }
  // 如果不启用持久化，直接返回原reducer
  return reducer;
};

// 配置所有reducer
const rootReducer = {
  title: createPersistedReducer(titleReducer, titlePersistConfig, TITLE_PERSIST_ENABLED),
  dataRefresh: dataRefreshReducer, // 不需要持久化
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
