import React, { useEffect, useState } from 'react';
import { apiRequest } from "../../utils/Api";
import "./styles.scss";

const Horoscope = () => {
    const [horoscopeDetail, setHoroscopeDetail] = useState({})
    useEffect(() => {
        // apiRequest("GET", `/create_user_feed/`)
        //     .then(result => {
        //         console.log('=============================result', JSON.parse(result))
        //         // let data = JSON.parse(result).data
        //         // setHoroscopeDetail(JSON.parse(data).result)
        //     })
        //     .catch(err => {
        //         console.log("error: ", err)
        //     });
        apiRequest("GET", `/getHoroscope/`)
            .then(result => {
                console.log('=============================result', JSON.parse(result))
                let data = JSON.parse(result).data
                setHoroscopeDetail(JSON.parse(data).result)
            })
            .catch(err => {
                console.log("error: ", err)
            });
        // apiRequest("POST", `/horoscope`)
        //     .then(result => {
        //         console.log('=============================result', JSON.parse(result))
        //     })
        //     .catch(err => {
        //         console.log("error: ", err)
        //     });
    }, [])
    return (
        <div class="wrapper horoscope_comp">
        

        {/* <!--content start--> */}
        <div class="content_bx">

            <div class="inner_wrapper">
                <div class="horo_box">
                    <div class="hb_title">
                        <div class="gray_line"></div>
                        <h4>Basic Details</h4>
                    </div>

                    <div class="horo_i">
                        <div class="horo_i_left">
                            <div class="hb_subtitle">
                                <h5>Basic Details</h5>
                                <p><img src="images/design1.png" alt="" /></p>
                            </div>

                            <div class="hil_a">
                                <table>
                                    <tr>
                                        <td>Date of birth </td>
                                        <td>{horoscopeDetail && horoscopeDetail.date_of_birth}</td>
                                    </tr>
                                    <tr>
                                        <td>Time of birth</td>
                                        <td>{horoscopeDetail.time_of_birth}</td>
                                    </tr>
                                    <tr>
                                        <td>Place of birth</td>
                                        <td>{horoscopeDetail.place_of_birth}</td>
                                    </tr>
                                    <tr>
                                        <td>Latitude</td>
                                        <td> {horoscopeDetail.latitude}</td>
                                    </tr>
                                    <tr>
                                        <td>Longitude </td>
                                        <td>{horoscopeDetail.latitude}</td>
                                    </tr>
                                    <tr>
                                        <td>Timezone</td>
                                        <td>GMT { `${horoscopeDetail.timezone ? horoscopeDetail.timezone < 0 ? horoscopeDetail.timezone : `+${horoscopeDetail.timezone}` : '+5.5' }`} </td>
                                    </tr>
                                    {/* <tr>
                                        <td>Ayanamsha </td>
                                        <td>{horoscopeDetail.ayanamasha}</td>
                                    </tr>
                                    <tr>
                                        <td>Sunrise </td>
                                        <td>{horoscopeDetail.sunrise}</td>
                                    </tr>
                                    <tr>
                                        <td>Sunset </td>
                                        <td>{horoscopeDetail.sunset}</td>
                                    </tr> */}
                                </table>
                            </div>

                            <div class="hb_subtitle">
                                <h5>Ghat Chakra</h5>
                                <p><img src="images/design1.png" alt="" /> </p>
                            </div>

                            <div class="hil_a">
                                <table>
                                    {/* <tr>
                                        <td>Month </td>
                                        <td>{horoscopeDetail.month}</td>
                                    </tr> */}
                                    <tr>
                                        <td>Tithi </td>
                                        <td>{horoscopeDetail.tithi}</td>
                                    </tr>
                                    {/* <tr>
                                        <td> Day </td>
                                        <td>{horoscopeDetail.day}</td>
                                    </tr> */}
                                    <tr>
                                        <td> Nakshatra </td>
                                        <td>{horoscopeDetail.nakshatra}</td>
                                    </tr>
                                    <tr>
                                        <td> Yog </td>
                                        <td>{horoscopeDetail.yog}</td>
                                    </tr>
                                    <tr>
                                        <td>Karan </td>
                                        <td>{horoscopeDetail.karan}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>Prahar </td>
                                        <td>{horoscopeDetail.prahar}</td>
                                    </tr>
                                    <tr>
                                        <td> Moon </td>
                                        <td>{horoscopeDetail.moon}</td>
                                    </tr> */}

                                </table>
                            </div>


                        </div>
                        <div class="horo_i_right">
                            <div class="hb_subtitle">
                                <h5>Panchang Details</h5>
                                <p><img src="images/design1.png" alt="" /> </p>
                            </div>

                            <div class="hil_a">
                                <table>
                                    <tr>
                                        <td>Tithi </td>
                                        <td>{horoscopeDetail.tithi}</td>
                                    </tr>
                                    <tr>
                                        <td>Yog </td>
                                        <td>{horoscopeDetail.yog}</td>
                                    </tr>
                                    <tr>
                                        <td>Nakshatra </td>
                                        <td>{horoscopeDetail.nakshatra}</td>
                                    </tr>
                                    <tr>
                                        <td>Karan</td>
                                        <td> {horoscopeDetail.karan}</td>
                                    </tr>

                                </table>
                            </div>

                            <div class="hb_subtitle">
                                <h5>Astro Details</h5>
                                <p><img src="images/design1.png" alt="" /> </p>
                            </div>

                            <div class="hil_a">
                                <table>
                                    <tr>
                                        <td>Varna</td>
                                        <td>{horoscopeDetail.varna}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>Vashya </td>
                                        <td>{horoscopeDetail.Vashya}</td>
                                    </tr> */}
                                    <tr>
                                        <td>Yoni </td>
                                        <td> {horoscopeDetail.yoni}</td>
                                    </tr>
                                    <tr>
                                        <td>Gan </td>
                                        <td>{horoscopeDetail.gan}</td>
                                    </tr>
                                    <tr>
                                        <td>Nadi </td>
                                        <td>{horoscopeDetail.nadi}</td>
                                    </tr>
                                    <tr>
                                        <td>Sign </td>
                                        <td>{horoscopeDetail.sign}</td>
                                    </tr>
                                    <tr>
                                        <td>Sign Lord </td>
                                        <td> {horoscopeDetail.sign_lord}</td>
                                    </tr>
                                    <tr>
                                        <td>Nakshatra</td>
                                        <td> {horoscopeDetail.nakshatra}</td>
                                    </tr>
                                    <tr>
                                        <td>Nakshatra Lord </td>
                                        <td> {horoscopeDetail.nakshatra_lord}</td>
                                    </tr>
                                    <tr>
                                        <td>Charan </td>
                                        <td>{horoscopeDetail.charan}</td>
                                    </tr>
                                    <tr>
                                        <td>Yunja </td>
                                        <td>{horoscopeDetail.yunja}</td>
                                    </tr>
                                    <tr>
                                        <td>Tatva </td>
                                        <td> {horoscopeDetail.tatva}</td>
                                    </tr>
                                    <tr>
                                        <td>Name Alphabet </td>
                                        <td> {horoscopeDetail.name_alphabet}</td>
                                    </tr>
                                    <tr>
                                        <td>Paya </td>
                                        <td>{horoscopeDetail.paya}</td>
                                    </tr>
                                    <tr>
                                        <td>Ascendant </td>
                                        <td>{horoscopeDetail.ascendant}</td>
                                    </tr>
                                    <tr>
                                        <td>Ascendant Lord </td>
                                        <td> {horoscopeDetail.ascendant_lord}</td>
                                    </tr>


                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="horo_ii">
                        <div class="hb_title">
                            <div class="gray_line"></div>
                            <h4>Horoscope Charts</h4>
                        </div>

                        <div class="horo_iii">
                            <div class="horo_iii_left">
                                <div class="hb_subtitle">
                                    <h5>Lagna Chart (Birth Chart)</h5>
                                </div>
                                <div class="chart_bx"><img className="chart_box" src={horoscopeDetail.birthChartUrl} alt="" /></div>
                                {/* <div class="chart_bx"><img src={test} alt="" /></div> */}
                            </div>
                            <div class="horo_iii_right">
                                <div class="hiiir_bx">
                                    <p>Ascendant or Lagna, is the degree of the sign which is rising on the eastern horizon at the time of birth. The Lagna is the most influential and important sign within the natal or lagna chart. This sign will be considered the first house of the horoscope, and the enumeration of the other houses follows in sequence through the rest of the signs of the zodiac. In this way, the Lagna does not only delineate the rising sign, but also all the other houses in the chart.</p>
                                </div>
                            </div>
                        </div>

                        <div class="horo_iv">
                            <div class="horo_iv_left">

                                <div class="chart_bx"><img className="chart_box" src={horoscopeDetail.moonChartUrl} alt="" /></div>
                                {/* <div class="chart_bx"><img src={test1} alt="" /></div> */}
                                <div class="hb_subtitle">
                                    <h5>Moon Chart</h5>
                                </div>
                                <div class="hiiir_bx">
                                    <p>Moon Chart is an important tool of prediction and the results of planetary combinations are more prominent when the yogas or certain combinations happen in both Moon and Lagna Chart.</p>
                                </div>

                            </div>
                            <div class="horo_iv_right">
                                <div class="chart_bx"><img className="chart_box" src={horoscopeDetail.navamanshaChartUrl} alt="" /></div>
                                {/* <div class="chart_bx"><img src={test2} alt="" /></div> */}
                                <div class="hb_subtitle">
                                    <h5>Navmansha Chart</h5>
                                </div>
                                <div class="hiiir_bx">
                                    <p>Navmansha Chart is the most important divisional chart, Navmansha means nine part of a particular Rashi in which each Amsa consists of 3 degrees and 20 minutes.</p>
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
    
export default Horoscope
      