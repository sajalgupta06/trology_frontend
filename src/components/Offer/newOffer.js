import React, {useState} from "react"
import { useToasts } from 'react-toast-notifications'
import './style.scss'

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
    let offers = [...props.localOffers]
    console.log('========offers', offers)
    if (!title || !description || !price) {
      addToast('Title, description and price all are the required fields.', {
        appearance: 'error',
        autoDismiss: false,
      })
    } else {
      let offer = {
        title: title,
        description: description,
        price: price,
        // offer_type: offer_type,
        localId: new Date().getTime()
      }
      offers.push(offer)
      props.setlOcalOffers(offers)
      addToast('Offer Created Successfully.', {
        appearance: 'success',
        autoDismiss: true,
      })
    }
  }
  return (
    <div>
      <div class="mob_hed">
        <a href="#"><img src="images/back_btn.png" alt=""/> Offers</a>
      </div>
      <div class="content_bx">
        {/* <div class="grabg_box">&nbsp;</div> */}
          <div class="inner_wrapper ab_vinner">
        
          <div class="wpay index99 wpay-dev">
              
            
              <div class="offer">
                {/* <p class="Create">Create customised offers for your audience.</p> */}
                
                
                <div class="offer_inner_top">
                  <a onClick={handleDeleteOffer} class="Delete_text" href="#">Delete</a>
                  <div class="offer_inner">
                    <h5>OFFER #1</h5>
                    
                    
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
                          onChange={(e)=>{
                            setPrice(e.target.value)
                          }}
                          type="text" class="form-control" id="" placeholder=""/>
                          </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                
                {/* <div class="offer_inner_top noborder">
                  <a class="Delete_text" href="#">Delete</a>
                  <div class="offer_inner">
                    <h5>OFFER #1</h5>
                    
                    
                    <div class="vf_bx">
                      <p class="in_tex_title">Offer title</p>
                      <div class="in_tex">
                        <input type="text" class="form-control" placeholder="Enter offer title"/>
                      </div>
                    </div>
                    <div class="vf_bx">
                      <p class="in_tex_title">Add description</p>
                      <div class="in_tex">
                        <textarea placeholder="Explain more about the offer"></textarea>
                      </div>
                    </div>
                    
                    <div class="vf_bx">
                      <p class="in_tex_title">Price</p>
                      <div class="in_tex in_tex_new">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <select id="" class="form-control sel_drop">
                            <option selected>$</option>
                            <option>Rs</option>
                            </select>
                          </div>
                          <input type="text" class="form-control" id="" placeholder=""/>
                          </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                
                 */}
                
                <a onClick={handleAddOffer} class="Add_Offer" href="#">Add Offer</a>
                
                
              </div>
              
              {/* <div class="poced_btn">
                <button>Save & Preview</button>
              </div> */}
              
            </div>
          
          
          
          </div>
        </div>
    </div>
  )
}
export default NewOffer
