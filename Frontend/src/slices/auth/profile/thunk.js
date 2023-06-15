//Include Both Helper File with needed methods
import { postProfile } from "../../../helpers/backend_helper";

// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";


export const editProfile = (user) => async (dispatch) => {
    try {
        let response;


        response = postProfile(user);
        const data = await response;

        if (data) {
            dispatch(profileSuccess(data));
        }

    } catch (error) {
        dispatch(profileError(error));
    }
};

export const resetProfileFlag = () => {
    try {
        const response = resetProfileFlagChange();
        return response;
    } catch (error) {
        return error;
    }
};