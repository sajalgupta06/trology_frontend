import React, { useState } from 'react';
// import { apiRequest } from "../../utils/Api";
import { Auth } from 'aws-amplify';
import { useToasts } from 'react-toast-notifications'
import { useHistory } from "react-router";
import "./styles.scss";
var Loader = require('react-loaders').Loader;

const ForgotPassword = () => {
    function renderLoader() {
        return <Loader type="line-scale"  color="#EE8265"  />
    }
    const { addToast } = useToasts()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)
    const history = useHistory();
    const handleSubmit = function() {
        if (!isOtpSent) {
            setIsLoading(true)
        console.log('===============email', email)
        Auth.forgotPassword(email)
            .then(data => {
                setIsLoading(false)
                setIsOtpSent(true)
                console.log(data)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            });
        } else {
            Auth.forgotPasswordSubmit(email, verificationCode, newPassword)
                .then(data => {
                    addToast('Password Changed successfully', {
                        appearance: 'success',
                        autoDismiss: true,
                      })
                    console.log(data)
                    history.push("/login");
                })
                .catch(err => {
                    let errMsg = err.message || 'Error while resetting password'
                    addToast(errMsg, {
                        appearance: 'error',
                        autoDismiss: true,
                      })
                    console.log(err)
                });
        }
    }
    const handleVerificationCodeChange = function (e) {
        let verificationCode = e.target.value
        setVerificationCode(verificationCode)
    }
    const handleNewPasswordChange = function (e) {
        let newPassword = e.target.value
        setNewPassword(newPassword)
    }
    const handleOnChangeEmail = function (e) {
        let email = e.target.value
        setEmail(email)
    }
    return (
        <div class="wrapper forgot_password_comp">
            {/* <!--header start--> */}
            <header class="sticky">
                <div class="inner_wrapper">
                    <div class="hed_left_tw">
                        <a class="birth_logo" href="#"><img src="images/logo.png" alt="" /></a>
                        {/* <!--mobile & tab view--> */}
                        {/* <a class="close_btn" href="#"><img src="images/close.png" alt="" /> <span>Birth Details</span></a> */}
                        <a class="close_btn" href="#" onClick={() => history.goBack()}><img src="images/back_btn.png" alt="" /> <span>Forgot Password</span></a>
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
                            <h5>Forgot Password!</h5>
                            <p>Please enter the registered email address and we’ll<br /> send you password reset instructions.</p>
                        </div>
                        <div class="">
                            <p class="in_tex_title">Email Address</p>
                            <div class="in_tex">
                                <input onChange={handleOnChangeEmail} type="text" class="form-control" placeholder="Enter your email address" />
                            </div>
                        </div>
                        {isOtpSent && 
                            <div>
                                <p class="in_tex_title">Verification code</p>
                                <div class="in_tex pass_eye">
                                    <input onChange={handleVerificationCodeChange} type="password" class="form-control"
                                        placeholder="Enter verification code received" name="password" />
                                </div>

                                <p class="in_tex_title">New Password</p>
                                <div class="in_tex pass_eye">
                                    <input onChange={handleNewPasswordChange} type="password" class="form-control"
                                        placeholder="Enter new password " name="password" />
                                </div>
                            </div>
                        }
                        <div class="text-center">
                            <button onClick={handleSubmit} class="org_btn log_btn">Submit</button>
                            { isLoading && renderLoader()}
                        </div>
                        <div class="astrologer_log">
                            Didn’t receive any verification code yet? <a onClick={handleSubmit} href="#">Resend</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // < !--content end-- >
    )
}

export default ForgotPassword
