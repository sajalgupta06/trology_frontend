import React, { useState, useEffect } from 'react'
import { Container } from "reactstrap";
import { useHistory } from "react-router";
import Header from "../AppHeader";
import { authState, refreshAuthUser } from "../../utils/AuthUtil";
import { AstroHeader } from "../AppHeader/AstroHeader";
import MainRoutes from "../Routes/MainRoutes";

const MainContainer = (props) => {
  const history = useHistory();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isAstrouser, setIsAstrouser] = useState(true);
  const [isAdminuser, setIsAdminuser] = useState(true);
  useEffect(async () => {
    try {
      let user = await refreshAuthUser(true);
      console.log('===============user', user.attributes['custom:userType'])
      setIsAstrouser(user.attributes['custom:userType'] == 3) 
      setIsAdminuser(user.attributes['custom:userType'] == 1) 
    } catch (error) {
      history.push("/dashboard");
    }
    // console.log('===============user', user.attributes['custom:userType'])
}, [])
  const navToggleHandler = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <>
      {(!isAstrouser && !isAdminuser )&& <>
      <Header isNavOpen={isNavOpen} navHandler={navToggleHandler} />
      <Container>
        <MainRoutes /> 
      </Container></>}
      {(isAstrouser || isAdminuser) && <MainRoutes />}
    </>
  )
}
export default MainContainer