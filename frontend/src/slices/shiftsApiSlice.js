import { apiSlice } from "./apiSlice";

const SHIFTS_URL = '/api/shifts';

export const shiftsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAvailableStaff: builder.mutation({
            query: ({date, shift}) => ({
                url: `${SHIFTS_URL}/available-staff?date=${date}&shift=${shift}`,
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
        removeStaff: builder.mutation({
            query: (data) => ({
                url: `${SHIFTS_URL}`,
                method: 'DELETE',
                body: data,
            }),
        }),
    }),
});

export const { useGetAvailableStaffMutation, useAssignStaffMutation, useGetShiftsMutation, useRemoveStaffMutation } = shiftsApiSlice;