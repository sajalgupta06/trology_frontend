import { PROFILE } from "./action.type";
const initialState = {
  isLoaded: false,
  isError: false,
  profile: {}
};
const profileInfo = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE.FETCH_PROFILE_REQUEST_SUCCESS:
      return { ...state, isLoaded: true, profile: action.data, isError:false };
    case PROFILE.FETCH_PROFILE_REQUEST_FAILURE:
      return { ...state, isLoaded: true, profile: {}, isError:true };
    case PROFILE.LOGOUT:
      return {...state, ...initialState};
    default:
      return {...state};
  }
};
export default profileInfo;