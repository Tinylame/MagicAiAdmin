export const STORAGE_TYPE = {
  LOCAL: 'localStorage',    // 本地存储 - 持久保存，关闭浏览器也保留
  SESSION: 'sessionStorage' // 会话存储 - 关闭标签页后清除
};

const createAsyncStorage = (storage) => ({
  getItem: (key) => {
    return new Promise((resolve) => {
      resolve(storage.getItem(key));
    });
  },
  setItem: (key, value) => {
    return new Promise((resolve) => {
      storage.setItem(key, value);
      resolve();
    });
  },
  removeItem: (key) => {
    return new Promise((resolve) => {
      storage.removeItem(key);
      resolve();
    });
  }
});

// 获取对应的存储对象
export const getStorage = (type) => {
  switch (type) {
    case STORAGE_TYPE.LOCAL:
      return createAsyncStorage(window.localStorage);
    case STORAGE_TYPE.SESSION:
      return createAsyncStorage(window.sessionStorage);
    default:
      return createAsyncStorage(window.localStorage);
  }
};