import {createSlice} from '@reduxjs/toolkit';

export const ItemID = createSlice({

    name: 'itemId',
    initialState: {
        itemId: {},
    },
    reducers: {
        setItemId: (state, action) => {
            state.itemId = action.payload
            console.log(action)
        },
    }

})

export const {setItemId} = ItemID.actions
export default ItemID.reducer