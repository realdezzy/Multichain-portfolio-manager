// import { createSlice } from "@reduxjs/toolkit";

// import { getMarketChartsData} from './thunk';
// export const initialState = {
//   portfolioData: [],
//   marketData: [],
//   error: {}
// };


// const DashboardCryptoSlice = createSlice({
//   name: 'DashboardCrypto',
//   initialState,
//   reducer: {},
//   extraReducers: (builder) => {

//     builder.addCase(getMarketChartsData.fulfilled, (state, action) => {
//       state.marketData = action.payload;
//     });
//     builder.addCase(getMarketChartsData.rejected, (state, action) => {
//       state.error = action.payload.error || null;
//     });
//   }
// });

// export default DashboardCryptoSlice.reducer;