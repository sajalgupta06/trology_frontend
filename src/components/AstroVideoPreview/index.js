import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import ReactPlayer from 'react-player'
import { useHistory } from "react-router";

var Loader = require('react-loaders').Loader;

const AstroVideoPreview = (props) => {
    console.log('==========props', props)
    const { addToast } = useToasts()
    const history = useHistory();
    let range = (start, end) => Array.from(Array(end + 1).keys()).slice(start);
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({ ...props.values });
    const handleDiscardClick = (event) => {
        // TODO: should we also delete from db?
        addToast('Video discarded', {
            appearance: 'success',
            autoDismiss: true,
        })
        history.push("/astro_dashboard_temp");
    }

    const handlePublishClick = async function () {
        console.log(values);
        try {
            setIsLoading(true)
            let data = values;
            let selectedCriterias = []
            values.criterias.filter(c => c.selected).map(c => selectedCriterias.push(c.name))
            data.selectedCriterias = selectedCriterias
            data.expiry_date = `${values.exYear}/${values.exMonth}/${values.exDay}`
            data.selectedOffers = props.selectedOffers && props.selectedOffers.map(o => o.id) || []
            console.log("formdata: ", data)
            let result = await apiRequest("POST", `/astro/publish_embeded_video`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("response data: ", response)
                history.push("/astro_dashboard_temp");
                addToast('Video published successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                })
            } else {
                addToast('Unable to publish Video.', {
                    appearance: 'error',
                    autoDismiss: true,
                })
                console.log('No result from server')
            }
        } catch (error) {
            console.log('error', error)
            let errorMsg = error.message || "Failed retry again."
            addToast(errorMsg, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
        setIsLoading(false)
    }

    return (
        <div class="wrapper">
            {/* <!--header start--> */}
            <header class="sticky hide_mobile">
                <div class="inner_wrapper">
                    <div class="hed_left">
                        <a href="#"><img src="images/logo.png" alt="" /></a>
                    </div>

                </div>
            </header>
            {/* <!--header end--> */}

            {/* <!-- mobile hed--> */}
            <div class="mob_hed">
                <a href="#">{/*<!--img  src="images/back_btn.png" alt=""/--> */}Video Preview</a>
            </div>
            {/* <!-- mobile hed--> */}

            {/* <!--content start--> */}
            <div class="content_bx">
                <div class="inner_wrapper remo_mobile">
                    <div class="vi_deta">
                        <div class="vi_deta_left">
                            <div class="live_govideo">
                                <table>
                                    <tr>
                                        <td><p>Your video is ready to go live!</p></td>
                                        <td><a href="#">Edit details</a></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="vdl_bx">
                                <div class="vdl_bx_video sticky">
                                    <div class="js-video [vimeo, widescreen]">
                                    <ReactPlayer controls="true"
                                        className="react-player"
                                        width="100%"
                                        height="100%"
                                        controls="true"
                                        url={values.thumbnail && values.video_url} 
                                    />
                                    {/* <img src="images/Video_Preview.png" /> */}
                                    </div>
                                </div>
                                <div class="vdl_bx_ii vdl_bx_ii_update">
                                    <div class="vdl_bx_ii_tag">
                                        {values.criterias.filter(c => c.selected).map(f => (
                                            <a href="#">{f.name}</a>
                                        ))}
                                        {/* <a href="#">#mercury_into_scorpio </a> */}
                                    </div>
                                    <div class="vdl_bx_ii_details">
                                        <h4>{values.title}</h4>
                                        <p>{values.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="vi_deta_right updateoffbx">
                            <div class="live_govideo">
                                <table>
                                    <tr>
                                        <td><h5>OFFERS</h5></td>
                                        <td><a href="#">Edit offers</a></td>
                                    </tr>
                                </table>
                            </div>
                            {props.selectedOffers && props.selectedOffers.map((offer) => {
                                return (
                                    <>
                                        <h6 class="enwoffer">OFFER #{offer.id}</h6>
                                            <div class="videpack_sel">
                                                <h5>{offer.title}</h5>
                                                <p>{offer.description}</p>
                                                <table class="price_bx">
                                                    <tr>
                                                        <td><b>₹{offer.price}</b></td>

                                                    </tr>
                                                </table>
                                            </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>

                    <div class="newvideobtn">
                        <ul>
                            <li>
                                <button class="org_btn" onClick={handlePublishClick}>Publish</button>
                            </li>
                            <li>
                                <button class="border_btn" onClick={handleDiscardClick}>Discard</button>
                            </li>
                            {isLoading && renderLoader()}
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!--content end--> */}
        </div>
    )
}

export default AstroVideoPreview
