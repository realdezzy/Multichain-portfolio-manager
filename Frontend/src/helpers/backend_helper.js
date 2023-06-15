import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postRegister = data => api.create(url.POST_REGISTER, data);

// Login Method
export const postLogin = data => api.create(url.POST_LOGIN, data);

// Logout Method
export const postLogout = data => api.post(url.POST_LOGOUT, {});

// postForgetPwd
export const postForgetPwd = data => api.create(url.POST_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = data => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postProfile = (data) => api.update(url.POST_EDIT_PROFILE + '/' + data.idx, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = data => api.create(url.POST_JWT_LOGIN, data);

// postForgetPwd
export const postJwtForgetPwd = data => api.create(url.POST_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = data => api.create(url.SOCIAL_LOGIN, data);


// Dashboard Crypto
// Portfolio
export const getBtcPortfolioData = () => api.get(url.GET_BTCPORTFOLIO_DATA);
export const getUsdPortfolioData = () => api.get(url.GET_USDPORTFOLIO_DATA);
export const getEuroPortfolioData = () => api.get(url.GET_EUROPORTFOLIO_DATA);
export const getTokenData = () => api.get(url.GET_TOKEN_DATA);
export const getNewsData = () => api.get(url.GET_NEWS_DATA);
export const getPerformerData = async () => api.get(url.GET_PERFORMER_DATA);

export const getMarketData = async () => api.get(url.GET_MARKET_DATA);
export const getMarketGraphData = async (data) => api.create(url.GET_MARKET_GRAPH_DATA, data);

export const addToken = (tokenData) => api.create(url.ADD_TOKEN, tokenData);

// Market Graph
export const getAllMarketData = () => api.get(url.GET_ALLMARKETDATA_DATA);
export const getYearMarketData = () => api.get(url.GET_YEARMARKET_DATA);
export const getMonthMarketData = () => api.get(url.GET_MONTHMARKET_DATA);
export const getWeekMarketData = () => api.get(url.GET_WEEKMARKET_DATA);
export const getHourMarketData = () => api.get(url.GET_HOURMARKET_DATA);
