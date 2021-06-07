import React, { useState } from 'react';
import { apiRequest } from "../../utils/Api";
import SignInWithFacebook from '../Facebook/login'
import { Auth } from "aws-amplify";
import LogRocket from "logrocket";
import { useHistory } from "react-router";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
var Loader = require('react-loaders').Loader;


const Login = () => {
    const { addToast } = useToasts()
    function renderLoader() {
        return <Loader type="line-scale"  color="#EE8265"  />
    }
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [values, setValues] = useState({email:'', password:''})
    const toggleShowPassword = (prevShowPassword) => setShowPassword(!prevShowPassword)

    const handleToggleShowPassword = async function () {
        console.log('toggle eye')
        toggleShowPassword(showPassword)
    }
    const redirectCallBack = function() {
        history.push("/video_detail");
    }
    const handleChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setValues({ ...values, [name]: val })
    }

    const handleLoginClick = async function () {
        try {
            setIsLoading(true)
            let email = values.email
            let password = values.password
            const user = await Auth.signIn(email, password);
            let logrocketOptions = {
                name: user.username,
                email: user.username
            };
            LogRocket.identify(user.username, logrocketOptions);
            console.log("login successs", user)
            let result = await apiRequest("GET", `/user/profile`)
            setIsLoading(false)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("user logged in user data: ", response)
                history.push("/customer_dashboard");
                addToast('Login Success', {
                    appearance: 'success',
                    autoDismiss: true,
                  })
            }else{
                addToast('Login Failure.', {
                    appearance: 'error',
                    autoDismiss: true,
                  })
                console.log('No result from server')
            }
        } catch (error) {
            console.log('error', error)
            let errorMsg = error.message || "Login failed retry again."
            addToast(errorMsg, {
                appearance: 'error',
                autoDismiss: true,
            })
        }
        setIsLoading(false)
    }

    const handleKeypress = e => {
        // handle enter button press
        if (e.key === "Enter") {
            handleLoginClick()
        }
    };

    return (
        <div class="wrapper login_comp">
            {/* <!--header start--> */}
            <header class="sticky">
                <div class="inner_wrapper">
                    <div class="hed_left_tw">
                        <a class="birth_logo" href="#"><img src="images/logo.png" alt="" /></a>
                        {/* <!--mobile & tab view--> */}
                        {/* <!--a class="close_btn" href="#"><img src="images/close.png" alt=""/> <span>Birth Details</span></a--> */}
                        <a class="close_btn" href="#" onClick={() => history.goBack()}><img src="images/back_btn.png" alt="" /> <span>Log In</span></a>

                    </div>
                    {/* <!--div class="hed_right_tw">
				<a class="user_photo" href="#"> <img src="images/photo.png" alt=""/> Login</a>
			</div--> */}
                </div>
            </header>
            {/* <!--header end--> */}

            {/* <!--content start--> */}
            <div class="content_bx">
                <div class="full_banner_login"></div>
                <div class="login_wite_inner">
                    <div class="login_wite">
                        <div class="login_wite_i">
                            <h5>Welcome Back!</h5>
                            <p>Please enter your email and password to login</p>
                        </div>
                        <div class="">
                            <p class="in_tex_title">Email Address</p>
                            <div class="in_tex">
                                <input type="text" class="form-control" placeholder="Enter your email address" name="email" onChange={handleChange} value={values.email} />
                            </div>

                            <p class="in_tex_title">Password</p>
                            <div class="in_tex pass_eye">
                                <input type={showPassword ? "text" : "password"} class="form-control"
                                    placeholder="Enter your password " name="password" onChange={handleChange} value={values.password} onKeyPress={handleKeypress}/>
                                <button class="pa_ey_icon" onClick={handleToggleShowPassword}>
                                    <i className={showPassword ? "far fa-eye-slash" : "far fa-eye"}></i>
                                    {/* <i class="far fa-eye-slash"></i> */}
                                </button>
                            </div>
                            <div class="text-center">
                                <button class="org_btn log_btn" onClick={handleLoginClick}>Log in</button>
                                { isLoading && renderLoader()}
                            </div>


                            <div class="Forgot_padd">
                                <a href="/forgot_password">Forgot password?</a>
                            </div>
                            {/* <div class="or_ii">
                                <img src="images/or_ii.png" alt="" />
                            </div> */}
                            {/* <div class="Forgot_padd">
                                <a href="#"><img src="images/fb.png" alt="" /></a>
                            </div> */}
                            {/* <SignInWithFacebook redirectCallBack={redirectCallBack}/> */}
                            <div class="Sign_acc">
                                Don’t have an account? <a href="/personalize">Sign up</a>
                            </div>
                            <div class="astrologer_log">
                                If you’re an astrologer <a href="/astro_login">login here</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login
