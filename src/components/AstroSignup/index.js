import React, { useState } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
var Loader = require('react-loaders').Loader;

const AstroSignup = () => {
    const { addToast } = useToasts()
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [values, setValues] = useState({ email: '', password: '', fullName: '', phoneNumber: '', briefIntro: '' })
    const toggleShowPassword = (prevShowPassword) => setShowPassword(!prevShowPassword)

    const handleToggleShowPassword = async function () {
        console.log('toggle eye')
        toggleShowPassword(showPassword)
    }
    function isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) && !isNaN(parseFloat(str))
    }

    const handleChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        console.log('============before values', values)
        setValues({ ...values, [name]: val })
        console.log('============after values', values)
    }

    const handleSubmitClick = async function () {
        const validate = (values) => {
            let errors = {};
            if (!values.fullName) {
                errors.fullName = 'Full Name is required';
            }
            if (!values.email) {
                errors.email = 'Email address is required';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Email address is invalid';
            }
            if (!values.password) {
                errors.password = 'Password is required';
            }
            if (!values.phoneNumber) {
                errors.phoneNumber = 'Phone Number is required';
            } else if (!isNumeric(values.phoneNumber)) {
                errors.phoneNumber = 'Phone Number is Invalid';
            }
            if (!values.briefIntro) {
                errors.briefIntro = 'Brief Intro is required';
            }
            console.log(errors)
            return errors;
        };
        const errors = validate(values)
        if (Object.keys(errors).length !== 0) {
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
        let data = values
        try {
            setIsLoading(true)
            console.log("=======signup called")
            console.log(data);
            const { user } = await Auth.signUp({
                username: values.email,
                password: values.password,
                attributes: {
                    'email': values.email,
                    'custom:userType': "3" // 3 = astrologer user
                },
                clientMetadata: {
                    ...data
                }
            })
            console.log("===== user signup on cognito success")
            console.log(user)
            addToast('Astro signup successfully.', {
                appearance: 'success',
                autoDismiss: true,
            })
            // TODO: redirect to success page.
            history.push("/astro_signup_success");

            // let result = await apiRequest("POST", `/astro/signup`, data)
            // if (result) {
            //     let response = JSON.parse(JSON.parse(result).data)
            //     console.log("astro user signup successfully", response)
            // }else{
            //     console.log('No result from server')
            // }
        } catch (error) {
            console.log('error', error)
            let errorMsg = error.message || "Astro Signup failed retry again."
            addToast(errorMsg, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
        setIsLoading(false)
    }

    return (
        <div class="wrapper astro_signup_comp">
            {/* <!--header start--> */}
            <header class="sticky">
                <div class="inner_wrapper">
                    <div class="hed_left_tw">
                        <a class="birth_logo" href="#"><img src="images/logo.png" alt="" /></a>
                        {/* <!--mobile & tab view--> */}
                        {/* <!--a class="close_btn" href="#"><img src="images/close.png" alt="" /> <span>Birth Details</span></a--> */}
                        <a class="close_btn" href="#" onClick={() => history.goBack()}><img src="images/back_btn.png" alt="" /> <span>Log In</span></a>

                    </div>
                    {/* <!--div class="hed_right_tw">
				<a class="user_photo" href="#"> <img src="images/photo.png" alt="" /> Login</a>
			</div--> */}
                </div>
            </header >
            {/* < !--header end-- > */}

            {/* < !--content start-- > */}
            <div class="content_bx">
                <div class="full_banner_login"></div>
                <div class="login_wite_inner">
                    <div class="login_wite">
                        <div class="login_wite_i">
                            <h5>We’d love to have you on Trology!</h5>
                            <p>Please fill in details and we will get back to you.</p>
                        </div>
                        <div class="">
                            <p class="in_tex_title">Full Name</p>
                            <div class="in_tex">
                                <input type="text" class="form-control" placeholder="Enter your full name" name="fullName" onChange={handleChange} value={values.fullName} />
                            </div>

                            <p class="in_tex_title">Email Address</p>
                            <div class="in_tex">
                                <input type="text" class="form-control" placeholder="Enter your email address" name="email" onChange={handleChange} value={values.email} />
                            </div>

                            <p class="in_tex_title">Password</p>
                            <div class="in_tex pass_eye">
                                <input type={showPassword ? "text" : "password"} class="form-control"
                                    placeholder="Enter your password " name="password" onChange={handleChange} value={values.password} />
                                <button class="pa_ey_icon" onClick={handleToggleShowPassword}>
                                    <i className={showPassword ? "far fa-eye-slash" : "far fa-eye"}></i>
                                    {/* <i class="far fa-eye-slash"></i> */}
                                </button>
                            </div>

                            <p class="in_tex_title">Phone Number</p>
                            <div class="in_tex">
                                <input type="text" class="form-control" placeholder="Enter your phone number" name="phoneNumber" onChange={handleChange} value={values.phoneNumber} />
                            </div>

                            <p class="in_tex_title">Brief Introduction</p>
                            <div class="in_tex textare_bx">
                                <textarea class="form-control" placeholder="Tell us about yourself" name="briefIntro" onChange={handleChange} value={values.briefIntro}></textarea>
                            </div>


                            <div class="text-center">
                                <button class="org_btn log_btn" onClick={handleSubmitClick}>Submit</button>
                                {isLoading && renderLoader()}
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <!--content end-- >


    )
}

export default AstroSignup
