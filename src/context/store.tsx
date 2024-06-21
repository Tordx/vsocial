import {configureStore} from '@reduxjs/toolkit';
import userslice from './userslice';
import itemslice from './itemslice';


export default configureStore({

    reducer: {
        _userdata : userslice,
        _itemdata : itemslice,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    
})