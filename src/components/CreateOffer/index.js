import React, {useState, useEffect} from 'react'
import '../Offer/style.scss'
import { useSelector, useDispatch } from "react-redux";
import NewOffer from "../Offer/newOffer";
// import { apiRequest } from "../../utils/Api";
// import { getOffer } from "../../store/reducers/offers/action";
const CreateOffer = (props) => {
    // const dispatch = useDispatch();
    // let offerState = useSelector(
    //     (state) => state.offers
    // );
    // console.log('==========offers', offerState)
    // const [localOffers, setlOcalOffers] = useState(offerState && offerState.offers ? offerState.offers: []);
    // console.log('=============localOffers', localOffers)
    // const [showNewOffer, setShowNewOffer] = useState(offerState && offerState.offers.length ===0);
    // useEffect(() => {
        // dispatch(getOffer())
        // let offer = {
        //     title: 'test',
        //     description: 'test desc',
        //     price: '12',
        //     offer_type: '',
        //     offerId: 1
        // }
        // let result =  apiRequest("GET", `/astro/offers`)
        // let result =  apiRequest("POST", `/astro/create_offer`, offer)
        // let result =  apiRequest("DELETE", `/astro/delete_offer`, offer)
        // console.log('==========result', result)
    // }, []);
    const [localOffers, setlOcalOffers] = useState([]);
    const [showNewOffer, setShowNewOffer] = useState(true);

    return(
        <>
          {localOffers.map((offer)=> {
            return (<NewOffer offer={offer} localOffers={localOffers} setlOcalOffers={setlOcalOffers} showNewOffer={showNewOffer}/>)
          })}
          {<div class="grabg_box">&nbsp;</div>}
          {showNewOffer && <NewOffer localOffers={localOffers} setlOcalOffers={setlOcalOffers} showNewOffer={showNewOffer}/>}
          {<div class="poced_btn">
                <button>Save & Preview</button>
              </div>}
          {/* <NewOffer offers={offers}/> */}
        </>
        
    )
}
export default CreateOffer