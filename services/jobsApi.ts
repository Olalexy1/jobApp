import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiKey = process.env.EXPO_PUBLIC_JSEARCH_API_KEY;
const apiHost = process.env.EXPO_PUBLIC_JSEARCH_API_HOST;

export const jobsApi = createApi({
    reducerPath: 'jobsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsearch.p.rapidapi.com' }),
    endpoints: (builder) => ({
        getJobsSearch: builder.query({
            query: (params) => ({
                method: 'GET',
                url: '/search', //url of API endpoint
                params: {
                    ...params
                },
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': apiHost,
                },
            })
        }),

        getJobSearchFilters: builder.query({
            query: () => ({
                method: 'GET',
                url: '/search-filters', //url of API endpoint
                params: {
                    query: 'Python developer in Texas, USA',
                },
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': apiHost,
                },
            })
        }),

        getJobDetails: builder.query({
            query: (params) => ({
                method: 'GET',
                url: '/job-details', //url of API endpoint
                params : {
                    ...params
                },
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': apiHost,
                },
            })
        }),

        getJobsEstimatedSalary: builder.query({
            query: () => ({
                method: 'GET',
                url: '/estimated-salary', //url of API endpoint
                params: {
                    job_title: 'NodeJS Developer',
                    location: 'New-York, NY, USA',
                    radius: '100'
                },
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': apiHost,
                },
            })
        }),

    })
})

export const {
    useGetJobsSearchQuery,
    useGetJobSearchFiltersQuery,
    useGetJobDetailsQuery,
    useGetJobsEstimatedSalaryQuery
} = jobsApi