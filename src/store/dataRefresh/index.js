import { createSlice } from '@reduxjs/toolkit';

const dataRefreshSlice = createSlice({
  name: 'dataRefresh',
  initialState: {
    refreshKey: 0, // 用于触发重新渲染的键
  },
  reducers: {
    triggerRefresh: (state) => {
      state.refreshKey += 1;
    },
  },
});

export const { triggerRefresh } = dataRefreshSlice.actions;
export default dataRefreshSlice.reducer;
