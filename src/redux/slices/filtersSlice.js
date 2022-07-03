import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filterStatuses = {
    loading: 'loading',
    idle: 'idle',
    error: 'error',
}

const initialState = {
    filters: [],
    filtersLoadingStatus: filterStatuses.idle,
    activeFilter: 'all',
}

const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/filters");
    }
);

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilters.pending, state => { state.filtersLoadingStatus = filterStatuses.loading; })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = filterStatuses.idle;
                state.filters = action.payload;
            })
            .addCase(fetchFilters.rejected, state => { state.filtersLoadingStatus = filterStatuses.error; })
            .addDefaultCase(() => {  })
    }
});

const { actions, reducer } = filterSlice;

export default reducer;
export { fetchFilters };
export const { activeFilterChanged } = actions;