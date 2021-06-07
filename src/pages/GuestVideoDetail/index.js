import React from 'react';
import GuestVideoDetail from '../../components/GuestVideoDetail'
import { withRouter } from "react-router-dom";

const VideoDetail = ({...props}) => {
  const videoId = props.match.params.videoId;
  return (
    <GuestVideoDetail videoId={videoId}/>
  )
}

export default withRouter(VideoDetail)
