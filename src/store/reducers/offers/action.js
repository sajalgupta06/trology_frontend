import { apiRequest } from "../../../utils/Api";
import { OFFER } from "./action.type";



export const getOffer = () => {
  let url = `/astro/offers`;

  return dispatch => {
    apiRequest("GET", url)
      .then(result => {
        const data = JSON.parse(JSON.parse(result).data);
        const action = {
          type: OFFER.FETCH_OFFER_REQUEST_SUCCESS,
          data: data.result
        };
        dispatch(action);
      })
      .catch(err => {
        const action = {
          type: OFFER.FETCH_OFFER_REQUEST_FAILURE,
        }
        dispatch(action);
      });
  };
};