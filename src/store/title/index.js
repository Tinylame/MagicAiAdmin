import { createSlice } from '@reduxjs/toolkit';

export const titleSlice = createSlice({
    name: 'title',
    initialState: {
        isTitle: false,
    },
    reducers: {
        setIsTitle: (state, action) => {
            state.isTitle = action.payload;
        },
        toggleTitle: (state) => {
            state.isTitle = !state.isTitle;
        },
    },
});

export const { setIsTitle, toggleTitle } = titleSlice.actions;

export default titleSlice.reducer;
