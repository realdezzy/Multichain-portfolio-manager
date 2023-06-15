import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer"

//Include Both Helper File with needed methods

import {
  postForgetPwd,
} from "../../../helpers/backend_helper";

export const userForgetPassword = (user, history) => async (dispatch) => {
  try {
    let response;
      
    response = postForgetPwd(
        user.email
    )
    const data = await response;

    if (data) {
        dispatch(userForgetPasswordSuccess(
            "Reset link are sended to your mailbox, check there first"
        ))
    }
  } catch (forgetError) {
      dispatch(userForgetPasswordError(forgetError))
  }
}