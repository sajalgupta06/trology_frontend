import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../utils/Api";
import { Auth } from "aws-amplify";
import "./styles.scss";
import { useToasts } from 'react-toast-notifications'
var Loader = require('react-loaders').Loader;

const AstroEmbedVideo = () => {
    const { addToast } = useToasts()
    function renderLoader() {
        return <Loader type="line-scale"  color="#EE8265"  />
    }
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({'thumbnail':'', 'status': 2, 'video_type': 1, 'video_url':''});
    const handleChange = async function (event) {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        setValues({ ...values, [name]: val })
    }

    const youtube_parser = (yturl) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = yturl.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    useEffect(() => {
        let video_id = youtube_parser(values.video_url)
        values.thumbnail = `https://i.ytimg.com/vi/${video_id}/default.jpg`
    }, [values]);


    const handleSubmitClick = async function () {
        console.log(values);
        try {
            setIsLoading(true)
            let data = values;
            let result = await apiRequest("POST", `/astro/embed_video`, data)
            if (result) {
                let response = JSON.parse(JSON.parse(result).data)
                console.log("user logged in user data: ", response)
                // history.push("/video_detail"); // TODO: redirect to dashboard page
                addToast('Video uploaded successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                })
            } else {
                addToast('Unable to upload Video.', {
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
    }

    return (
        <div class="wrapper">
            <div>
                <p class="in_tex_title">video_url</p>
                <div class="in_tex">
                    <input type="text" class="form-control" placeholder="Enter your video_url" name="video_url" onChange={handleChange} value={values.video_url} />
                </div>
                <p class="in_tex_title">title</p>
                <div class="in_tex">
                    <input type="text" class="form-control" placeholder="Enter your title" name="title" onChange={handleChange} value={values.title} />
                </div>
                <p class="in_tex_title">description</p>
                <div class="in_tex">
                    <input type="text" class="form-control" placeholder="Enter your description" name="description" onChange={handleChange} value={values.description} />
                </div>
                <p class="in_tex_title">thumbnail</p>
                <div class="in_tex">
                    <input type="text" readOnly class="form-control" placeholder="Enter your thumbnail" name="thumbnail" onChange={handleChange} value={values.thumbnail} />
                </div>
                <p class="in_tex_title">age_range_min</p>
                <div class="in_tex">
                    <input type="text" class="form-control" placeholder="Enter your age_range_min" name="age_range_min" onChange={handleChange} value={values.age_range_min} />
                </div>
                <p class="in_tex_title">age_range_max</p>
                <div class="in_tex">
                    <input type="text" class="form-control" placeholder="Enter your age_range_max" name="age_range_max" onChange={handleChange} value={values.age_range_max} />
                </div>
                <p class="in_tex_title">expiry_date</p>
                <div class="in_tex">
                    <input type="text" class="form-control" placeholder="Enter your expiry_date" name="expiry_date" onChange={handleChange} value={values.expiry_date} />
                </div>
                <p class="in_tex_title">status</p>
                <div class="in_tex">
                    <input type="text" readOnly class="form-control" placeholder="Enter your status" name="status" onChange={handleChange} value={values.status} />
                </div>
                <p class="in_tex_title">video_type</p>
                <div class="in_tex">
                    <input type="text" readOnly class="form-control" placeholder="Enter your video_type" name="video_type" onChange={handleChange} value={values.video_type} />
                </div>

                <div class="text-center">
                    <button class="org_btn log_btn" onClick={handleSubmitClick}>Submit</button>
                    {isLoading && renderLoader()}
                </div>

            </div>
        </div>
    )
}

export default AstroEmbedVideo
