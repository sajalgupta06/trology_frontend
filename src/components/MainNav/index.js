import React ,{useEffect, useState} from "react";
import { useSelector} from "react-redux";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { Row, Col } from "reactstrap";

import NavItem from "./NavItem";
import "./styles.scss";


const MainNav = ({ status, history, location: { pathname } }) => {
  
  
  const node = (
    <div className={`main-nav ${status ? "main-nav_open" : ""}`}>
     
      <Row className="main-nav_bottom-block">
        <Col xs={12}>
      
        </Col>
        <Col xs={12}>
          <Row className="main-nav__powered-block">
            <Col className='px-0'>
              <img
                  style={{width: '80%'}}
                  src="../logo_black.png"
                  alt=""
                />
              
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
  return (
    <>
      {window.innerWidth < 768
        ? ReactDOM.createPortal(node, document.querySelector("body"))
        : node}
    </>
  );
};

MainNav.propTypes = {
  status: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(MainNav);
