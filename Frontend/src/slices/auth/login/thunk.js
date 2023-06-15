//Include Both Helper File with needed methods
import {
  postLogin,
  postLogout,
} from "../../../helpers/backend_helper";
import { removeAuthorization, setAuthorization } from "../../../helpers/api_helper";
import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
import { set } from "lodash";

export const loginUser = (user, history) => async (dispatch) => {

  try {
    let response;
    
    response = postLogin({
      username: user.username,
      password: user.password,
    });

    var data = await response;

    if (data) {
      setAuthorization(data.token);
      localStorage.setItem("authUser", JSON.stringify(data));
      dispatch(loginSuccess(data));
      history('/dashboard')
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await postLogout();
    removeAuthorization();
    localStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));

  } catch (error) {
    dispatch(apiError(error));
  }
};


export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};