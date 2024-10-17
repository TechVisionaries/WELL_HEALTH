import { apiSlice } from "./apiSlice";

const SHIFTS_URL = '/api/shifts';

export const shiftsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAvailableStaff: builder.mutation({
            query: ({date}) => ({
                url: `${SHIFTS_URL}/available-staff?date=${date}`,
                method: 'GET'
            })
        }),
        getShifts: builder.mutation({
            query: ({date, shift, location}) => ({
                url: `${SHIFTS_URL}/all?date=${date}&shift=${shift}&location=${location}`,
                method: 'GET'
            })
        }),
        assignStaff: builder.mutation({
            query: (data) => ({
                url: `${SHIFTS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        // updateUser: builder.mutation({
        //     query: (data) => ({
        //         url: `${SHIFTS_URL}/profile`,
        //         method: 'PUT',
        //         body: data,
        //     }),
        // }),
        // deleteUser: builder.mutation({
        //     query: (id) => ({
        //         url: `${SHIFTS_URL}/${id}`,
        //         method: 'DELETE',
        //     }),
        // }),
    }),
});

export const { useGetAvailableStaffMutation, useAssignStaffMutation, useGetShiftsMutation } = shiftsApiSlice;