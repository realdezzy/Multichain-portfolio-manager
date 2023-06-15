import { createSlice } from "@reduxjs/toolkit";

import { getTokenData, getMarketData, getMarketGraphData } from './thunk';

export const initialState = {
    tokenData: [],
    marketData: [],
    marketGraphData: [],
    loading: false,
    error: ''
  }
  
  const DashboardCryproNewSlice = createSlice({
    name: 'NewDashboardCrypto',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getTokenData.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(getTokenData.fulfilled, (state, action) => {
          state.tokenData = action.payload;
          state.loading = false;
      });
      builder.addCase(getTokenData.rejected, (state, action) => {
        state.error = action.payload.error;
      });
      builder.addCase(getMarketData.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(getMarketData.fulfilled, (state, action) => {
        state.marketData = action.payload;
      });
      builder.addCase(getMarketData.rejected, (state, action) => {
        state.error = action.payload.error;
      });
      builder.addCase(getMarketGraphData.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(getMarketGraphData.fulfilled, (state, action) => {
          state.marketGraphData = action.payload;
          state.loading = false;
      });
      builder.addCase(getMarketGraphData.rejected, (state, action) => {
        state.error = action.payload.error;
      });
    }
  })
  
  export default DashboardCryproNewSlice.reducer