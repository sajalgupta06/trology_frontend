import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import ReactPlayer from 'react-player'
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useHistory } from "react-router-dom";
import moment from 'moment';

const VideoDetail = (props) => {
    console.log('===========props.videoId', props.videoId)
    const state = useSelector(
        (state) => state
    );
    const [videoDetail, setVideoDetail] = useState({})
    const [videoState, setVideoState] = useState({})
    const [videoPlayed, setVideoPlayed] = useState(false)
    useEffect(() => {
        apiRequest("GET", `/user/video_detail/${props.videoId}/`)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                setVideoDetail(data.result)
                if (data.result.state !== null) {
                    setVideoState(data.result.state)
                }
                console.log("data", data)
            })
            .catch(err => {
                console.log("error: ", err)
            });
    }, [])
    console.log('=======state', state)
    const handleStateClick = async (event) => {
        console.log('handleStateClick')
        event.persist()
        let event_type = event.target.dataset.event_type
        console.log(event_type)
        try {
            let data = {
                videoId: props.videoId,
                event_type: event_type
            };
            console.log("formdata: ", data)
            let result = await apiRequest("POST", `/user/update_video_state`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("response data: ", response)
                setVideoState({ ...response.result.state })
                setVideoDetail({ ...videoDetail, likes_count: response.result.likes_count, dislikes_count: response.result.dislikes_count })
            } else {
                console.log('No result from server')
            }
        } catch (error) {
            console.log('error', error)
            let errorMsg = error.message || "Failed retry again."
            console.log(errorMsg)
        }
        event.preventDefault()
    }
    const handleVideoPlayed = async () => {
        console.log('handleVideoPlayed')
        if (!videoPlayed) {
            try {
                let data = {
                    videoId: props.videoId,
                    astroId: videoDetail.id,
                };
                console.log("formdata: ", data)
                let result = await apiRequest("POST", `/user/update_views_count`, data)
                if (result) {
                    let response = JSON.parse(JSON.parse(result).data)
                    console.log("response data: ", response)
                    setVideoPlayed(true)
                } else {
                    console.log('No result from server')
                }
            } catch (error) {
                console.log('error', error)
                let errorMsg = error.message || "Failed retry again."
                console.log(errorMsg)
            }
        }
    }
    let history = useHistory();
    return (
        <>
            {/* <!-- mobile hed--> */}
            <div class="mob_hed">
                <a href="#" onClick={() => history.goBack()}><img src="/images/back_btn.png" alt="" />{videoDetail.title}</a>
            </div>
            {/* <!-- mobile hed--> */}
            <div class="wrapper video_detail_comp">
                {/* <!--content start--> */}
                <div class="content_bx">
                    <div class="inner_wrapper remo_mobile">
                        <div class="vi_deta">
                            <div class="vi_deta_left">
                                <div class="vdl_bx">
                                    <div class="vdl_bx_video sticky player-wrapper">
                                        <ReactPlayer
                                            className="react-player"
                                            width="100%"
                                            height="100%"
                                            controls="true"
                                            url={videoDetail.video_url}
                                            onPlay={handleVideoPlayed}
                                        />
                                        {/* <img src="/images/video.png" /> */}
                                    </div>
                                    <div class="vdl_bx_ii">
                                        <div class="vdl_bx_ii_tag">
                                            {/* Hide criteira for now */}
                                            {/* {videoDetail.selectedCriterias && videoDetail.selectedCriterias.map(c => (
                                                <a href="#">#{c.criteria}</a>
                                            ))} */}
                                            {/* <a href="#">#tagname</a>
                                        <a href="#">#tagname</a>
                                        <a href="#">#tagname</a> */}
                                        </div>
                                        <div class="vdl_bx_ii_details">
                                            <h4>{videoDetail.title}</h4>
                                            <p>{videoDetail.description}</p>
                                            <h10>{moment(videoDetail.created_at).format("MMM Do YYYY")}</h10>
                                        </div>

                                        <div class="like_share">
                                            <div class="ls_i">
                                                <a href="#">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                <i className={videoState && videoState.state == 1 ? "fas fa-thumbs-up fa-2x" : "far fa-thumbs-up fa-2x"} data-event_type={videoState && videoState.state == 1 ? 'undo_like' : 'like'} onClick={handleStateClick}></i>
                                                                {/* {videoState && videoState.state == 1 ? <i class="fas fa-thumbs-up fa-2x"></i> : <i class="far fa-thumbs-up fa-2x"></i>} */}
                                                                {/* <i class="far fa-thumbs-up fa-2x"></i> */}
                                                                {/* <i class="fas fa-thumbs-up fa-2x"></i> */}
                                                                {/* <img src="/images/like.png" /> */}
                                                            </td>
                                                            <td>{videoDetail.likes_count}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2"><p>Like</p></td>
                                                        </tr>
                                                    </table>
                                                </a>
                                            </div>
                                            <div class="ls_ii">
                                                <a href="#">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                <i className={videoState && videoState.state == 2 ? "fas fa-thumbs-down fa-2x" : "far fa-thumbs-down fa-2x"} data-event_type={videoState && videoState.state == 2 ? 'undo_dislike' : 'dislike'} onClick={handleStateClick}></i>
                                                                {/* {videoState && videoState.state == 2 ? <i class="fas fa-thumbs-down fa-2x" onClick={handleStateClick}></i> : <i class="far fa-thumbs-down fa-2x"></i>} */}
                                                                {/* <i class="far fa-thumbs-down fa-2x"></i> */}
                                                                {/* <i class="fas fa-thumbs-down fa-2x"></i> */}
                                                                {/* <img src="/images/dislike.png" /> */}
                                                            </td>
                                                            <td>{videoDetail.dislikes_count}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2"><p>Dislike</p></td>
                                                        </tr>
                                                    </table>
                                                </a>
                                            </div>
                                            <div class="ls_iii">
                                                <a href="#">
                                                    <table>
                                                        <tr>
                                                            <td><img src="/images/share.png" /></td>
                                                        </tr>
                                                        <tr>
                                                            <td><p>Share</p></td>
                                                        </tr>
                                                    </table>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="user_video">
                                        <div class="user_video_left">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td><img class="user8_bx" src={videoDetail.astro_image || "/images/user9.png"} alt="" /> </td>
                                                        <td>{videoDetail.full_name}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="user_video_right">
                                            <a class="lm_btn" href={"/astro_profile/" + videoDetail.astrologer_id}>Learn More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {videoDetail.offers && videoDetail.offers.length > 0 &&
                                <div class="vi_deta_right">

                                    <h5>Like what you see?  Buy a personalized prediction from {videoDetail.full_name}.</h5>

                                    <p>Choose from the available offers by {videoDetail.full_name}.</p>

                                    {videoDetail.offers.map(o => (
                                        <div class="videpack_sel">
                                            <h5>{o.title}</h5>
                                            <p>{o.description}</p>
                                            <table class="price_bx">
                                                <tr>
                                                    <td><b>INR{o.price}</b></td>
                                                    <td><button class="sel_btn">Select</button></td>
                                                </tr>
                                            </table>
                                        </div>
                                    ))}
                                    {/* <div class="videpack_sel">
                                    <h5>One-time Offer</h5>
                                    <p>How does this Mars retrograde impact the next 10 weeks? Get a personalized 5 minute video from Amal.</p>
                                    <table class="price_bx">
                                        <tr>
                                            <td><b>$5.99</b></td>
                                            <td><button class="sel_btn">Select</button></td>
                                        </tr>
                                    </table>
                                </div>

                                <div class="videpack_sel">
                                    <h5>Yearly Offer</h5>
                                    <p>Get 12 monthly predictions a year from Amal that includes all key transits</p>
                                    <table class="price_bx">
                                        <tr>
                                            <td><b>$99.00</b></td>
                                            <td><button class="sel_btn">Select</button></td>
                                        </tr>
                                    </table>
                                </div> */}
                                </div>}
                        </div>
                    </div>
                </div>
                {/* <!--content end--> */}
            </div>
        </>
    )
}

export default VideoDetail
