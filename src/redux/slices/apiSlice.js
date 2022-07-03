import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    tagTypes: ['Heroes', 'Filters'],
    endpoints: builder => ({
        getHeroes: builder.query({
            query: () => `/heroes`,
            providesTags: ['Heroes']
        }),
        createHero: builder.mutation({
            query: hero => ({
                url: '/heroes',
                method: 'POST',
                body: hero
            }),
            invalidatesTags: ['Heroes']
        }),
        deleteHero: builder.mutation({
            query: id => ({
                url: `/heroes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Heroes']
        }),
        getFilters: builder.query({
            query: () => '/filters',
            providesTags: ['Filters']
        })
    })
});

export default apiSlice;
export const {
    useGetHeroesQuery,
    useCreateHeroMutation,
    useDeleteHeroMutation,
    useGetFiltersQuery
} = apiSlice;