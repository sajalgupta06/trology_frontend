import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { TooltipItem } from "../Dashboard/toolTip"


const CustomerDashboard = () => {
    const [freeVideos, setFreeVideos] = useState([])
    const [paidVideos, setPaidVideos] = useState([])
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const loadPaidVideos = (event) => {
        apiRequest("GET", `/user/videos/paid/`)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                setPaidVideos(data.result)
                console.log("data", data)
            })
            .catch(err => {
                console.log("error: ", err)
            });
    }

    useEffect(async () => {
        // await apiRequest("GET", `/create_user_feed/`)
        // .then(result => {
        //     // const data = JSON.parse(JSON.parse(result).data);
        //     // setFreeVideos(data.result)
        //     // console.log("data", data)
        // })
        // .catch(err => {
        //     console.log("error: ", err)
        // });


        apiRequest("GET", `/user/videos/free/`)
            .then(result => {
                const data = JSON.parse(JSON.parse(result).data);
                setFreeVideos(data.result)
                console.log("data", data)
            })
            .catch(err => {
                console.log("error: ", err)
            });
    }, [])

    return (
        <div class="wrapper customer_dashboard_comp">

            {/* <!--content start--> */}
            <div class="content_bx">
                <div class="inner_wrapper">
                    <div class="fp_menu">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggle('1'); }}
                                >Free</NavLink>
                            </NavItem>
                            <NavItem onClick={loadPaidVideos}>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}
                                >Paid</NavLink>
                            </NavItem>
                        </Nav>
                        {/* <!-- Nav tabs --> */}
                        {/* <ul class="nav nav-tabs ">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#Free">Free</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#Paid">Paid</a>
                            </li>
                        </ul> */}
                    </div>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <div class="con_i_new">
                                <ul>
                                    {freeVideos.map(v => (
                                        <li>
                                            <div class="vid_bx">
                                                <div class="vid_bx_i">
                                                    <a href={"video_detail/" + v.id}>
                                                        <img src={v.thumbnail} alt="" />
                                                    </a>
                                                    {/* <div class="video_time">5:45</div> */}
                                                </div>
                                                <div class="vid_bx_ii">
                                                    <a href="#">
                                                        <table>
                                                            <tr>
                                                                {/* TODO: get astro image and astro name */}
                                                                <td><img src={v.astro_image || "images/user9.png"} alt="" /></td>
                                                                <td>
                                                                    {/* <h4 class="dev_ellipsis_title">{v.title}</h4> */}
                                                                    <TooltipItem title={v.title} id={v.id} elpsisClassName="dev_ellipsis_title_cust"/>
                                                                    <p>{v.astro_name}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabPane>
                        <TabPane tabId="2">
                            <div class="con_i_new">
                                {paidVideos.length == 0 && <p>Please subscribe to get paid contents</p>}
                                <ul>
                                    {paidVideos.map(v => (

                                        <li>
                                            <div class="vid_bx">
                                                <div class="vid_bx_i">
                                                    <a href={"video_detail/" + v.id}>
                                                        <img src={v.thumbnail} alt="" />
                                                        {/* <div class="video_time">5:45</div> */}
                                                    </a>
                                                </div>
                                                <div class="vid_bx_ii">
                                                    <a href="#">
                                                        <table>
                                                            <tr>
                                                                {/* TODO: get astro image and astro name */}
                                                                <td><img src={v.astro_image || "images/user9.png"} alt="" /></td>
                                                                <td>
                                                                    <h4 class="dev_ellipsis_title">{v.title}</h4>
                                                                    <p>{v.astro_name}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </div>
            {/* <!--content end--> */}
        </div>
    )
}

export default CustomerDashboard
