import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../../pages/LandingPage"
import Login from "../../pages/Login"
import ForgotPassword from "../../pages/ForgotPassword"
import AstroSignup from "../../pages/AstroSignup"
import AstroLogin from "../../pages/AstroLogin"
import AstroSignupSuccess from "../../pages/AstroSignupSuccess"
import Personalize from "../../pages/Personalize"
import QueryBuilder from '../../pages/QueryBuilder/demo/demo'
import AdminLogin from "../../pages/AdminLogin"
import GuestVideoDetail from "../../pages/GuestVideoDetail"

import Main from "../Main";
import MainContainer from '../MainContainer'

const AuthRoutes = () => {
  return (
    <Switch>
      <Route path="/astro_signup" component={AstroSignup} />
      <Route path="/astro_signup_success" component={AstroSignupSuccess} />
      <Route path="/astro_login" component={AstroLogin} />
      <Route path="/forgot_password" component={ForgotPassword} />
      <Route path="/login" component={Login} />
      <Route path="/personalize" component={Personalize} />
      <Route path="/query_builder" component={QueryBuilder} />
      <Route path="/admin_login" component={AdminLogin} />
      <Route path="/guest_video_detail/:videoId" component={GuestVideoDetail} />
      
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/" component={() => <MainContainer />} />
      
    </Switch>
  );
};

export default AuthRoutes;
