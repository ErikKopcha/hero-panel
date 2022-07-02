import { createStore } from 'redux';
import { combineReducers } from "@reduxjs/toolkit";
import heroes from "../reducers/heroes";
import filters from "../reducers/filters";

const rootReducer = combineReducers({
    heroes,
    filters
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;