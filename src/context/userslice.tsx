import {createSlice} from '@reduxjs/toolkit';

export const UserData = createSlice({

    name: 'userdata',
    initialState: {
        userdata: {},
    },
    reducers: {
        setuserdata: (state, action) => {
            state.userdata = action.payload
            console.log(action)
        },
    }

})

export const {setuserdata} = UserData.actions
export default UserData.reducer