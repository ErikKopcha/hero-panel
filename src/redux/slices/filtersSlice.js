import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const filterStatuses = {
    loading: 'loading',
    idle: 'idle',
    error: 'error',
}

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: filterStatuses.idle,
    activeFilter: 'all',
});

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    }
});

const { actions, reducer } = filterSlice;

export default reducer;
export const { activeFilterChanged } = actions;