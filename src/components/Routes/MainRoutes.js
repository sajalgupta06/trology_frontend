import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import { Spinner } from "reactstrap";

import CustomerDashboard from "../../pages/CustomerDashboard"
import CustomerProfile from "../../pages/CustomerProfile"

import VideoDetail from "../../pages/VideoDetail"
import AstroProfile from "../../pages/AstroProfile"
import PrivacyPolicy from "../../pages/PrivacyPolicy"
import { authState, refreshAuthUser } from "../../utils/AuthUtil";
import { getProfile } from "../../store/reducers/profiles/action";
import Horoscope from "../../pages/Horoscope"
import { connect } from "react-redux";


import AstroEmbedVideo from "../../pages/AstroEmbedVideo"
import AstroDashboard from "../../pages/AstroDashboard"
import CreateOffer from "../../pages/CreateOffer"

import AdminDashboard from "../../pages/AdminDashboard"

class MainRoutes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  setLoading = (value) => {
    this.setState({
      loading: value,
    });
  };

  fetchUserData = async () => {
    try {
      this.setLoading(true);
      let user = await refreshAuthUser(true);
      this.setLoading(false);
      if (!user) {
        this.props.history.push("/login");  
      }
    } catch (err) {
      this.props.history.push("/login");
    }
  };

  componentDidMount() {
    this.fetchUserData();
    this.props.getProfile();
  }
  render() {
    const { loading } = this.props;
    return (
      <LoadingOverlay active={loading} spinner={<Spinner color="light" />}>
        <Switch>
          <Route path="/privacy_policy" component={PrivacyPolicy} />
          <Route path="/astro_profile/:astroId" component={AstroProfile} />
          <Route path="/video_detail/:videoId" component={VideoDetail} />
          <Route path="/customer_dashboard" component={CustomerDashboard} />
          <Route path="/customer_profile" component={CustomerProfile} />

          {/* TODO: Move astrologer related routes to new Routes */}
          <Route path="/horoscope" component={Horoscope} />
          <Route path="/astro_embed_video" component={AstroEmbedVideo} />
          <Redirect from="/astro_dashboard_temp" to='/astro_dashboard'/>
          <Route path="/astro_dashboard" component={AstroDashboard} />
          <Route path="/create_offer" component={CreateOffer} />
          <Route path="/admin_dashboard" component={AdminDashboard} />
          <Route path="/" render={() => <Redirect to="/customer_dashboard" />} />
          
        </Switch>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => ({
  operator: state.operatorLogin,
});
export default withRouter(
  connect(mapStateToProps, { getProfile })(MainRoutes)
);
