import React, {useState, useEffect} from 'react'
import { useToasts } from 'react-toast-notifications'

import './styles.scss'
const NewOffer = (props) => {
  const { addToast } = useToasts()
  console.log('============props', props)
  let offer = props.offer
  const [title, setTitle] = useState(offer ? offer.title:'');
  const [description, setDescription] = useState(offer? offer.description:'');
  const [price, setPrice] = useState(offer ? offer.price:'');
  const handleDeleteOffer = function(e) {
    let offers = [...props.localOffers]
    offers = offers.filter((item) => item.localId !== props.offer.localId);
    props.setlOcalOffers(offers)
    addToast('Offer Deleted Successfully.', {
      appearance: 'success',
      autoDismiss: true,
    })
  }
  
  const handleAddOffer = function() {
    
    let localOffers = props.offers
    console.log('========props.offers', localOffers)
    // return
    // console.log('========offers', localOffers)
    if (!title || !description || !price) {
      addToast('Title, description and price are all the required fields.', {
        appearance: 'error',
        autoDismiss: false,
      })
    } else {
      let offer = {
        title: title,
        description: description,
        price: price,
        offerId: localOffers.length + 1,
        // offer_type: offer_type,
        localId: new Date().getTime()
      }
      localOffers.push(offer)
      props.setOffers(localOffers)
      props.setIsNew(false)
      addToast('Offer Created Successfully.', {
        appearance: 'success',
        autoDismiss: true,
      })
    }
  }
  
  return (
    <>
      <div className={`offer_inner_top ${props.isNew?'':'disable-offer'}`}>
						{!props.isNew && <a onClick={handleDeleteOffer} class="Delete_text" href="#">Delete</a>}
						<div class="offer_inner">
							<h5>OFFER #{offer.offerId}</h5>
							
							
							<div class="vf_bx">
								<p class="in_tex_title">Offer title</p>
								<div class="in_tex">
                  <input 
                  defaultValue={title}
                  onChange={(e)=>{
                    setTitle(e.target.value)
                  }} 
                  type="text" class="form-control" placeholder="Enter offer title"/>
								</div>
							</div>
							<div class="vf_bx">
								<p class="in_tex_title">Add description</p>
								<div class="in_tex">
                  <textarea
                  defaultValue={description}
                  onChange={(e)=>{
                    setDescription(e.target.value)
                  }} 
                  placeholder="Explain more about the offer"></textarea>
								</div>
							</div>
							
							<div class="vf_bx">
								<p class="in_tex_title">Price</p>
								<div class="in_tex in_tex_new">
									 <div class="input-group">
										<div class="input-group-prepend">
										   <select id="" class="form-control sel_drop">
											{/* <option selected>$</option> */}
											<option>Rs</option>
										  </select>
										</div>
                    <input 
                    defaultValue={price}
                    onChange={(e)=>{
                      setPrice(e.target.value)
                    }}
                    type="text" class="form-control" id="" placeholder=""/>
									  </div>
								</div>
							</div>
							
						</div>
					</div>
          {props.isNew && <a onClick={handleAddOffer} class="Add_Offer" href="#">Add Offer</a>}
    </>
  )   
}
export default NewOffer