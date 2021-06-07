import { OFFER } from "./action.type";
const initialState = {
  isLoaded: false,
  isError: false,
  offers: []
};
const offerInfo = (state = initialState, action) => {
  switch (action.type) {
    case OFFER.FETCH_OFFER_REQUEST_SUCCESS:
      return { ...state, isLoaded: true, offers: action.data.offers, isError:false };
    case OFFER.FETCH_OFFER_REQUEST_FAILURE:
      return { ...state, isLoaded: true, offers: [], isError:true };
    default:
      return {...state};
  }
};
export default offerInfo;