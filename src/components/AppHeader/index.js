import React, { useState, useEffect, useRef } from 'react'
import { Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import * as LocalStore from "../../utils/LocalStore";
import { logout } from "../../store/reducers/profiles/action";
import { refreshAuthUser } from "../../utils/AuthUtil";
import { useLocation } from 'react-router-dom';


const AppHeader = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logOut = async () => {
        await Auth.signOut();
        LocalStore.clearUser();
        dispatch(logout());
        await refreshAuthUser(true);
        history.push("/login");
        window.location.reload();
    };
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navRef = useRef();
    const handleNav = function () {
        setIsNavOpen(!isNavOpen)
    }
    const handleClickOutside = e => {
        if (!navRef?.current?.contains(e.target)) {
            setIsNavOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });

    const state = useSelector(
        (state) => state
    );

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState();
    useEffect(() => {
        var profile = state.profile.profile[0]
        if (!profile) return
        setFullName(profile.first_name + " " + profile.last_name)
        Auth.currentUserInfo().then((user) => {
            setEmail(user.attributes.email)
            setGender(state.profile.profile[0].gender)
        })
    }, [state]);

    const location = useLocation();
    const [showDropPic, setShowDropPic] = useState(true);

    useEffect(() => {
        if (location.pathname === '/customer_profile') {
            setShowDropPic(false)
        } else {
            setShowDropPic(true)
        }
    }, [location.pathname]);

    return (
        <>
            {/* <!--header start--> */}
            <header class="sticky">
                <div class="inner_wrapper">
                    <div class="hed_left">
                        <a href="/"><img src="/images/logo.png" alt="" /></a>
                    </div>

                    {showDropPic &&
                        <div ref={navRef} class="drop_pic">
                            <button onClick={handleNav} class="drop_pic_btn" data-toggle="collapse" data-target="#user_pro">
                                <table>
                                    <tr>
                                        {gender && <td><img class="user8_bx" src={`${gender == 1 ? '/images/male.png' : '/images/female.png'}`} alt="" /> </td>}
                                        <td><img class="arrow_ro" src="/images/arrow.png" alt="" /> </td>
                                    </tr>
                                </table>

                            </button>

                            <div id="user_pro" className={`user_pro_box ${isNavOpen ? '' : 'collapse'}`}>
                                <div class="edit_pro">
                                    <table>
                                        <tr>
                                            <td><img class="user8_bx" src={`${gender == 1 ? '/images/male.png' : '/images/female.png'}`} alt="" /></td>
                                            <td>
                                                <h5>{fullName}</h5>
                                                <p class="dev_ellipsis_email">{email}</p>
                                                <a href="/customer_profile">Edit Profile</a>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                {/* <!-- mobile--> */}
                                <div class="edit_pro_mobile">
                                    Account <a data-toggle="collapse" data-target="#user_pro" href="#" onClick={handleNav}><img src="/images/close.png" alt="" /></a>
                                </div>
                                {/* <!-- mobile--> */}

                                <div class="pro_menu">
                                    <ul>
                                        {/* <!-- mobile--> */}
                                        <li class="Profile_mobile"><a href="/customer_profile">My Profile <img class="arrow_ro" src="/images/arwoRight.png" alt="" /></a></li>
                                        {/* <!-- mobile--> */}

                                        <li><a href="/horoscope">Horoscope <img class="arrow_ro" src="/images/arwoRight.png" alt="" /></a></li>
                                        <li><a href="#">About us <img class="arrow_ro" src="/images/arwoRight.png" alt="" /></a></li>
                                        <li><a href="#">Refer us <img class="arrow_ro" src="/images/arwoRight.png" alt="" /></a></li>
                                        <li><a href="#">Contact us <img class="arrow_ro" src="/images/arwoRight.png" alt="" /></a></li>
                                        <li><a href="/privacy_policy">Privacy Policy <img class="arrow_ro" src="/images/arwoRight.png" alt="" /></a></li>
                                        <li onClick={logOut} class="Log_im"><a href="#"><img class="logout" src="/images/logout.png" alt="" /> Log out </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </header>
            {/* <!--header end--> */}
        </>
    )
}
export default AppHeader