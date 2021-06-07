import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { apiRequest } from "../../utils/Api";
import NewOffer from "../Offer/newOffer";
import { logout } from "../../store/reducers/profiles/action";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
import AstroUploadVideo from '../AstroUploadVideo';
import * as LocalStore from "../../utils/LocalStore";
import { refreshAuthUser } from "../../utils/AuthUtil";
import ReactPlayer from 'react-player'
import _ from "lodash";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

var Loader = require('react-loaders').Loader;

const AstroDashboard = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { addToast } = useToasts()
    const [addModal, setAddModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
    const [preview, setPreview] = useState('step1');
    const [componentStep, setComponentStep] = useState(1);
    const [liveVideos, setLiveVideos] = useState([])
    const [expiredVideos, setExpiredVideos] = useState([])
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const loadExpiredVideos = (event) => {
        apiRequest("GET", `/astro/videos/expired/`)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                setExpiredVideos(data.result)
                console.log("data", data)
            })
            .catch(err => {
                console.log("error: ", err)
            });
    }

    useEffect(() => {
        apiRequest("GET", `/astro/videos/live/`)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                setLiveVideos(data.result)
                console.log("data", data)
            })
            .catch(err => {
                console.log("error: ", err)
            });
    }, [])

    const [addUploadVideoModal, setAddUploadVideoModal] = useState(false);
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }

    const youtube_parser = (yturl) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = yturl.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    const handleGeneratePreview = function (event) {
        event.persist();
        if (!videoUrl) {
            console.log("enter video url")
            return
        }
        let video_id = youtube_parser(videoUrl)
        const thumbnail = `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`
        console.log("thumbnail: ", thumbnail)
        setVideoThumbnailUrl(thumbnail)

    }
    useEffect(() => {
        console.log("effect: ", videoThumbnailUrl)

        if (videoThumbnailUrl) {
            // hide genereate button
            console.log("effect1: ", videoThumbnailUrl)
            setPreview('step2');
            // load preview image
        }
    }, [videoThumbnailUrl]);

    const resetModalContent = (event) => {
        // empty url
        setVideoUrl('')
        // reset Thumbnail url
        setVideoThumbnailUrl('')
        // reset step
        setPreview('step1')
    }

    const handleClose = (event) => {
        // close modal
        setAddUploadVideoModal(false);
        resetModalContent(event)
    }

    const handleCreateOffer = function () {
        // setAddModal(true);
    }
    // const toggle = () => setAddModal(!addModal);
    // const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    const handleUploadVideo = (event) => {
        setAddUploadVideoModal(true);
    }
    const handleUploadClick = (event) => {
        setComponentStep(2)
    }
    const handleLogOut = async () => {
        await Auth.signOut();
        LocalStore.clearUser();
        dispatch(logout());
        await refreshAuthUser(true);
        history.push("/login");
        window.location.reload();
    };
    return (
        componentStep === 1 &&
        <div>
            {/* <Modal isOpen={addModal} contentClassName="create-offer-modal">
                <ModalHeader >
                    Add product to presentation
                </ModalHeader>
                <ModalHeader toggle={toggle} close={closeBtn}>Create customised offers for your audience.</ModalHeader>
                <ModalBody>
                    <NewOffer />
                </ModalBody>
            </Modal> */}
            {/* <button onClick={handleCreateOffer}>create offer</button> */}
            <div class="wrapper">
                {/* <!--header start--> */}
                <header class="sticky">
                    <div class="inner_wrapper">
                        <div class="hed_left">
                            <a href="#"><img src="images/logo.png" alt="" /></a>
                        </div>

                        <div class="log_out">
                            <a data-toggle="modal" data-target="#uploadvideo_pp" class="Personalize" href="#" onClick={handleUploadVideo}>Upload Video</a>
                            <a onClick={handleLogOut} href="#"><img src="images/logout2.png" alt="" /></a>
                        </div>

                    </div>
                </header>
                {/* <!--header end--> */}

                {/* <!--content start--> */}
                <div class="content_bx">
                    <div class="inner_wrapper">
                        <div class="video_live_menu">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggle('1'); }}
                                    >Live</NavLink>
                                </NavItem>
                                <NavItem onClick={loadExpiredVideos}>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggle('2'); }}
                                    >Expired</NavLink>
                                </NavItem>
                            </Nav>

                            {/* <!-- Nav tabs --> */}
                            {/* <ul class="nav nav-tabs ">
                                <li class="nav-item">
                                    <a class="nav-link active" data-toggle="tab" href="#Live">Live</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-toggle="tab" href="#Expired">Expired</a>
                                </li>
                            </ul> */}
                        </div>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                {liveVideos.length == 0 && <p>Use Upload Video to upload your video</p>}
                                {_.range(0, liveVideos.length, 2).map(idx => (
                                    <div class="full_v_bx">
                                        <div class="full_v_bx_left">
                                            <div class="v_box">
                                                <div class="v_box_left">
                                                    <img src={liveVideos[idx].thumbnail} alt="" />
                                                    {/* <div class="video_time">5:45</div> */}
                                                </div>
                                                <div class="v_box_right">
                                                    <p>{liveVideos[idx].title}</p>
                                                    <table class="viuser_view">
                                                        <tr>
                                                            <td><img src="images/views.png" alt="" /> Views</td>
                                                            <td><b>{liveVideos[idx].views_count}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td><img src="images/like2.png" alt="" /> Likes</td>
                                                            <td><b>{liveVideos[idx].likes_count}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td><img src="images/dislike2.png" alt="" /> Dislikes</td>
                                                            <td><b>{liveVideos[idx].dislikes_count}</b></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        {idx + 1 < liveVideos.length &&
                                            <div class="full_v_bx_right">
                                                <div class="v_box">
                                                    <div class="v_box_left">
                                                        <img src={liveVideos[idx + 1].thumbnail} alt="" />
                                                        {/* <div class="video_time">5:45</div> */}
                                                    </div>
                                                    <div class="v_box_right">
                                                        <p>{liveVideos[idx + 1].title}</p>
                                                        <table class="viuser_view">
                                                            <tr>
                                                                <td><img src="images/views.png" alt="" /> Views</td>
                                                                <td><b>{liveVideos[idx + 1].views_count}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="images/like2.png" alt="" /> Likes</td>
                                                                <td><b>{liveVideos[idx + 1].likes_count}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="images/dislike2.png" alt="" /> Dislikes</td>
                                                                <td><b>{liveVideos[idx + 1].dislikes_count}</b></td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </TabPane>
                            <TabPane tabId="2">
                                {expiredVideos.length == 0 && <p>Currently, No video expired</p>}
                                {_.range(0, expiredVideos.length, 2).map(idx => (
                                    <div class="full_v_bx">
                                        <div class="full_v_bx_left">
                                            <div class="v_box">
                                                <div class="v_box_left">
                                                    <img src={expiredVideos[idx].thumbnail} alt="" />
                                                    {/* <div class="video_time">5:45</div> */}
                                                </div>
                                                <div class="v_box_right">
                                                    <p>{expiredVideos[idx].title}</p>
                                                    <table class="viuser_view">
                                                        <tr>
                                                            <td><img src="images/views.png" alt="" /> Views</td>
                                                            <td><b>{expiredVideos[idx].views_count}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td><img src="images/like2.png" alt="" /> Likes</td>
                                                            <td><b>{expiredVideos[idx].likes_count}</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td><img src="images/dislike2.png" alt="" /> Dislikes</td>
                                                            <td><b>{expiredVideos[idx].dislikes_count}</b></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        {idx + 1 < expiredVideos.length &&
                                            <div class="full_v_bx_right">
                                                <div class="v_box">
                                                    <div class="v_box_left">
                                                        <img src={expiredVideos[idx + 1].thumbnail} alt="" />
                                                        {/* <div class="video_time">5:45</div> */}
                                                    </div>
                                                    <div class="v_box_right">
                                                        <p>{expiredVideos[idx + 1].title}</p>
                                                        <table class="viuser_view">
                                                            <tr>
                                                                <td><img src="images/views.png" alt="" /> Views</td>
                                                                <td><b>{expiredVideos[idx + 1].views_count}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="images/like2.png" alt="" /> Likes</td>
                                                                <td><b>{expiredVideos[idx + 1].likes_count}</b></td>
                                                            </tr>
                                                            <tr>
                                                                <td><img src="images/dislike2.png" alt="" /> Dislikes</td>
                                                                <td><b>{expiredVideos[idx + 1].dislikes_count}</b></td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </TabPane>
                        </TabContent>
                        {/* <!-- Tab panes --> */}

                    </div>
                </div>
                {/* <!--content end--> */}

            </div>

            <Modal isOpen={addUploadVideoModal} className="modal-dialog-centered vi_up_ppsize" modalClassName="fade uv_box">
                {/* <ModalHeader toggle={toggle} close={closeBtn}></ModalHeader> */}
                <button type="button" class="close Embed_close" data-dismiss="modal" onClick={handleClose} aria-label="Close">
                    <img src="images/close2.png" alt="" />
                </button>
                {/* <!-- mobile hed--> */}
                <div class="mob_hed">
                    <a data-dismiss="modal" aria-label="Close" href="#" onClick={handleClose}><img src="images/back_btn.png" alt="" /> Choose Video</a>

                    <a className={`Personalize Upload_btn ${preview === 'step2' ? 'd-block' : 'd-none'}`} href="#" onClick={handleUploadClick}>Upload</a>
                </div>
                {/* <!-- mobile hed--> */}
                <ModalBody>
                    <div class="em_menu_pp">
                        {/* <!-- Nav tabs --> */}
                        <ul class="nav nav-tabs ">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#Embed_Video">Embed Video</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#Storage">Storage</a>
                            </li>
                        </ul>
                    </div>

                    <div class="em_video_sto">
                        {/* <!-- Tab panes --> */}
                        <div class="tab-content">
                            <div class="tab-pane active box_right" id="Embed_Video">
                                <div class="Embed_Video_bx">
                                    <p class="inp_url">
                                        <input id="video_url" type="text" class="form-control" placeholder="Paste the video link..." onChange={event => { setVideoUrl(event.target.value) }} value={videoUrl} />
                                        <button class="close3_clear"><img src="images/close3.png" alt="" onClick={resetModalContent} /></button>
                                    </p>

                                    <div className={`Preview_ii ${preview === 'step2' ? 'd-block' : 'd-none'}`}>

                                        <p>Video Preview</p>

                                        <div class="Preview_ii_bx">
                                            {/* <img src="images/vide_preview.png" alt="" /> */}
                                            {/* <img src={videoThumbnailUrl} alt="" /> */}
                                            <ReactPlayer controls="true" url={videoThumbnailUrl && videoUrl} width='400px' height='200px' />
                                            {/* <a href="#"><img class="vi_icon_play" src="images/vi_icon.png" alt="" /></a> */}
                                        </div>
                                        <div class="Generate_btn hide_mobile">
                                            <button class="org_btn Preview_g" onClick={handleUploadClick}>Upload</button>
                                        </div>
                                    </div>

                                    <div className={`Preview_box ${preview === 'step1' ? 'd-block' : 'd-none'}`}>
                                        <div class="Generate_btn">
                                            <button class="org_btn Preview_g" onClick={handleGeneratePreview}>Generate Preview</button>
                                        </div>
                                        {/* <p class="works_text">works with YouTube, Vimeo, and more</p> */}
                                        <p class="works_text">works with YouTube</p>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane box_right" id="Storage">

                                <div class="Storage_bx">
                                    <ul>
                                        <li>
                                            <img class="sto_im" src="images/sto1.png" alt="" />
                                            <img class="Storage_verify" src="images/right_icon.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto2.png" alt="" />
                                            <img class="Storage_verify" src="images/success.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto3.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto4.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto5.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto6.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto7.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto8.png" alt="" />
                                        </li>
                                        <li>
                                            <img class="sto_im" src="images/sto9.png" alt="" />
                                        </li>
                                    </ul>
                                </div>

                                <div class="Generate_btn hide_mobile">
                                    <button class="org_btn Preview_g">Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </ModalBody>
            </Modal>

            {/* <!-- Modal-- > */}
            <div class="modal fade uv_box" id="uploadvideo_pp" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">

                {/* <!--header start--> */}
                <header class="sticky popo_hed hide_mobile">
                    <div class="inner_wrapper">
                        <div class="hed_left">
                            <a href="#"><img src="images/logo.png" alt="" /></a>
                        </div>
                    </div>
                </header>
                {/* <!--header end--> */}

                {/* <!-- mobile hed--> */}
                <div class="mob_hed">
                    <a data-dismiss="modal" aria-label="Close" href="#"><img src="images/back_btn.png" alt="" /> Choose Video</a>

                    <a class="Personalize Upload_btn" href="#">Upload</a>
                </div>
                {/* <!-- mobile hed--> */}

                <div class="modal-dialog modal-dialog-centered vi_up_ppsize" role="document">



                    <div class="modal-content">


                        <button type="button" class="close Embed_close" data-dismiss="modal" aria-label="Close">
                            <img src="images/close2.png" alt="" />
                        </button>

                        <div class="modal-body">
                            <div class="em_menu_pp">
                                {/* <!-- Nav tabs --> */}
                                <ul class="nav nav-tabs ">
                                    <li class="nav-item">
                                        <a class="nav-link active" data-toggle="tab" href="#Embed_Video">Embed Video</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" data-toggle="tab" href="#Storage">Storage</a>
                                    </li>
                                </ul>
                            </div>

                            <div class="em_video_sto">
                                {/* <!-- Tab panes --> */}
                                <div class="tab-content">
                                    <div class="tab-pane active box_right" id="Embed_Video">
                                        <div class="Embed_Video_bx">
                                            <p class="inp_url"><input id="video_url" type="text" class="form-control" placeholder="Paste the video link..." />
                                                <button class="close3_clear"><img src="images/close3.png" alt="" /></button>
                                            </p>

                                            <div class="Preview_ii" style={{ display: 'none' }}>

                                                <p>Video Preview</p>

                                                <div class="Preview_ii_bx">
                                                    <img src="images/vide_preview.png" alt="" />
                                                    <a href="#"><img class="vi_icon_play" src="images/vi_icon.png" alt="" /></a>
                                                </div>
                                                <div class="Generate_btn hide_mobile">
                                                    <button class="org_btn Preview_g">Upload</button>
                                                </div>
                                            </div>



                                            <div class="Preview_box">
                                                <div class="Generate_btn">
                                                    <button class="org_btn Preview_g">Generate Preview</button>
                                                </div>
                                                <p class="works_text">works with YouTube, Vimeo, and more</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane box_right" id="Storage">

                                        <div class="Storage_bx">
                                            <ul>
                                                <li>
                                                    <img class="sto_im" src="images/sto1.png" alt="" />
                                                    <img class="Storage_verify" src="images/right_icon.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto2.png" alt="" />
                                                    <img class="Storage_verify" src="images/success.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto3.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto4.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto5.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto6.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto7.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto8.png" alt="" />
                                                </li>
                                                <li>
                                                    <img class="sto_im" src="images/sto9.png" alt="" />
                                                </li>
                                            </ul>
                                        </div>

                                        <div class="Generate_btn hide_mobile">
                                            <button class="org_btn Preview_g">Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>





                        </div>

                    </div>
                </div>
            </div>

        </div>
        ||
        componentStep === 2 && <AstroUploadVideo videoThumbnailUrl={videoThumbnailUrl} videoUrl={videoUrl} />

    )
}

export default AstroDashboard
