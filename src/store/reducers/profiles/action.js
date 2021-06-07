import { apiRequest } from "../../../utils/Api";
import { PROFILE } from "./action.type";



export const getProfile = () => {
  let url = `/user/profile`;

  return dispatch => {
    apiRequest("GET", url)
      .then(result => {
        const data = JSON.parse(JSON.parse(result).data);
        const action = {
          type: PROFILE.FETCH_PROFILE_REQUEST_SUCCESS,
          data: data.result
        };
        dispatch(action);
      })
      .catch(err => {
        const action = {
          type: PROFILE.FETCH_PROFILE_REQUEST_FAILURE,
        }
        dispatch(action);
      });
  };
};

export const logout = () => {
  return dispatch => {
    dispatch({
      type: PROFILE.LOGOUT
    })
  }
}
