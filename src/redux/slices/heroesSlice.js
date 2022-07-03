import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroesStatuses = {
    loading: 'loading',
    idle: 'idle',
    error: 'error',
}

const initialState = {
    heroes: [],
    heroesLoadingStatus: heroesStatuses.idle
}

const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/heroes");
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => {
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload);
        },
        // * if need prepare payload data
        // heroesFetched: {
        //     reducer: (state, action) => {
        //         state.heroesLoadingStatus = state.heroesLoadingStatus = heroesStatuses.idle;
        //         state.heroes = action.payload;
        //     },
        //     prepare: (heroesList) => {
        //         return {
        //             payload: {
        //                 id: 1,
        //                 list: heroesList
        //             }
        //         }
        //     }
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => { state.heroesLoadingStatus = heroesStatuses.loading; })
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = heroesStatuses.idle;
                state.heroes = action.payload;
            })
            .addCase(fetchHeroes.rejected, state => { state.heroesLoadingStatus = heroesStatuses.error; })
            .addDefaultCase(() => {  })
    }
});

const { actions, reducer } = heroesSlice;

export default reducer;
export { fetchHeroes };
export const { heroCreated, heroDeleted } = actions;