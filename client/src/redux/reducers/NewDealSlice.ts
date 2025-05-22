import { createSlice } from "@reduxjs/toolkit";

interface TabAccessState {
    newDealActiveTab:number
    dealDataRequestId: string;
}

const initialState: TabAccessState = {
    newDealActiveTab: 0, 
    dealDataRequestId: ""
};

const NewDealSlice = createSlice({
    name: "newDeal",
    initialState,
    reducers: {
        setNewDealActiveTab: (state, action) => {
            state.newDealActiveTab = action.payload; // Update the active tab
        },
        resetNewDealTabAccess: () => initialState, // Resets state to initial values
        setDealDataRequestId: (state, action) => {
            state.dealDataRequestId = action.payload;
        },
    },
});


export const NewDealServices = {
    actions: NewDealSlice.actions, //This includes all the action methods written above
}
const NewDealReducer = NewDealSlice.reducer //This is stored in the main store
export default NewDealReducer 
