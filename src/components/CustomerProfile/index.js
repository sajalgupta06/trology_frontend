import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { options, cityIdMapping, TimeZoneToName } from "../Personalize/options"
import { validateBeforeNext } from "../Personalize/formValidationRules"
import { useToasts } from 'react-toast-notifications'
import PlacesAutocomplete from "../Personalize/placeAutoComplete";

var Loader = require('react-loaders').Loader;

const CustomerProfile = () => {


    const history = useHistory();
    const state = useSelector(
        (state) => state
    );
    let range = (start, end) => Array.from(Array(end + 1).keys()).slice(start);
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }
    const { addToast } = useToasts()
    const [edited, setEdited] = useState(false)
    const [emailAtr, setEmailAtr] = useState('')
    const [values, setValues] = useState(
        {
            "id": "",
            "user_id": "",
            "first_name": "",
            "last_name": "",
            "mobile_number": "",
            "date_of_birth": "",
            "time_of_birth": "",
            "gender": "",
            "place_of_birth": "",
            "lat": "",
            "lng": "",
            "astroSystem": "",
            "language": "",
            "timezone": "",
            "created_at": "",
            "updated_at": "",
            "dobYear": "",
            "dobMonth": "",
            "dobDay": "",
            "dobHour": "",
            "dobMinute": "",
            "dobSecond": "",
            "name": "",
            "city": "",
            "email": ""
        }
    );

    useEffect(() => {
        let profile = state.profile.profile[0]
        if (!profile) return
        if (edited) return
        const dateOfBirth = profile.date_of_birth.split("-")
        const timeOfBirth = profile.time_of_birth.split(":")
        const data = {
            "dobYear": parseInt(dateOfBirth[0]),
            "dobMonth": parseInt(dateOfBirth[1]),
            "dobDay": parseInt(dateOfBirth[2]),
            "dobHour": parseInt(timeOfBirth[0]),
            "dobMinute": parseInt(timeOfBirth[1]),
            "dobSecond": parseInt(timeOfBirth[2]),
            "name": profile.first_name + " " + profile.last_name,
            "lat": profile.latitude,
            "lng": profile.longitude,
            "language": profile.preferred_language,
            // "city": cityIdMapping[profile.place_of_birth],
            "city": profile.place_of_birth,
            "astroSystem": profile.astro_system,
        }
        setValues({ ...data, ...profile })
        Auth.currentUserInfo().then((user) => {
            setEmailAtr(user.attributes.email)
        })
    }, [state]);

    const handleChange = (event) => {
        event.persist();
        // event.preventDefault();
        let name = event.target.name
        let val = event.target.value
        console.log(name)
        console.log(val)
        console.log('============before values', values)
        setValues({ ...values, [name]: val })
        setEdited(true)
        console.log('============after values', values)
    };

    const handlePlace = (obj) => {
        console.log("handlePlace", obj)
        setValues({ ...values, ...obj })
    };

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        console.log("handleSubmit called", values)
        let errors = validateBeforeNext(values)
        if (Object.keys(errors).length === 0) {
            console.log("no errors")
            let data = values
            // data.cityName = options[data.city].city
            data.cityName = data.city
            data.dob = `${values.dobYear}/${values.dobMonth}/${values.dobDay}`
            data.tob = `${values.dobHour}:${values.dobMinute}:${values.dobSecond}`
            console.log(data)
            try {
                setIsLoading(true)
                let data = values;
                let result = await apiRequest("POST", `/user/update_profile`, data)
                if (result) {
                    let response = JSON.parse(JSON.parse(result).data)
                    console.log("user data updated success: ", response)
                    history.push("/customer_dashboard");
                    addToast('User profile updated successfully', {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                } else {
                    addToast('Unable to update user profile.', {
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
        } else {
            console.log("errors in generate horoscope")
            Object.keys(errors).map(function (keyName, keyIndex) {
                return (
                    addToast(errors[keyName], {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                )
            })
        }
    }

    useEffect(() => {
        console.log('===============values are updated', values);
        // if (values.city) {
        //     setValues(values => ({ ...values, lat: options[values.city].geo.lat, lng: options[values.city].geo.lng }))
        // }
    }, [values.city]);

    const handleCancel = () => {
        history.push("/customer_dashboard")
    }

    return (
        <div class="wrapper customer_profile_comp">
            {/* <!-- mobile hed--> */}
            <div class="mob_hed">
                <a href="#" onClick={() => history.goBack()}><img src="images/back_btn.png" alt="" /> My Profile</a>
            </div>
            {/* <!-- mobile hed--> */}
            {/* <!--content start--> */}
            <div class="content_bx">
                <div class="grabg_box">&nbsp;</div>
                <div class="wpay_wrapper">

                    <div class="wpay wpay_profile">

                        <div class="my_profile">
                            <div class="my_pic">
                                <div class="my_pic_inner">
                                    {values.gender != '' && <div class="myprofile_photo"><img class="myprofile_photo" src={`${values.gender == 1 ? 'images/male.png': 'images/female.png'}`} alt="" /></div>}
                                    {/* <div class="upload-btn-wrapper">
                                        <button class="btn_Update">Update</button>
                                        <input type="file" name="myfile" />
                                    </div> */}
                                </div>
                            </div>
                            <h4>Personal details</h4>

                            <div class="details_full">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p class="in_tex_title">Name</p>
                                        <div class="in_tex">
                                            <input type="text" readOnly class="form-control" placeholder="Enter your Name " value={values.name} />
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <p class="in_tex_title">Phone Number</p>
                                        <div class="in_tex">
                                            <input type="text" readOnly class="form-control" value={`+91 ${values.mobile_number}`} placeholder="Enter your Phone Number " />
                                        </div>
                                    </div>

                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p class="in_tex_title">Email Address</p>
                                        <div class="in_tex">
                                            <input type="text" readOnly class="form-control" value={emailAtr} placeholder="Enter your email address" />
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <p class="in_tex_title">Password</p>
                                        <div class="in_tex pass_eye">
                                            <input type="password" readOnly class="form-control" value="***********************" placeholder="Enter your password " />
                                            {/* <button class="pa_ey_icon">
                                                <i class="far fa-eye"></i>
                                                <!--i class="far fa-eye-slash"></i-->
                                            </button> */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <hr class="line_sep" />
                            <h4>BIRTH details</h4>

                            <div class="details_full">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p class="in_tex_title">Date of birth </p>
                                        <div class="in_tex">
                                            <table class="full_tab_in">
                                                <tr>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="dobDay" onChange={handleChange} value={values.dobDay}>
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
                                                            <select class="form-control" name="dobMonth" onChange={handleChange} value={values.dobMonth}>
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
                                                            <select class="form-control" name="dobYear" onChange={handleChange} value={values.dobYear}>
                                                                <option value="" >YYYY</option>
                                                                {range(1900, new Date().getFullYear()).reverse().map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>

                                            </table>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <p class="in_tex_title">Time of birth  </p>
                                        <div class="in_tex">
                                            <table class="full_tab_in">
                                                <tr>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="dobHour" onChange={handleChange} value={values.dobHour}>
                                                                <option value="" >HH</option>
                                                                {range(0, 23).map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="dobMinute" onChange={handleChange} value={values.dobMinute}>
                                                                <option value="" >MM</option>
                                                                {range(0, 59).map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="dobSecond" onChange={handleChange} value={values.dobSecond}>
                                                                <option value="" >SS</option>
                                                                {range(0, 59).map(f => (
                                                                    <option key={f} value={f}>
                                                                        {f}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                </tr>

                                            </table>
                                        </div>
                                    </div>

                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <p class="in_tex_title">Gender </p>
                                        <div class="in_tex">
                                            <div class="slect_towarrow">
                                                <select class="form-control" name="gender" onChange={handleChange} value={values.gender}>
                                                    <option value="" >Select</option>
                                                    <option key='male' value='1'>Male</option>
                                                    <option key='female' value='2'>Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <p class="in_tex_title">Place of birth</p>
                                        <div class="in_tex">
                                            {/* <div class="slect_towarrow">
                                                <select class="form-control" id="city" name="city" onChange={handleChange} value={values.city}>
                                                    <option value="" >Select</option>
                                                    {Object.keys(options).map(id => (
                                                        <option key={options[id].city} value={id}>
                                                            {options[id].city}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                                            {values.city && <PlacesAutocomplete handlePlace={handlePlace} cityName={values.city} />}
                                        </div>
                                    </div>

                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <table class="two_box">
                                            <tr>
                                                <td>
                                                    <p class="in_tex_title">Latitude </p>
                                                    <div class="in_tex">
                                                        <input /*onChange={onChangeLat} value={latValue}*/ type="number" class="form-control" placeholder="-" name="latitude" onChange={handleChange} value={values.lat} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <p class="in_tex_title">Longitude </p>
                                                    <div class="in_tex">
                                                        <input /*onChange={onChangeLng} value={lngValue}*/ type="number" class="form-control" placeholder="-" name="longitude" onChange={handleChange} value={values.lng} />
                                                    </div>
                                                </td>
                                            </tr>

                                        </table>

                                    </div>
                                    {/* <div class="col-md-6">
                                        <p class="in_tex_title">Astrology System</p>
                                        <div class="in_tex">
                                            <div class="slect_towarrow">
                                                <select class="form-control" name="astroSystem" onChange={handleChange} value={values.astroSystem}>
                                                    <option value="" >Select</option>
                                                    <option value="1">Indian</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}
                                     <div class="col-md-6">
                                        <p class="in_tex_title">Timezone</p>
                                        <div class="in_tex">
                                            <div class="slect_towarrow">
                                                <select disabled class="form-control" name="timezone" onChange={handleChange} value={values.timezone}>
                                                    <option value="" >Select</option>
                                                    {Object.keys(TimeZoneToName).map(id => (
                                                        <option key={id} value={id} >
                                                            {TimeZoneToName[id]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div class="row"> */}
                                    {/* Hide prefered language */}
                                    {/* <div class="col-md-6">
                                        <p class="in_tex_title">Preferred Language</p>
                                        <div class="in_tex">
                                            <div class="slect_towarrow">
                                                <select class="form-control" name="language" onChange={handleChange} value={values.language}>
                                                    <option value="" >Select</option>
                                                    <option value="en">English</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* <div class="col-md-6">
                                        <p class="in_tex_title">Timezone</p>
                                        <div class="in_tex">
                                            <div class="slect_towarrow">
                                                <select class="form-control" name="timezone" onChange={handleChange} value={values.timezone}>
                                                    <option value="" >Select</option>
                                                    {Object.keys(TimeZoneToName).map(id => (
                                                        <option key={id} value={id}>
                                                            {TimeZoneToName[id]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}

                                {/* </div> */}
                            </div>
                        </div>

                        <div class="poced_btn">
                            <button onClick={handleSubmit}>Save changes</button>
                            {isLoading && renderLoader()}
                            <button class="cancel_btn" onClick={handleCancel}>Cancel</button>
                        </div>

                    </div>

                </div>
            </div>
            {/* <!--content end--> */}
        </div>
    )
}

export default CustomerProfile
