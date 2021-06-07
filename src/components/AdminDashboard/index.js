import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { apiRequest } from "../../utils/Api";
import { logout } from "../../store/reducers/profiles/action";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
import * as LocalStore from "../../utils/LocalStore";
import { refreshAuthUser } from "../../utils/AuthUtil";
import _ from "lodash";
import {
    Card, Button, CardImg, CardTitle, CardText, CardGroup,
    CardSubtitle, CardBody, CardDeck, CustomInput, Label, Input, FormGroup
} from 'reactstrap';
import { AdvancedPaginationTable } from "./videoList";
import SelectSearch from 'react-select-search';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DatePicker from 'reactstrap-date-picker';
import {
    Query, Builder, Utils,
} from "react-awesome-query-builder";
import loadedInitValue from "../AstroUploadVideo/init_value";
import loadedConfig from "../AstroUploadVideo/config_complex";
import { options } from 'node-google-timezone';
import { fuzzySearch } from './fuzzySearch'
import moment from 'moment';
import DataTable from "react-data-table-component";
import axios from "axios";
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import ReactPlayer from 'react-player'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'

const urlQueryString = require('query-string');
var Loader = require('react-loaders').Loader;

const stringify = JSON.stringify;
const { jsonLogicFormat, queryString, mongodbFormat, sqlFormat, getTree, checkTree, loadTree, uuid, loadFromJsonLogic } = Utils;
const emptyInitValue = { "id": uuid(), "type": "group" };
const initValue = loadedInitValue && Object.keys(loadedInitValue).length > 0 ? loadedInitValue : emptyInitValue;
const initTree = checkTree(loadTree(initValue), loadedConfig);

var Loader = require('react-loaders').Loader;

const AdminDashboard = () => {
    function renderLoader() {
        // return <Loader type="line-scale" color="#EE8265" />
        return <Loader type="ball-clip-rotate" color="#EE8265" />
    }
    const [isLoading, setIsLoading] = useState(false)

    const [tree, setTree] = useState(initTree)
    const [config, setConfig] = useState(loadedConfig)
    const [immutableTree, setImmutableTree] = useState(initTree)
    const [astrolgersList, setAstrolgersList] = useState([])
    const [astrolgerId, setAstrolgerId] = useState('')
    const [youtubeViewCountMin, setYoutubeViewCountMin] = useState()
    const [youtubeViewCountMax, setYoutubeViewCountMax] = useState()
    const [searchText, setSearchText] = useState('')
    const [startDate, setStartDate] = useState(moment().subtract(29, 'days').toDate())
    const [endDate, setEndDate] = useState(moment().toDate())

    // conditions related variables
    const [targetingCriteria, setTargetingCriteria] = useState('')
    const [minAge, setMinAge] = useState('0')
    const [maxAge, setMaxAge] = useState('99')
    const [expiryDate, setExpiryDate] = useState()
    const [isEverGreen, setIsEverGreen] = useState(false)

    // Table realted variables
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState([])
    const [clearRows, setClearRows] = useState(false);

    // Modal related variables
    const [modalInfo, setModalInfo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleModalClose = () => setShow(false);
    const handleModalShow = () => setShow(true);
    const toggleTrueFalse = () => {
        setShowModal(handleModalShow);
    }

    const ModalContent = () => {
        return (
            <div>
                <Modal isOpen={show} toggle={handleModalClose} contentClassName="custom-modal-style">
                    <ModalHeader toggle={handleModalClose}>Video Details</ModalHeader>
                    <ModalBody>
                        <ul class="modal-info-font-size">
                            <ol><b>Translated Title:</b> {modalInfo.translated_title}</ol>
                            <br />
                            <ol><b>Title:</b> {modalInfo.title}</ol>
                            <br />
                            <ol><b>Description:</b> {modalInfo.description}</ol>
                            {/* <ol><b>Age Range:</b> {modalInfo.age_range_min} - {modalInfo.age_range_max}</ol> */}
                            <br />
                            <ol><b>Channel Count:</b> {modalInfo.views_count?.toLocaleString()}</ol>
                            <br />
                            <ol><b>Astrologer:</b> {modalInfo.astro_name}</ol>
                            <br />
                            <ol><b>Upload Date:</b> {modalInfo.created_at}</ol>
                            <br />
                            <ol>
                                <div class="Preview_ii_bx">
                                    {/* <img src="images/vide_preview.png" alt="" /> */}
                                    {/* <img src={videoThumbnailUrl} alt="" /> */}
                                    <ReactPlayer controls="true" url={modalInfo.video_url} width='400px' height='200px' />
                                    {/* <a href="#"><img class="vi_icon_play" src="images/vi_icon.png" alt="" /></a> */}
                                </div>
                            </ol>
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="secondary" onClick={handleModalClose}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    const childRef = useRef();

    const history = useHistory();
    const dispatch = useDispatch();
    const { addToast } = useToasts()

    const handleLogOut = async () => {
        await Auth.signOut();
        LocalStore.clearUser();
        dispatch(logout());
        await refreshAuthUser(true);
        history.push("/admin_login");
        window.location.reload();
    };

    const renderBuilder = (props) => (
        <div className="query-builder-container" >
            <div style={{ marginBottom: "20px" }}>
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
        const { logic, data, errors } = jsonLogicFormat(immutableTree, config);
    }
    const resetValue = () => {
        setTree(initTree)
    };

    // https://stackblitz.com/edit/react-vjtclu?file=index.js
    // customInputSwitched(buttonName, e) {
    //     let newStr = `we received ${e.target.checked} for ${buttonName}...`;
    //     console.log(newStr);
    //     let newLog = [...this.state.log, newStr];
    //     this.setState({ log: newLog });
    // }

    useEffect(() => {
        // setEndDate(moment())
        // setStartDate(moment().subtract(29, 'days'))

        apiRequest("GET", `/admin/get_astrologers`)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                console.log("data", data)
                let options = data.result.map(({ astrologer_id, full_name }) => ({ value: astrologer_id, name: full_name }))
                console.log("========options", options)
                setAstrolgersList(options)
            })
            .catch(err => {
                console.log("error: ", err)
            });

    }, [])

    const handleAstrologerChange = async function (id) {
        console.log('============before astrolgerId', astrolgerId)
        setAstrolgerId(id)
        console.log('============after astrolgerId', astrolgerId)
    }

    const handleMinCountChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setYoutubeViewCountMin(val)
    }

    const handleMaxCountChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setYoutubeViewCountMax(val)
    }

    const handleSearchTextChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setSearchText(val)
    }

    const handleDatePickerEvent = async function (event, picker) {
        console.log(picker.startDate);
        setStartDate(picker?.startDate?.toDate())
        setEndDate(picker?.endDate?.toDate())
    }

    const handleSubmitClick = async function () {
        console.log("========astrolgerId", astrolgerId);
        console.log("=========youtubeViewCountMax", youtubeViewCountMax);
        console.log("=========youtubeViewCountMin", youtubeViewCountMin);
        console.log("=========searchText", searchText);
        console.log("=========startDate", startDate);
        console.log("=========endDate", endDate);
        // childRef.current.showAlert()
        handleClearRows()
        fetchVideos()

        // try {
        //     setIsLoading(true)
        //     let data = values;
        //     let result = await apiRequest("POST", `/astro/embed_video`, data)
        //     if (result) {
        //         let response = JSON.parse(JSON.parse(result).data)
        //         console.log("user logged in user data: ", response)
        //         // history.push("/video_detail"); // TODO: redirect to dashboard page
        //         addToast('Video uploaded successfully', {
        //             appearance: 'success',
        //             autoDismiss: true,
        //         })
        //     } else {
        //         addToast('Unable to upload Video.', {
        //             appearance: 'error',
        //             autoDismiss: true,
        //         })
        //         console.log('No result from server')
        //     }
        // } catch (error) {
        //     console.log('error', error)
        //     let errorMsg = error.message || "Failed retry again."
        //     addToast(errorMsg, {
        //         appearance: 'error',
        //         autoDismiss: true,
        //     })
        // }
        // setIsLoading(false)
    }

    const handleKeypress = e => {
        // handle enter button press
        if (e.key === "Enter") {
            handleSubmitClick()
        }
    };

    const handleDelete = useCallback(
        row => async () => {
            await axios.delete(`https://reqres.in/api/users/${row.id}`);
            const response = await axios.get(
                `https://reqres.in/api/users?page=${currentPage}&per_page=${perPage}`
            );

            // setData(removeItem(response.data.data, row));
            setTotalRows(totalRows - 1);
        },
        [currentPage, perPage, totalRows]
    );

    const handleViewButton = useCallback(
        row => () => {
            console.log("=========handleViewButton", row);
            setModalInfo(row);
            handleModalShow()
        },
        []
    );

    const columns = useMemo(
        () => [
            {
                name: "Translated Title",
                // selector: "title",
                selector: "translated_title",
                // sortable: true
            },
            // {
            //     name: "Title",
            //     selector: "title",
            //     // sortable: true
            // },
            {
                name: "Title",
                // eslint-disable-next-line react/button-has-type
                cell: row => <a href="#" onClick={handleViewButton(row)}>{row.title}</a>
            },
            {
                name: "Astrolger",
                selector: "astro_name",
                // sortable: true
            },
            // {
            //     // eslint-disable-next-line react/button-has-type
            //     cell: row => <button onClick={handleViewButton(row)}>View</button>
            // }
        ],
        [handleViewButton]
    );

    const tagColumns = useMemo(
      () => [
          {
              name: "Tag Name",
              selector: "name",
            
              // sortable: true
          },
          
          {
              name: "Type",
              selector: "type",
              
          },
          {
              name: "Condition",
              selector: "condition",
              
             
          },
        
      ],
      []
  );
    const handlePageChange = page => {
      debugger
        fetchVideos(page);
        setCurrentPage(page);
    };
    // const handleTagsPageChange = tagPage => {
    //   debugger
    //   let tempTags =  getTags  
    //   tempTags.slice(perPageTags.length,perPageTags.length).map((item, i) => {
    //     placeIDs.push(item.place_id);
    //   });
    // const sliceTags=()=>{
    //   let temp = getTags
    //   const startIndex = 
      
    //     setperPageTags(getTags)
    //     setCurrentPage(tagPage);
    // };


    const handlePerRowsChange = async (newPerPage, page) => {
      debugger
        fetchVideos(page, newPerPage);
        setPerPage(newPerPage);
    };

    const handleClearRows = () => {
        console.log("========handleClearRows", clearRows)
        setClearRows(!clearRows)
    }

    const fetchVideos = async (page, size = perPage) => {
        setLoading(true);

        // const response = await axios.get(
        //   `https://reqres.in/api/users?page=${page}&per_page=${size}&delay=1`
        // );
        let params = {
            page: page,
            per_page: size,
            // astrologer_id: '48c6b5b0-0d98-4e0c-a3dc-29cb07ac1a7f',
            astrologer_id: astrolgerId,
            min_views: youtubeViewCountMin,
            max_views: youtubeViewCountMax,
            start_date: startDate?.toISOString(),
            end_date: endDate?.toISOString(),
            // start_date: '2020-12-12 0:0:0',
            // end_date: '2020-12-14 0:0:0',
            full_text: searchText,
        }
        const stringified = urlQueryString.stringify(params);
        console.log("=======stringified", stringified)
        let result = await apiRequest("GET", `/admin/search_videos?${stringified}`)
        let response = JSON.parse(JSON.parse(result).data)
        console.log("++++++++++response", response)

        setData(response.data);
        setTotalRows(response.total);
        setLoading(false);
    };

    // useEffect(() => {
    //     fetchVideos(1);
    // }, []);

    const handleMinAgeChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setMinAge(val)
    }

    const handleMaxAgeChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setMaxAge(val)
    }

    const handleExpiryDateChange = async function (value, formattedValue) {
        console.log("==========handleExpiryDateChange->value", value)
        console.log("==========handleExpiryDateChange->formattedValue", formattedValue)
        setExpiryDate(value)
    }

    const handleIsEverGreenChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        let checked = event.target.checked
        if (checked) {
            let maxDate = new Date("2100/12/31").toISOString()
            setExpiryDate(maxDate)
        } else {
            setExpiryDate("")
        }

        console.log("=======isEverGreen", event)
        console.log("event.target.checked: ", event.target.checked)
        setIsEverGreen(val)
    }

    // Ignore Modal related variables
    const [ignoreModalInfo, setIgnoreModalInfo] = useState([]);
    const [ignoreShowModal, setIgnoreShowModal] = useState(false);
    const [ignoreShow, setIgnoreShow] = useState(false);
    const handleIgnoreModalClose = () => setIgnoreShow(false);
    const handleIgnoreModalShow = () => setIgnoreShow(true);

    const IgnoreModalContent = () => {
        return (
            <div>
                <Modal isOpen={ignoreShow} toggle={handleIgnoreModalClose}>
                    <ModalHeader toggle={handleIgnoreModalClose}>Ignore Videos</ModalHeader>
                    <ModalBody>
                        {selectedData.length > 0 ?
                            <React.Fragment>Are you sure to ignore the selected Videos?</React.Fragment> :
                            <React.Fragment>Please select atleast one video from the below table.</React.Fragment>}
                    </ModalBody>
                    <ModalFooter>
                        {selectedData.length > 0 &&
                            <Button color="danger" onClick={handleIgnoreButtonClick}>
                                Ignore Videos
                            {/* {isLoading && renderLoader()} */}
                            </Button>}
                        <Button color="primary" variant="secondary" onClick={handleIgnoreModalClose}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    const handleIgnoreClick = async function () {
        console.log("=======selectedData", selectedData)
        handleIgnoreModalShow()
        // https://stackoverflow.com/questions/40091000/simulate-click-event-on-react-element

        // try {
        //     setIsLoading(true)
        //     let data = values;
        //     let result = await apiRequest("POST", `/astro/embed_video`, data)
        //     if (result) {
        //         let response = JSON.parse(JSON.parse(result).data)
        //         console.log("user logged in user data: ", response)
        //         // history.push("/video_detail"); // TODO: redirect to dashboard page
        //         addToast('Video uploaded successfully', {
        //             appearance: 'success',
        //             autoDismiss: true,
        //         })
        //     } else {
        //         addToast('Unable to upload Video.', {
        //             appearance: 'error',
        //             autoDismiss: true,
        //         })
        //         console.log('No result from server')
        //     }
        // } catch (error) {
        //     console.log('error', error)
        //     let errorMsg = error.message || "Failed retry again."
        //     addToast(errorMsg, {
        //         appearance: 'error',
        //         autoDismiss: true,
        //     })
        // }
        // setIsLoading(false)
    }

    const handleIgnoreButtonClick = async function () {
        console.log("=======selectedData", selectedData)
        try {
            // setIsLoading(true)
            let data = {
                videoIds: selectedData.map(v => v.id),
            }
            console.log("==========data", data)
            let result = await apiRequest("POST", `/admin/ignore_videos`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("ignore videos: ", response)
                addToast('Videos ignored successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                })
                handleIgnoreModalClose()
                handleSubmitClick()
            } else {
                addToast('Unable to ignore Videos.', {
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
        // setIsLoading(false)
    }

    // Bulk update Modal related variables
    const [bulkModalInfo, setBulkModalInfo] = useState([]);
    const [bulkShowModal, setBulkShowModal] = useState(false);
    const [bulkShow, setBulkShow] = useState(false);
    const handleBulkModalClose = () => setBulkShow(false);
    const handleBulkModalShow = () => setBulkShow(true);

    const BulkModalContent = () => {
        return (
            <div>
                <Modal isOpen={bulkShow} toggle={handleBulkModalClose}>
                    <ModalHeader toggle={handleBulkModalClose}>Conditions</ModalHeader>
                    <ModalBody>
                        {bulkModalInfo.targetingCriteria && bulkModalInfo.expiryDate &&
                            <ul>
                                <ol><b>Targeting Criteria:</b> {bulkModalInfo.targetingCriteria}</ol>
                                <ol><b>Min Age:</b> {bulkModalInfo.minAge}</ol>
                                <ol><b>Max Age:</b> {bulkModalInfo.maxAge}</ol>
                                <ol><b>Expiry Date:</b> {bulkModalInfo.expiryDate}</ol>
                            </ul>
                        }
                        {!bulkModalInfo.targetingCriteria && bulkModalInfo.expiryDate &&
                            <p>Please select targeting criteria.</p>}
                        {bulkModalInfo.targetingCriteria && !bulkModalInfo.expiryDate &&
                            <p>Please select expiry date.</p>}
                        {!bulkModalInfo.targetingCriteria && !bulkModalInfo.expiryDate &&
                            <p>Please select targeting criteria &amp; expiry date.</p>}
                    </ModalBody>
                    <ModalFooter>
                        {selectedData.length > 0 &&
                            <Button color="success" onClick={handleApplyConditionClick}>
                                Apply Conditions
                            {/* {isLoading && renderLoader()} */}
                            </Button>}
                        <Button color="primary" variant="secondary" onClick={handleBulkModalClose}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    const handleBulkClick = async function () {
        console.log("=======selectedData", selectedData)
        console.log("=======minAge", minAge)
        console.log("=======maxAge", maxAge)
        console.log("=======expiryDate", expiryDate)
        let tc = sqlFormat(immutableTree, config)
        setTargetingCriteria(tc)

        setBulkModalInfo({ minAge: minAge, maxAge: maxAge, expiryDate: expiryDate, targetingCriteria: tc })
        handleBulkModalShow()
    }

    const handleApplyConditionClick = async function () {
        console.log("=======selectedData", selectedData)
        console.log("=======minAge", minAge)
        console.log("=======maxAge", maxAge)
        console.log("=======expiryDate", expiryDate)
        console.log("=======targetingCriteria", targetingCriteria)
        try {
            // setIsLoading(true)
            let data = {
                videoIds: selectedData.map(v => v.id),
                minAge: minAge,
                maxAge: maxAge,
                expiryDate: expiryDate,
                targetingCriteria: targetingCriteria,
                astrolgerIds: Array.from(new Set(selectedData.map(v => v.astrologer_id))),
            }
            console.log("==========data", data)
            let result = await apiRequest("POST", `/admin/bulk_update_videos`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("bulk update videos: ", response)
                addToast('Videos uploaded successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                })
                handleBulkModalClose()
                handleSubmitClick()
            } else {
                addToast('Unable to upload Videos.', {
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
        // setIsLoading(false)
    }

const [getTags,setGetTags] = useState("")
const [perPageTags,setperPageTags] = useState("")
const [tagsTotalRows,setTagsTotalRows] = useState("")

useEffect(() => {
    console.log(tagsTotalRows)
    console.log(getTags)
    console.log(perPageTags)

}, [getTags,tagsTotalRows,perPageTags])

const fetchAllTags=()=>{
  setLoading(true)
  apiRequest("GET", `/admin/get_all_tags`)
  .then(result => {
      const data = JSON.parse(JSON.parse(result).data);
      console.log("data", data)
      
      setGetTags(data.result)
      setPerPage(data.result)
      setTagsTotalRows(data.result.length)
      setLoading(false)
  })
  .catch(err => {
      console.log("error: ", err)
  });
}

   
    const [tagShowModal, settagShowModal] = useState(false);
    const [tagShow, setTagShow] = useState(false);
    const handleTagModalClose = () => setTagShow(false);
    const handleTagModalShow = () => setTagShow(true);

    const [tagDropdown ,setTagDropdown] = useState("")
    const [showDropdown ,setShowDropdown] = useState(false)
    const [tagCondition ,setTagCondition] = useState("")

    const tagTypeList=["query_condition","expiry_date"]

    const CreateTagModal=()=>{
    
      return (
        <div>
            <Modal isOpen={tagShow} toggle={handleTagModalClose} className="custom-modal-style">
           
            <div role="document" className= "model-dialog">
            <ModalHeader toggle={handleTagModalClose}>Create Tag</ModalHeader>
            <ModalBody>
            <div class="wrapper">
            <div class="content_bx">
            <div class="inner_wrapper">
            <CardGroup>
            <Card>
            <CardBody> 
                                <p class="in_tex_title">Tag Name</p>
                                <div class="in_tex">
                                    <input type="text" class="form-control" placeholder="Type a Tag Name" name="full_text_search" value={tagCondition} onChange={(e)=>setTagCondition(e.target.value)} />
                                </div>
                                
                                <p class="in_tex_title">Tag Type</p>
                                <Dropdown options={tagTypeList} onChange={(value)=>setTagDropdown(value)} value={tagDropdown} placeholder="Select a Type"/>

                                    {console.log()}
                                    <br></br>
                                <p class="in_tex_title">Tag Condition</p>
                               {tagDropdown.value==="query_condition" &&(<React.Fragment> <div class="in_tex">
                                    <input type="text" class="form-control" placeholder="Query Condition" name="full_text_search" value={searchText} onChange={handleSearchTextChange} onKeyPress={handleKeypress} />
                                </div>
                                <Button color="primary">Create Tag</Button></React.Fragment>)
                              }
                                { tagDropdown.value==="expiry_date" && <React.Fragment>
                                <DateRangePicker
                                        // initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014' }}
                                        initialSettings={{
                                            startDate: startDate,
                                            endDate: endDate,
                                            locale: {
                                                format: 'MM/DD/YYYY'
                                            }
                                        }}
                                        onEvent={handleDatePickerEvent}
                                    >
                                        <input type="text" className="form-control" />
                                    </DateRangePicker>
                                    <Button color="primary">Create Tag</Button>
                                    </React.Fragment>}

                                    
                                </CardBody>
                        </Card>
                  
                        </CardGroup>
                    <DataTable
                        // title="Users"
                        columns={tagColumns}
                        data={getTags}
                        progressPending={loading}
                        pagination
                        paginationServer={true}
                        paginationTotalRows={tagsTotalRows}
                        paginationDefaultPage={currentPage}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        selectableRows
                        onSelectedRowsChange={({ selectedRows }) => setSelectedData(selectedRows)}
                        clearSelectedRows={clearRows}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationServerOptions={{ persistSelectedOnPageChange: true }}
                    />
                </div>
            </div>
                  </div>            
                </ModalBody>
               
                </div>
            </Modal>
        </div>
   
        )
}

    
    const handleCreateTag=()=>{

      console.log("Clicked")
      handleTagModalShow()
      fetchAllTags()

    }

    // Untargeted Modal related variables
    const [untargetedModalInfo, setUntargetedModalInfo] = useState([]);
    const [untargetedShowModal, setUntargetedShowModal] = useState(false);
    const [untargetedShow, setUntargetedShow] = useState(false);
    const handleUntargetedModalClose = () => setUntargetedShow(false);
    const handleUntargetedModalShow = () => setUntargetedShow(true);

    const UntargetedModalContent = () => {
        return (
            <div>
                <Modal isOpen={untargetedShow} toggle={handleUntargetedModalClose}>
                    <ModalHeader toggle={handleUntargetedModalClose}>Untargeted Videos</ModalHeader>
                    <ModalBody>
                        {selectedData.length > 0 ?
                            <React.Fragment>Are you sure to untarget the selected Videos?</React.Fragment> :
                            <React.Fragment>Please select atleast one video from the below table.</React.Fragment>}
                    </ModalBody>
                    <ModalFooter>
                        {selectedData.length > 0 &&
                            <Button color="success" onClick={handleUntargetedButtonClick}>
                                Untarget Videos
                            {/* {isLoading && renderLoader()} */}
                            </Button>}
                        <Button color="primary" variant="secondary" onClick={handleUntargetedModalClose}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    const handleUntargetedClick = async function () {
        console.log("=======selectedData", selectedData)
        handleUntargetedModalShow()
    }

    const handleUntargetedButtonClick = async function () {
        console.log("=======selectedData", selectedData)
        try {
            // setIsLoading(true)
            let data = {
                videoIds: selectedData.map(v => v.id),
                astrolgerIds: Array.from(new Set(selectedData.map(v => v.astrologer_id))),
            }
            console.log("==========data", data)
            let result = await apiRequest("POST", `/admin/untarget_videos`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("untargeted videos: ", response)
                addToast('Videos untargeted successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                })
                handleUntargetedModalClose()
                handleSubmitClick()
            } else {
                addToast('Unable to untarget Videos.', {
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
        // setIsLoading(false)
    }





    return (

            <div class="wrapper">
                {/* <!--header start--> */}
                <header class="sticky">
                    <div class="inner_wrapper">
                        <div class="hed_left">
                            <a href="#"><img src="images/logo.png" alt="" /></a>
                        </div>

                        <div class="log_out">
                            {/* <a data-toggle="modal" data-target="#uploadvideo_pp" class="Personalize" href="#" onClick={handleUploadVideo}>Upload Video</a> */}
                            <a onClick={handleLogOut} href="#"><img src="images/logout2.png" alt="" /></a>
                        </div>

                    </div>
                </header>
                {/* <!--header end--> */}

                {/* <!--content start--> */}
                <div class="content_bx">
                    <div class="inner_wrapper">
                        <CardGroup>
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h6">Astrologers</CardTitle>
                                    {/* <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle> */}
                                    {/* <CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardText> */}
                                    {/* <Button>Button</Button> */}
                                    <SelectSearch
                                        options={astrolgersList}
                                        search
                                        placeholder="Select Astrologer"
                                        filterOptions={fuzzySearch}
                                        onChange={handleAstrologerChange}
                                        value={astrolgerId}
                                    />
                                    <div class="vf_bx">
                                        <br />
                                        {/* <p class="in_tex_title">Youtube Views count</p> */}
                                        <h6 class="in_tex_title">Youtube Views count</h6>
                                        <div class="Age_range">
                                            <table>
                                                <tr>
                                                    <td><input type="number" class="form-control" placeholder="Min" name="youtube_view_count_min" value={youtubeViewCountMin} onChange={handleMinCountChange} /></td>
                                                    <td>-</td>
                                                    <td><input type="number" class="form-control" placeholder="Max" name="youtube_view_count_max" value={youtubeViewCountMax} onChange={handleMaxCountChange} /></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h6">Youtube upload date Range</CardTitle>

                                    <DateRangePicker
                                        // initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014' }}
                                        initialSettings={{
                                            startDate: startDate,
                                            endDate: endDate,
                                            locale: {
                                                format: 'MM/DD/YYYY'
                                            }
                                        }}
                                        onEvent={handleDatePickerEvent}
                                    >
                                        <input type="text" className="form-control" />
                                    </DateRangePicker>

                                    <div class="vf_bx">
                                        {/* <p class="in_tex_title">Youtube Views count</p> */}
                                        <br />
                                        {/* <h6>Youtube Views count</h6> */}
                                        {/* <div class="Age_range">
                                            <input type="text" class="form-control" placeholder="Min" name="youtube_view_count_min" />

                                        </div> */}
                                        <p class="in_tex_title">Full text search</p>
                                        <div class="in_tex">
                                            <input type="text" class="form-control" placeholder="Based on title/description" name="full_text_search" value={searchText} onChange={handleSearchTextChange} onKeyPress={handleKeypress} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    {/* <CardTitle tag="h5">Card title</CardTitle>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>
                                    <CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</CardText> */}
                                    <Button color="primary" onClick={handleSubmitClick}>Submit</Button>
                                    <Button color="primary" onClick={handleCreateTag}>Create Tag</Button>
                                    
                                </CardBody>
                            </Card>
                        </CardGroup>

                        <CardGroup>
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5">Conditions to apply</CardTitle>
                                    {/* <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>
                                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                                    <Button>Button</Button> */}
                                    <div class="Targeting">
                                        <p class="in_tex_title">Targeting criteria<span class="red_color">*</span></p>
                                        <div>
                                            {/* <button onClick={resetValue}>reset</button>
                                                <button onClick={clearValue}>clear</button> */}
                                            <Query
                                                {...loadedConfig}
                                                value={tree}
                                                onChange={onChange}
                                                renderBuilder={renderBuilder}
                                            />
                                        </div>
                                    </div>
                                    <div class="vf_bx">
                                        <h6 class="in_tex_title">Age Range</h6>
                                        <div class="Age_range">
                                            <table>
                                                <tr>
                                                    <td><input type="number" class="form-control" placeholder="Min" name="age_min" value={minAge} onChange={handleMinAgeChange} /></td>
                                                    <td>-</td>
                                                    <td><input type="number" class="form-control" placeholder="Max" name="age_max" value={maxAge} onChange={handleMaxAgeChange} /></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="vf_bx">
                                        <br />
                                        {/* <p class="in_tex_title">Youtube Views count</p> */}
                                        {/* <h6 class="in_tex_title">Expiry Date</h6> */}
                                        <h6 class="in_tex_title">Expiry Date<span class="red_color">*</span></h6>
                                        <table>
                                            <tr>
                                                <td class="datePickerSize">
                                                    <DatePicker showClearButton={false} value={expiryDate} onChange={handleExpiryDateChange} />
                                                </td>
                                                <td class="custom-switch-place">
                                                    <CustomInput
                                                        type="switch"
                                                        id="exampleCustomSwitch"
                                                        name="customSwitch"
                                                        label="Evergreen video?"
                                                        value={isEverGreen}
                                                        onChange={handleIsEverGreenChange}
                                                    // className="text-center text-md-right"
                                                    // onChange={this.customInputSwitched.bind(this, "button1")}
                                                    />
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    {/* <CardTitle tag="h5">Card title</CardTitle>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>
                                    <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                                    <Button>Button</Button> */}
                                    <div class="Targeting_inner">
                                        {/* <span><img src="images/close2.png" alt="" onClick={resetValue} data-name="test" data-id="" />{stringify(sqlFormat(immutableTree, config), undefined, 2)}</span> */}
                                        <span>{stringify(sqlFormat(immutableTree, config), undefined, 2)}</span>
                                    </div>
                                    <div class="text-center">
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                    </div>
                                    <br />
                                    <div class="text-center">
                                        <Button color="danger" className="text-md-right" onClick={handleIgnoreClick}>Mark as Ignore</Button>
                                    </div>
                                    <div class="text-center">
                                        <br />
                                        <Button color="primary" onClick={handleBulkClick}>Bulk Update (Apply Condition)</Button>
                                    </div>
                                    <div class="text-center">
                                        <br />
                                        <Button color="primary" onClick={handleUntargetedClick}>Mark as Untargeted</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </CardGroup>

                        {/* <AdvancedPaginationTable astrolgerId ref={childRef}/> */}
                        <DataTable
                            // title="Users"
                            columns={columns}
                            data={data}
                            progressPending={loading}
                            pagination
                            paginationServer={true}
                            paginationTotalRows={totalRows}
                            paginationDefaultPage={currentPage}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                            selectableRows
                            onSelectedRowsChange={({ selectedRows }) => setSelectedData(selectedRows)}
                            clearSelectedRows={clearRows}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            paginationServerOptions={{ persistSelectedOnPageChange: true }}
                        />
                    </div>
                </div>
               
                {/* <!--content end--> */}
                {show ? <ModalContent /> : null}
                {bulkShow ? <BulkModalContent /> : null}
                {ignoreShow ? <IgnoreModalContent /> : null}
                {untargetedShow ? <UntargetedModalContent /> : null}
                {tagShow ? <CreateTagModal /> : null}
            </div>
        
    )
}

export default AdminDashboard
