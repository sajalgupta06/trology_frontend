import React, { useState } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import LogRocket from "logrocket";
import { useHistory } from "react-router";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
var Loader = require('react-loaders').Loader;


const AstroSignupSuccess = () => {
    const { addToast } = useToasts()
    function renderLoader() {
        return <Loader type="line-scale" color="#EE8265" />
    }
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [values, setValues] = useState({ email: '', password: '' })
    const toggleShowPassword = (prevShowPassword) => setShowPassword(!prevShowPassword)

    const handleToggleShowPassword = async function () {
        console.log('toggle eye')
        toggleShowPassword(showPassword)
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
            console.log("login successs", user)
            // let logrocketOptions = {
            //     name: user.username,
            //     email: user.attributes.email,
            //     type: user.attributes['custom:userType']
            // };
            // LogRocket.identify(user.username, logrocketOptions);
            let result = await apiRequest("GET", `/user/profile`)
            setIsLoading(false)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("user logged in user data: ", response)
                history.push("/video_detail"); // TODO: redirect to dashboard page
                addToast('Login Success', {
                    appearance: 'success',
                    autoDismiss: true,
                })
            } else {
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
    return (
        <div class="wrapper astro_signup_success_comp">
            {/* <!--header start--> */}
            <header class="sticky">
                <div class="inner_wrapper">
                    <div class="hed_left_tw">
                        <a class="birth_logo" href="/"><img src="images/logo.png" alt="" /></a>
                        {/* <!--mobile & tab view--> */}
                        {/* <!--a class="close_btn" href="#"><img src="images/close.png" alt="" /> <span>Birth Details</span></a--> */}
                        <a class="close_btn newlomm" href="/"><img src="images/logo.png" alt="" /></a>

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
                        <div class="login_wite_i ss_mobile">
                            <div class="successfully_icon">
                                <img src="images/success.png" alt="" />
                            </div>
                            <h5>Someone from our team will reach<br /> out to you shortly.</h5>
                            <p>The form has been submitted successfully!</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        // <!--content end-- >
    )
}

export default AstroSignupSuccess
