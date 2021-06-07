import React from 'react';
import AstroProfileComponent from '../../components/AstroProfile'
import { withRouter } from "react-router-dom";

const AstroProfile = ({ ...props }) => {
  const astroId = props.match.params.astroId;
  return (
    <AstroProfileComponent astroId={astroId}/>
  )
}

export default withRouter(AstroProfile)
