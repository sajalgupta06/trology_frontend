import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
import { allCriterias } from './options'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import {
    Query, Builder, Utils,
  } from "react-awesome-query-builder";

import { useHistory } from "react-router-dom";
import AstroVideoPreview from '../AstroVideoPreview';
import OfferList from "../OfferList";
import loadedInitValue from "./init_value";

// import QueryBuilder from '../../pages/QueryBuilder/demo/demo'

import loadedConfig from "./config_complex"; // <- you can try './config_complex' for more complex examples
var Loader = require('react-loaders').Loader;
const {jsonLogicFormat, queryString, mongodbFormat, sqlFormat, getTree, checkTree, loadTree, uuid, loadFromJsonLogic} = Utils;
const preStyle = { backgroundColor: "darkgrey", margin: "10px", padding: "10px" };
const stringify = JSON.stringify;
const preErrorStyle = { backgroundColor: "lightpink", margin: "10px", padding: "10px" };
const emptyInitValue = {"id": uuid(), "type": "group"};
const initValue = loadedInitValue && Object.keys(loadedInitValue).length > 0 ? loadedInitValue : emptyInitValue;
const initTree = checkTree(loadTree(initValue), loadedConfig);
const AstroUploadVideo = (props) => {
    const [tree, setTree] = useState(initTree)
    const [config, setConfig] = useState(loadedConfig)
    const [immutableTree, setImmutableTree] = useState(initTree)
    const renderResult = () => {
        // let tree = immutableTree
        // setTree(immutableTree)
        const {logic, data, errors} = jsonLogicFormat(immutableTree, config);
        return (
          <div>
            {/* <br /> */}
            {/* <div>
            stringFormat: 
              <pre style={preStyle}>
                {stringify(queryString(immutableTree, config), undefined, 2)}
              </pre>
            </div> */}
            {/* <hr/> */}
            {/* <div>
            humanStringFormat: 
              <pre style={preStyle}>
                {stringify(queryString(immutableTree, config, true), undefined, 2)}
              </pre>
            </div>
            <hr/> */}
            <div>
            sqlFormat: 
              <pre style={preStyle}>
                {stringify(sqlFormat(immutableTree, config), undefined, 2)}
              </pre>
            </div>
            {/* <hr/>
            <div>
            mongodbFormat: 
              <pre style={preStyle}>
                {stringify(mongodbFormat(immutableTree, config), undefined, 2)}
              </pre>
            </div>
            <hr/>
            <div>
              <a href="http://jsonlogic.com/play.html" target="_blank" rel="noopener noreferrer">jsonLogicFormat</a>: 
              { errors.length > 0 
                && <pre style={preErrorStyle}>
                  {stringify(errors, undefined, 2)}
                </pre> 
              }
              { !!logic
                && <pre style={preStyle}>
                  {"// Rule"}:<br />
                  {stringify(logic, undefined, 2)}
                  <br />
                  <hr />
                  {"// Data"}:<br />
                  {stringify(data, undefined, 2)}
                </pre>
              }
            </div>
            <hr/>
            <div>
            Tree: 
              <pre style={preStyle}>
                {stringify(getTree(immutableTree), undefined, 2)}
              </pre>
            </div> */}
          </div>
        );
      }
    const renderBuilder = (props) => (
        <div className="query-builder-container" >
          <div style={{marginBottom: "20px"}}>
            <Builder {...props} />
          </div>
        </div>
      )
    //   const updateResult = throttle(() => {
    //       setTree(immutableTree)
    //       setConfig(config)
    //     // this.setState({tree: this.immutableTree, config: this.config});
    //   }, 100)
    const onChange = (immutableTree, config) => {
        console.log('====immutableTree', immutableTree)
        console.log('====config', config)
    setImmutableTree(immutableTree)
    setConfig(config)
    setTree(immutableTree)
    // updateResult();

    // `jsonTree` or `logic` can be saved to backend
    // (and then loaded with `loadTree` or `loadFromJsonLogic` as seen above)
    const jsonTree = getTree(immutableTree);
    const {logic, data, errors} = jsonLogicFormat(immutableTree, config);
    }
    const resetValue = () => {
        setTree(initTree)
    };

    const clearValue = () => {
        setTree(loadTree(emptyInitValue))
    };
    
    const { addToast } = useToasts()
    let range = (start, end) => Array.from(Array(end + 1).keys()).slice(start);
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }
    const [isLoading, setIsLoading] = useState(false)
    
    const [selectedOffers, setSelectedOffers] = useState([])
    const [componentStep, setComponentStep] = useState('add_video_details');
    const [values, setValues] = useState({
        'thumbnail': props.videoThumbnailUrl,
        'status': 2,
        'video_type': 1,
        'video_url': props.videoUrl,
        'criterias': allCriterias,
    });
    const handleChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setValues({ ...values, [name]: val })
    }
    const removeTargetCriteria = (event) => {
        console.log('removeTargetCriteria')
        event.persist()
        let name = event.target.dataset.name
        let id = event.target.dataset.id
        let currentCriteres = values.criterias
        currentCriteres[id].selected = false
        console.log(currentCriteres)
        setValues({ ...values, 'criterias': currentCriteres })
    }
    const handleCriteria = (event) => {
        event.persist()
        let name = event.target.dataset.name
        let id = event.target.dataset.id
        console.log(event.target.text)
        if (event.target.className) return
        console.log('name=========', name)
        let currentCriteres = values.criterias
        currentCriteres[id].selected = true
        console.log(currentCriteres)
        setValues({ ...values, 'criterias': currentCriteres })
        event.preventDefault()
    }
    const handleToggleCriteria = (event) => {
        console.log('removeTargetCriteria')
        event.persist()
        let name = event.target.dataset.name
        let id = event.target.dataset.id
        let currentCriteres = values.criterias
        currentCriteres[id].selected = !currentCriteres[id].selected
        console.log(currentCriteres)
        setValues({ ...values, 'criterias': currentCriteres })
        event.preventDefault()
    }

    const [showMore, setShowMore] = useState(false);
    const handleMore = (event) => {
        setShowMore(true)
    }
    const handleCloseMore = (event) => {
        // close modal
        setShowMore(false);
    }

    const youtube_parser = (yturl) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = yturl.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    useEffect(() => {
        let video_id = youtube_parser(values.video_url)
        values.thumbnail = `https://i.ytimg.com/vi/${video_id}/default.jpg`
    }, [values]);

    function validateForm(values) {
        let errors = {};
        if(!values.title){
            errors.title = 'Title is required';
        }
        if(!values.description){
            errors.description = 'Description is required';
        }
        if(!values.age_range_min){
            errors.age_range_min = 'Min age range is required';
        }
        if(!values.age_range_max){
            errors.age_range_max = 'Max age range is required';
        }
        if(values.age_range_min && values.age_range_max){
            if (values.age_range_min > values.age_range_max)
            errors.age_range_max = 'Max age range should be greater than min age range';
        }

        if (!values.exDay) {
            errors.exDay = 'Day is required';
        }
        if (!values.exMonth) {
            errors.exMonth = 'Month is required';
        }
        if (!values.exYear) {
            errors.exYear = 'Year is required';
        }
        let dt = new Date(`${values.exYear}/${values.exMonth}/${values.exDay}`)
        if (parseInt(values.exDay) !== dt.getDate() || parseInt(values.exMonth) !== (dt.getMonth() + 1) || parseInt(values.exYear) !== dt.getFullYear()) {
            errors.dob = 'Invalid Expiry date entered';
        }
        console.log(errors)
        return errors;
    };
    // const handleSaveClick1 = async function() {
    //     setComponentStep('create_offer')
    // }
    const handleSaveClick = async function () {
        console.log(values);
        let errors = validateForm(values)
        if (Object.keys(errors).length !== 0) {
            console.log("errors in generate horoscope")
            Object.keys(errors).map(function (keyName, keyIndex) {
                return (
                    addToast(errors[keyName], {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                )
            })
            return
        }
        try {
            setIsLoading(true)
            let data = values;
            let selectedCriterias = []
            values.criterias.filter(c => c.selected).map(c => selectedCriterias.push(c.name))
            data.selectedCriterias = selectedCriterias
            data.expiry_date = `${values.exYear}/${values.exMonth}/${values.exDay}`
            data.targeting_criteria = sqlFormat(immutableTree, config)
            console.log("formdata: ",data)
            let result = await apiRequest("POST", `/astro/embed_video`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("response data: ", response)
                setValues({...values, astrologerEmbedVideoDetailsId: response.astrologerEmbedVideoDetailsId})
                addToast('Video uploaded successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                })
                // setComponentStep('video_preview')
                setComponentStep('create_offer')
            } else {
                addToast('Unable to upload Video.', {
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
    const updateState = function(action, value) {
        console.log('==============action', action)
        console.log('==============value', value)
        if (action === 'update_step') {
            setSelectedOffers(value)
            setComponentStep('video_preview')
        }
    }
    let history = useHistory();
    return (
        componentStep === 'create_offer' && <OfferList updateState={updateState}/> ||
        componentStep === 'add_video_details' &&
        <div>
            <div class="wrapper">
                {/* <!--header start--> */}
                {/* <header class="sticky hide_mobile">
                    <div class="inner_wrapper">
                        <div class="hed_left">
                            <a href="#"><img src="images/logo.png" alt="" /></a>
                        </div>
                    </div>
                </header> */}
                {/* <!--header end--> */}
                {/* <!-- mobile hed--> */}
                <div class="mob_hed">
                    <a href="#" onClick={() => history.goBack()}><img src="images/back_btn.png" alt="" /> About Video</a>
                </div>
                {/* <!-- mobile hed--> */}
                {/* <!--content start--> */}
                <div class="content_bx">
                    <div class="grabg_box">&nbsp;</div>
                    <div class="inner_wrapper ab_vinner">

                        <div class="wpay index99">

                            {/* <div class="v_progre_full">
                                <div class="v_progre">
                                    <p>Uploading Progress:</p>
                                    <div class="progress md-progress Uploading_lod">
                                        <div class="progress-bar" role="progressbar" style={{width: '20%', height: '15px'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"> </div>
                                    </div>
                                    <span class="par_pro">20%</span>
                                </div>
                                <p class="While_text">While we are uploading your video, please enter additional details.</p>
                            </div> */}

                            <div class="video_form">
                                <div class="vf_bx">
                                    <p class="in_tex_title">Add title</p>
                                    <div class="in_tex">
                                        <input type="text" class="form-control" placeholder="Enter video title" name="title" onChange={handleChange} value={values.title} />
                                    </div>
                                </div>
                                <div class="vf_bx">
                                    <p class="in_tex_title">Add description</p>
                                    <div class="in_tex">
                                        <textarea placeholder="Quick information about the video" name="description" onChange={handleChange} value={values.description}></textarea>
                                    </div>
                                </div>

                                <div class="vf_bx">
                                    <p class="in_tex_title">Thumbnail (optional)  <small class="recommended">1280x720 px recommended</small></p>
                                    {/* <div class="upload_thumbnail">
                                        <button class="btn">Upload thumbnail</button>
                                        <input type="file" name="myfile" />
                                    </div> */}

                                    <div class="priview">
                                        <table>
                                            <tr>
                                                {/* <td><img class="Thumbnail_im" src="images/vide_preview.png" alt="" /></td> */}
                                                <td><img class="Thumbnail_im" src={values.thumbnail} alt="" /></td>
                                                {/* <td><a href="#"><img src="images/colse_red.png" alt="" /> Remove</a></td> */}
                                            </tr>
                                        </table>
                                    </div>

                                </div>

                                <div class="vf_bx">
                                    <p class="in_tex_title">Age range</p>

                                    <div class="Age_range">
                                        <table>
                                            <tr>
                                                <td><input type="number" class="form-control" placeholder="Min" name="age_range_min" onChange={handleChange} value={values.age_range_min} /></td>
                                                <td>-</td>
                                                <td><input type="number" class="form-control" placeholder="Max" name="age_range_max" onChange={handleChange} value={values.age_range_max} /></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <div class="vf_bx">
                                    <p class="in_tex_title">Expiry date</p>
                                    <div class="in_tex Expiry_date">
                                        <table class="full_tab_in">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="exDay" onChange={handleChange} value={values.exDay}>
                                                                <option value="" >DD</option>
                                                                {range(1, 31).map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="exMonth" onChange={handleChange} value={values.exMonth}>
                                                                <option value="" >MM</option>
                                                                {range(1, 12).map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="exYear" onChange={handleChange} value={values.exYear}>
                                                                <option value="" >YYYY</option>
                                                                {range(2020, 2030).map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                

                                <div class="Targeting">
                                    <p class="in_tex_title">Targeting criteria</p>
                                    <div>
                                    {/* <button onClick={resetValue}>reset</button>
                                    <button onClick={clearValue}>clear</button> */}
                                    <Query
                                        {...loadedConfig} 
                                        value={tree}
                                        onChange={onChange}
                                        renderBuilder={renderBuilder}
                                    />
                                    {/* <div className="query-builder-result"> */}
                                    {/* {renderResult(
                                    )} */}
                                    {/* </div> */}
                                </div>
                                    {/* <div class="Targeting_inner" data-toggle="modal" data-target="#Attributes_ppp"> */}
                                    <div class="Targeting_inner">
                                    <span><img src="images/close2.png" alt="" onClick={resetValue} data-name="test" data-id="" />{stringify(sqlFormat(immutableTree, config), undefined, 2)}</span>
                                        {/* {values.criterias.filter(c => c.selected).map(f => (
                                            <div class="pati_desilable">
                                                <span><img src="images/close2.png" alt="" onClick={removeTargetCriteria} data-name={f.name} data-id={f.id} />{f.name}</span>
                                            </div>
                                        ))} */}
                                    </div>
                                </div>

                                {/* <div class="SUGGESTED">
                                    <p class="in_tex_title">SUGGESTED Attributes</p>
                                    <p>
                                        {values.criterias.slice(0, 3).map(f => (
                                            <a href="#" className={f.selected ? 'active' : ''} onClick={handleCriteria} data-name={f.name} data-id={f.id}>{f.name}</a>
                                        ))}
                                    </p>
                                    <p class="more_show" onClick={handleMore}>more...</p>
                                </div> */}
                                
                            </div>
                            
                            <div class="poced_btn">
                                <button onClick={handleSaveClick}>Save & Next</button>
                                {isLoading && renderLoader()}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--content end--> */}
            </div>

            <Modal isOpen={showMore} className="modal-dialog-centered vi_up_ppsize" modalClassName="fade uv_box">
                {/* <ModalHeader toggle={toggle} close={closeBtn}></ModalHeader> */}
                {/* <!-- mobile hed--> */}
                <div class="mob_hed mob_hed_ppp">
                    <a data-dismiss="modal" aria-label="Close" href="#" onClick={handleCloseMore}><img src="images/close.png" alt="" /> Suggested Attributes</a>

                    <a class="Personalize Upload_btn" href="#" onClick={handleCloseMore}>Done</a>
                </div>
                {/* <!-- mobile hed--> */}
                <button type="button" class="close Embed_close" data-dismiss="modal" onClick={handleCloseMore} aria-label="Close">
                    <img src="images/close2.png" alt="" />
                </button>
                <div class="ab_tagpp_title">
                    <h5>SUGGESTED ATTRIBUTES</h5>
                </div>
                <ModalBody>
                    <div class="your_attr">
                        <p>Select attributes for your video</p>
                        <p><span>{values.criterias.filter(c => c.selected).length} Selected</span></p>

                        <div class="your_attr_innr">
                            {values.criterias.map(f => (
                                <a href="#" className={f.selected ? 'active' : ''} onClick={handleToggleCriteria} data-name={f.name} data-id={f.id}>{f.name}</a>
                                // <a href="#" className={f.selected ? 'active' : ''} onClick={event =>{} handleCriteria} data-name={f.name} data-id={f.id}>{f.name}</a>
                            ))}
                            {/* <a href="#">entering_saturn_trddcansit_phase_1</a>
                            <a class="active" href="#">moon_sign_scorpio</a>
                            <a href="#"> jupiter_transit_into_5th_house</a>
                            <a class="active" href="#">gender_female</a>
                            <a href="#">virgo_zodiac</a>
                            <a href="#">pisces_zodiac</a>
                            <a href="#">age_50-60</a> */}
                        </div>

                        <div class="ab_pp_donbtn hide_mobile">
                            <button class="org_btn" onClick={handleCloseMore}>Done</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {/* <!-- Modal --> */}
            <div class="modal fade uv_box" id="Attributes_ppp" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">

                {/* <!--header start--> */}
                <header class="sticky popo_hed fix_top hide_mobile">
                    <div class="inner_wrapper">
                        <div class="hed_left">
                            <a href="#"><img src="images/logo.png" alt="" /></a>
                        </div>
                    </div>
                </header>
                {/* <!--header end--> */}

                {/* <!-- mobile hed--> */}
                <div class="mob_hed mob_hed_ppp">
                    <a data-dismiss="modal" aria-label="Close" href="#"><img src="images/close.png" alt="" /> Suggested Attributes</a>

                    <a class="Personalize Upload_btn" href="#">Done</a>
                </div>
                {/* <!-- mobile hed--> */}

                <div class="modal-dialog modal-dialog-centered vi_up_ppsize" role="document">



                    <div class="modal-content">


                        <button type="button" class="close Embed_close" data-dismiss="modal" aria-label="Close">
                            <img src="images/close2.png" alt="" />
                        </button>
                        <div class="ab_tagpp_title">
                            <h5>SUGGESTED ATTRIBUTES</h5>
                        </div>
                        <div class="modal-body">

                            <div class="your_attr">
                                <p>Select attributes for your video</p>
                                <p><span>2 Selected</span></p>

                                <div class="your_attr_innr">
                                    <a href="#">entering_saturn_trddcansit_phase_1</a>
                                    <a class="active" href="#">moon_sign_scorpio</a>
                                    <a href="#"> jupiter_transit_into_5th_house</a>
                                    <a class="active" href="#">gender_female</a>
                                    <a href="#">virgo_zodiac</a>
                                    <a href="#">pisces_zodiac</a>
                                    <a href="#">age_50-60</a>
                                </div>

                                <div class="ab_pp_donbtn hide_mobile">
                                    <button class="org_btn">Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ||
        componentStep === 'video_preview' && <AstroVideoPreview selectedOffers={selectedOffers} values={values}/>
    )
}

export default AstroUploadVideo
