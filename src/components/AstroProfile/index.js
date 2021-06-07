import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useHistory } from "react-router-dom";

const AstroProfile = (props) => {
    console.log('===========props.astroId', props.astroId)
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [astroData, setAstroData] = useState(null);

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        // let astroId = "79ae2486-2bba-4e87-aec5-f9643ac3f08b"
        let astroId = props.astroId;
        let url = `/astro/profile/${astroId}`;
        apiRequest("GET", url)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                setIsLoaded(true)
                setAstroData(data.result)
                console.log("data", data)
            })
            .catch(err => {
                console.log("error: ", err)
                setIsLoaded(true)
                setError(err)
            });
    }, [])

    let history = useHistory();

    return (
        <div class="wrapper astro_profile_comp">
            {/* <!-- mobile hed--> */}
            <div class="mob_hed">
                <a href="#" onClick={() => history.goBack()}><img src="/images/back_btn.png" alt="" />{astroData && astroData.astroUser && astroData.astroUser.full_name}</a>
            </div>
            {/* <!-- mobile hed--> */}

            {/* <!--content start--> */}
            <div class="content_bx">

                <div class="vv_pro">
                    <div class="inner_wrapper">
                        <div class="amal_pic">
                            <div class="ap_pic">
                                <p><img src={astroData?.astroUser?.astro_image || "/images/user10.png"} alt="" /> </p>
                                <h6>{astroData && astroData.astroUser && astroData.astroUser.full_name}</h6>
                            </div>
                        </div>
                    </div>

                    <div class="totel_vid">
                        <div class="inner_wrapper">
                            {/* <!--remo_mobile--> */}
                            <div class="totel_vid_right ">
                                <ul>
                                    <li>
                                        <h1>{astroData && astroData.astroUser && astroData.astroUser.total_videos || 0}</h1>
                                        <p>Total Videos</p>
                                    </li>
                                    <li>
                                        <h1>{astroData && astroData.astroUser && astroData.astroUser.lifetime_views.toLocaleString() || 0}</h1>
                                        <p>Lifetime views</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="totel_vid_deta">
                        <div class="inner_wrapper">
                            {/* <!--remo_mobile--> */}
                            <div class="totel_vid_right">
                                <h6>About {astroData && astroData.astroUser && astroData.astroUser.full_name}</h6>
                                <p>{astroData && astroData.astroUser && astroData.astroUser.brief_introduction}</p>
                            </div>
                        </div>
                    </div>
                    <div class="vide_list">
                        <div class="inner_wrapper remo_mobile">
                            <h5>Videos by {astroData && astroData.astroUser && astroData.astroUser.full_name}</h5>
                            <div class="con_i con_i_vid">
                                <ul>
                                    {astroData && astroData.videos.map(video => (
                                        <li>
                                            <div class="vid_bx">
                                                <div class="vid_bx_i">
                                                    <a href={"/video_detail/" + video.id}>
                                                        <img src={video.thumbnail} alt="" />
                                                    </a>
                                                    {/* <img src="images/astro13.png" alt="" /> */}
                                                    {/* TODO: How to get video time */}
                                                    {/* <div class="video_time">5:45</div> */}
                                                </div>
                                                <div class="vid_bx_ii">
                                                    <a href={"/video_detail/" + video.id}><table>
                                                        <tbody><tr>
                                                            <td>
                                                                <h4>{video.title}</h4>
                                                            </td>
                                                        </tr>
                                                        </tbody></table></a>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {/* TODO: remove below list once videos are populated */}
                                    {/* <li>
                                        <div class="vid_bx">
                                            <div class="vid_bx_i">
                                                <img src="/images/astro13.png" alt="" />
                                                <div class="video_time">5:45</div>
                                            </div>
                                            <div class="vid_bx_ii">
                                                <a href="#"><table>
                                                    <tbody><tr>
                                                        <td>
                                                            <h4>What rising moon on October 5 means for Leo</h4>
                                                        </td>
                                                    </tr>
                                                    </tbody></table></a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="vid_bx">
                                            <div class="vid_bx_i">
                                                <img src="/images/astro4.png" alt="" />
                                                <div class="video_time">5:45</div>
                                            </div>
                                            <div class="vid_bx_ii">
                                                <a href="#">
                                                    <table>
                                                        <tbody><tr>
                                                            <td>
                                                                <h4>Mars Retrograde for Sagittarius ascendants</h4>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </a>
                                            </div>
                                        </div>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--content end--> */}
        </div>
    )
}

export default AstroProfile
