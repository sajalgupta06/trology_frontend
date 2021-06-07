import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Input
} from 'reactstrap';
// import { apiRequest } from "../../utils/Api";
import LocalOffers from "../LocalOffers";
import { getOffer } from "../../store/reducers/offers/action";
const OfferList = (props) => {
  const [showNewOffer, setShowNewOffer] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOffer())
  }, [showNewOffer])
  let offerState = useSelector(
    (state) => state.offers
  )
  
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    if (offerState && offerState.offers) {
      setOffers(offerState.offers)
    }
  }, [offerState.offers])
  console.log('==========offerState', offers)
  const handleCreateOffer = function() {
    setShowNewOffer(true)
  }
  const handlePreview = function() {
    console.log('================offers', offers)
    let selectedOffers = offers.filter((offer)=>{
      return offer.isCheck
    })
    console.log('================selectedOffers', selectedOffers)
    // if (selectedOffers && Array.isArray(selectedOffers) && selectedOffers.length > 0) {
      props.updateState('update_step', selectedOffers)
    // } else {
    //   alert('Please select at offer')
    // }
  }
  return (
    <>
      { !showNewOffer &&
        <div>
          <button onClick={handleCreateOffer}>create offer</button>
          <button onClick={handlePreview}>Preview</button>
          <p>offer list</p>
          {
            offers.map((offer)=>{
              return (
                <Card>
                  <CardBody>
                    <Input onChange={(e)=>{
                      console.log('===========e', e.target.checked)
                      let offersTemp = offers.map((tempOffer)=> {
                        return {
                          ...tempOffer,
                          isCheck:tempOffer.id===offer.id ? e.target.checked : tempOffer.isCheck
                        }
                      })
                      console.log('==========offersTemp', offersTemp)
                      setOffers(offersTemp)
                    }} id={offer.id} type="checkbox" />{''}
                    <CardTitle tag="h5">{offer.title}</CardTitle>  
                    <CardSubtitle tag="h6" className="mb-2 text-muted">{offer.description}</CardSubtitle>
                    <CardText>Rs {offer.price}</CardText>
                  </CardBody>
                </Card>

              )
            })
          }
        </div>
      }
      {
        showNewOffer &&
        <div>
          <LocalOffers setShowNewOffer={setShowNewOffer}/>
        </div>
      }
    </>
  )
}
export default OfferList