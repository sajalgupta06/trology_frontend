import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router";
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import LogRocket from "logrocket";
import "./styles.scss";
import { options, TimeZoneToName } from "./options";
import useForm from "./useForm";
import { validateBeforeNext, validateAfterNext } from './formValidationRules';
import { useToasts } from 'react-toast-notifications'
import PlacesAutocomplete from "./placeAutoComplete";

var Loader = require('react-loaders').Loader;
const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const Personalize = () => {
    const history = useHistory();
    const { addToast } = useToasts()
    const [isStepOne, setIsStepOne] = useState(true)
    const [isStepTwo, setIsStepTwo] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = (prevShowPassword) => setShowPassword(!prevShowPassword)
    const handleToggleShowPassword = async function () {
        console.log('toggle eye')
        toggleShowPassword(showPassword)
    }
    let range = (start, end) => Array.from(Array(end + 1).keys()).slice(start);

    const headerOncClick = function (e) {
        setIsStepOne(!isStepOne)
    }
    const headerStep2Onclick = function (e) {
        setIsStepTwo(!isStepTwo)
    }
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }
    const [isLoading, setIsLoading] = useState(false)
    const signup = async function () {
        console.log("=======signup called")
        console.log(values);
        let data = values
        // data.cognitoUser = user
        data.timezone = data.timezone
        // data.cityName = options[data.city].city
        data.cityName = data.city
        data.dob = `${values.dobYear}/${values.dobMonth}/${values.dobDay}`
        data.tob = `${values.dobHour}:${values.dobMinute}:${values.dobSecond ? values.dobSecond : 0}`
        console.log(data)
        setIsLoading(true)
        try {
            const { user } = await Auth.signUp({
                username: values.email,
                password: values.password,
                attributes: {
                    'email': values.email,
                    'custom:userType': "2" // 2 = customer user
                },
                clientMetadata: {
                    ...data
                }
            })
            console.log("===== user signup on cognito success")
            console.log(user)
            history.push("/login");
            addToast('Please verify your email.', {
                appearance: 'success',
                autoDismiss: true,
            })
        } catch (error) {
            let errorMsg = error.message || "Signup failed retry again."
            addToast(errorMsg, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
        setIsLoading(false)
    }
    const { handleChange, handleSubmit, handleNext, handlePlace, values, beforeNextErrors, afterNextErrors } = useForm(signup, validateBeforeNext, validateAfterNext, setIsStepTwo);
    const secondStep = useRef(null)

    useEffect(() => {
        console.log('===============isStepTwo are updated', isStepTwo);
        if (isStepTwo) {
            secondStep.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [isStepTwo]);

    return (
        <div class="wrapper personalize_comp">
            {/* <!--header start--> */}
            <header class="sticky">
                <div class="inner_wrapper">
                    <div class="hed_left_tw">
                        <a class="birth_logo" href="/"><img src="images/logo.png" alt="" /></a>
                        {/* <!--mobile & tab view--> */}
                        <a class="close_btn" href="#"><img src="images/close.png" alt="" /> <span>Birth Details</span></a>
                        {/* <!--a class="close_btn" href="#"><img src="images/back_btn.png" alt=""/> <span>Join In</span></a--> */}

                    </div>
                    <div class="hed_right_tw">
                        <a class="user_photo" href="login"> <img src="images/photo.png" alt="" /> Login</a>
                    </div>
                </div>
            </header>
            {/* <!--header end--> */}

            {/* <!--content start--> */}
            <div class="content_bx">
                <div class="full_banner"><img src="images/signupbanner.png" alt="" /></div>
                <div class="inner_wrapper">
                    <div class="white_box">

                        <div id="accordion" class="accordion birth_d">
                            <div class="card mb-0">
                                <div onClick={headerOncClick} class="card-header collapsed" data-toggle="collapsed" href="#collapseOne"
                                    aria-expanded={isStepOne}>
                                    <a class="card-title">
                                        <table>
                                            <tr>
                                                <td><img src="images/birth-details.png" alt="" /></td>
                                                <td>
                                                    <h4>Birth details</h4>
                                                    <p>Please enter your birth details to generate your horoscope.</p>
                                                </td>
                                            </tr>
                                        </table>
                                        <i class="fas fa-chevron-down"></i>
                                    </a>
                                </div>
                                <div id="collapseOne" className={`card-body collapse ${isStepOne ? 'show' : ''}`} data-parent="#accordion">

                                    <div class="birth_i">

                                        {/* <!--m&T view--> */}
                                        <div class="birth_mobs">
                                            <h6>Nice to have you here!</h6>
                                            <p>Please enter your birth details to generate your horoscope.</p>
                                            <a class="Step_text" href="#">Step 1/2</a>
                                        </div>
                                        {/* <!--m&T view--> */}
                                        <div class="per_fullbx">
                                            <div class="row">
                                                {/* {errors.email && (
                                                <p className="help is-danger">{errors.email}</p>
                                            )} */}
                                                <div class="col-md-6">
                                                    <p class="in_tex_title">Date of birth <span class="red_color">*</span></p>
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
                                                                                    {monthArr[f - 1]}
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
                                                    <p class="in_tex_title">Time of birth <span class="red_color">*</span></p>
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
                                                                    {/* <div class="slect_towarrow">
                                                                        <select class="form-control" name="dobSecond" onChange={handleChange} value={values.dobSecond}>
                                                                            <option value="" >SS</option>
                                                                            {range(0, 59).map(f => (
                                                                                <option key={f} value={f}>
                                                                                    {f}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div> */}
                                                                </td>
                                                            </tr>

                                                        </table>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="row">
                                                <div class="col-md-6">
                                                    <p class="in_tex_title">Gender <span class="red_color">*</span></p>
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
                                                    <p class="in_tex_title">Place of birth <span class="red_color">*</span></p>
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
                                                        <PlacesAutocomplete handlePlace={handlePlace} />
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="row">
                                                <div class="col-md-6">
                                                    <table class="two_box">
                                                        <tr>
                                                            <td>
                                                                <p class="in_tex_title">Latitude <span class="red_color">*</span></p>
                                                                <div class="in_tex">
                                                                    <input /*onChange={onChangeLat} value={latValue}*/ type="number" class="form-control" placeholder="-" name="lat" onChange={handleChange} value={values.lat} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p class="in_tex_title">Longitude <span class="red_color">*</span></p>
                                                                <div class="in_tex">
                                                                    <input /*onChange={onChangeLng} value={lngValue}*/ type="number" class="form-control" placeholder="-" name="lng" onChange={handleChange} value={values.lng} />
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

                                            </div>

                                            {/* <div class="row">
                                                <div class="col-md-6">
                                                    <p class="in_tex_title">Preferred Language </p>
                                                    <div class="in_tex">
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" name="language" onChange={handleChange} value={values.language}>
                                                                <option value="" >Select</option>
                                                                <option value="en">English</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <p class="in_tex_title">Timezone</p>
                                                    <div class="in_tex">
                                                        <div class="slect_towarrow">
                                                            <select class="form-control" id="timezone" name="timezone" onChange={handleChange} value={values.timezone}>
                                                                <option value="" >Select</option>
                                                                {Object.keys(TimeZoneToName).map(id => (
                                                                    <option key={id} value={id}>
                                                                        {TimeZoneToName[id]}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div class="row">
                                                <div class="col-md-6 text-center">
                                                    <button onClick={handleNext} data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"
                                                        id="Next_birth" class="org_btn">Next</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" */}
                            <div onClick={headerStep2Onclick} class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" aria-expanded={isStepTwo}
                                href="#collapseTwo">
                                <a class="card-title">
                                    <table>
                                        <tr>
                                            <td><img src="images/contact-information.png" alt="" /></td>
                                            <td>
                                                <h4>Basic details</h4>
                                                <p>Please create a login for future access.</p>
                                            </td>
                                        </tr>
                                    </table>
                                    <i class="fas fa-chevron-down"></i>
                                </a>
                            </div>
                            {/* <div id="collapseTwo" class="card-body collapse" data-parent="#accordion"> */}
                            <div id="collapseTwo" className={`card-body collapse ${isStepTwo ? 'show' : ''}`} data-parent="#accordion" ref={secondStep}>
                                <div class="birth_i">
                                    {/* <!--m&T view--> */}
                                    <div class="birth_mobs">
                                        <h6>We are almost there!</h6>
                                        <p>Please create a login for future access.</p>
                                        <a class="Step_text" href="#">Step 2/2</a>
                                    </div>
                                    {/* <!--m&T view--> */}
                                    {/* <div class="birth_ii">
                                        <p><a href="#"><img src="images/fb.png" alt="" /></a></p>
                                        <p><img class="orim" src="images/or.png" alt="" /></p>
                                    </div> */}
                                    <div class="row">
                                        <div class="col-md-12">
                                            <p class="in_tex_title_ii">Type in your details</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <p class="in_tex_title">First Name <span class="red_color">*</span></p>
                                            <div class="in_tex">
                                                <input type="text" class="form-control" placeholder="Enter your name" name="firstName" onChange={handleChange} value={values.firstName} />
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <p class="in_tex_title">Last Name <span class="red_color">*</span></p>
                                            <div class="in_tex">
                                                <input type="text" class="form-control" placeholder="Enter your last name " name="lastName" onChange={handleChange} value={values.lastName} />
                                            </div>
                                        </div>

                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <p class="in_tex_title">Email Address <span class="red_color">*</span></p>
                                            <div class="in_tex">
                                                <input type="email" class="form-control"
                                                    placeholder="Enter your email address" name="email" onChange={handleChange} value={values.email} />
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <p class="in_tex_title">Password <span class="red_color">*</span></p>
                                            <div class="in_tex pass_eye">
                                                <input type={showPassword ? "text" : "password"} class="form-control"
                                                    placeholder="Enter your password " name="password" onChange={handleChange} value={values.password} />
                                                <button class="pa_ey_icon" onClick={handleToggleShowPassword}>
                                                    <i className={showPassword ? "far fa-eye-slash" : "far fa-eye"}></i>
                                                    {/* <i class="far fa-eye-slash"></i> */}
                                                </button>
                                                <span>Use 8 or more characters with a mix of lower, upper case letters, numbers & symbols</span>
                                            </div>
                                        </div>

                                    </div>


                                    <div class="row">
                                        <div class="col-md-6">
                                            <p class="in_tex_title">Phone number <span class="red_color">*</span></p>
                                            <div class="in_tex">
                                                <input type="text" class="form-control"
                                                    placeholder="Enter your phone number " name="phoneNumber" onChange={handleChange} value={`+91 ${values.phoneNumber ? values.phoneNumber : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6 text-center">
                                            <button class="org_btn" onClick={handleSubmit}>Generate Horoscope</button>
                                            {isLoading && renderLoader()}
                                            <p class="terms_policy">By signing up with us you agree to <a href="#">terms and
                                            condition</a> and <a href="#">privacy policy</a></p>
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
        // <!--content end-->

    )
}

export default Personalize
