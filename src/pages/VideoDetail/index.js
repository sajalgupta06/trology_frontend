import React from 'react';
import VideoDetailComponent from '../../components/VideoDetail'
import { withRouter } from "react-router-dom";

const VideoDetail = ({...props}) => {
  const videoId = props.match.params.videoId;
  return (
    <VideoDetailComponent videoId={videoId}/>
  )
}

export default withRouter(VideoDetail)
