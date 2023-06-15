//Include Both Helper File with needed methods
import {
  postRegister,
} from "../../../helpers/backend_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange
} from "./reducer";

// initialize relavant method of both Auth

// Is user register successfull then direct plot user in redux.
export const registerUser = (user) => async (dispatch) => {
  try {
    let response;
      response = postRegister(user);
      const data = await response;

      if (data.message === "success") {
        dispatch(registerUserSuccessful(data));
      } else {
        dispatch(registerUserFailed(data));
      }
  } catch (error) {
    dispatch(registerUserFailed(error));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

export const apiError = () => {
  try {
    const response = apiErrorChange();
    return response;
  } catch (error) {
    return error;
  }
};