import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    error:null,
    loading:false
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart : (state)=>{
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure : (state,action)=>{
            state.error= action.payload;
            state.loading= false;

        },
        deleteUserStart :(state,action)=>{
            state.loading = true;

        },
        deleteUserSuccess : (state)=>{
            state.currentUser=null;
            state.loading = false;
            state.error = null;

        },
        deleteUserFailure:(state,action)=>{
            state.error= action.payload;
            state.loading= false;

        },
        signOutUserStart :(state,action)=>{
            state.loading = true;

        },
        signOutUserSuccess : (state)=>{
            state.currentUser=null;
            state.loading = false;
            state.error = null;

        },
        signOutUserFailure:(state,action)=>{
            state.error= action.payload;
            state.loading= false;

        },
        
        updateUserStart:(state)=>{
            state.loading = true;  
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
            
        },
        
    }
})

export const {signInStart,signInSuccess,signInFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutUserStart,signOutUserSuccess,signOutUserFailure,updateUserFailure,updateUserStart,updateUserSuccess} = userSlice.actions;

export default userSlice.reducer;


// The userSlice.reducer is exported and combined into the store.
// The signInStart, signInSuccess, and signInFailure action creators are dispatched to update the state.