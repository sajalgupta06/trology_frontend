import React, {useState, useEffect} from 'react'
import NewOffer from "./NewOffer";
import { apiRequest } from "../../utils/Api";
import './styles.scss'

const LocalOffers = (props)=>{
  const [offers, setOffers] = useState([])

  const [isNew, setIsNew] = useState(offers.length === 0)
  console.log('===================main offers', offers)
  const onSaveClick = async function() {
    let result =  await apiRequest("POST", `/astro/create_offer`, {offers: offers})
    if (result) {
      props.setShowNewOffer(false)
    }
    console.log('============result', result)
  }
  return (
    <>
      <div class="gray_bg">
        <div class="wrapper">
          <div class="mob_hed">
            <a href="#"><img src="images/back_btn.png" alt=""/> Offers</a>
          </div>
          <div class="content_bx">
          <div class="grabg_box">&nbsp;</div>
            <div class="inner_wrapper ab_vinner">
            <div class="wpay index99">
                <div class="offer">
                  <p class="Create">Create customised offers for your audience.</p>
                  {offers.map((offer)=>{
                    return (<NewOffer offer={offer} isNew={false}/>)
                    // <NewOffer offer={offer} isNew={false}/>
                  })}
                  {!isNew && <a onClick={()=>{setIsNew(!isNew)}} class="Add_Offer" href="#">Add Offer</a>}
                  {isNew && <NewOffer setIsNew={setIsNew} offers={offers} setOffers={setOffers} offer={{offerId: offers.length + 1}} isNew={true} />}
                  {/* <a class="Add_Offer" href="#">Add Offer</a> */}
                </div>
                <div class="poced_btn">
                  <button onClick={onSaveClick}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default LocalOffers