import { createAsyncThunk } from "@reduxjs/toolkit";
//Include Both Helper File with needed methods
import {
  getAllMarketData as getAllMarketDataApi,
  getYearMarketData as getYearMarketDataApi,
  getMonthMarketData as getMonthMarketDataApi,
  getWeekMarketData as getWeekMarketDataApi,
  getHourMarketData as getHourMarketDataApi,
  getTokenData as getTokenDataApi,
  getPerformerData as getTopPerformerApi,
  getMarketGraphData as getMarketGraphDataApi,
  getMarketData as getMarketDataApi

} from "../../helpers/backend_helper";
import { APIClient } from "../../helpers/api_helper";


const api = new APIClient();


export const getTokenData = createAsyncThunk('dashboardCrypto/getTokenData', async () => {
  try {
    let response =  await getTokenDataApi();
    return response;
  } catch (error) {
    return error
  }
});

export const getMarketData = createAsyncThunk('dashboardCrypto/getMarketData', async () => {
  try {
    let response =  await getMarketDataApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const getMarketGraphData = createAsyncThunk('dashboard.getMarketGraphData', async (data) => {
  const url = `/portfolio/v1/tokens/${data}/history`
  try {
    let response = await api.get(url);
    return response;
  } catch (error) {
    return error;
  }
});

// export const getTopPerformers = createAsyncThunk('dashboardCrypto.getTopPerformer', async () => {
//   try {
//     let response = await getTopPerformerApi();
//     return response
//   } catch (error) {
//     return error
//   }
// });


// export const getPortfolioChartsData = createAsyncThunk("dashboardCrypto/getPortfolioChartsData", async (data) => {
//   try {
//     var response;
//     if (data === "btc") {
//       response = getBtcPortfolioDataApi(data);
//     }
//     if (data === "usd") {
//       response = getUsdPortfolioDataApi(data);
//     }
//     if (data === "euro") {
//       response = getEuroPortfolioDataApi(data);
//     }
//     return response;
//   } catch (error) {
//     return error;
//   }
// });

export const getMarketChartsData = createAsyncThunk("dashboardCrypto/getMarketChartsData", async (data) => {
  try {
    var response;

    if (data === "all") {
      response = getAllMarketDataApi(data);
    }
    if (data === "year") {
      response = getYearMarketDataApi(data);
    }
    if (data === "month") {
      response = getMonthMarketDataApi(data);
    }
    if (data === "week") {
      response = getWeekMarketDataApi(data);
    }
    if (data === "hour") {
      response = getHourMarketDataApi(data);
    }
    return response;
  } catch (error) {
    return error;
  }
});