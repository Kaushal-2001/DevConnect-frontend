import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        getLoggedInUser(state, action) {
            return action.payload
        },
    }

})


export const {getLoggedInUser} = userSlice.actions
export default userSlice.reducer

