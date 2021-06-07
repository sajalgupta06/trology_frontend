import React from "react";
import PropTypes from "prop-types";
import { Container, Col, Row } from "reactstrap";
import Hamburger from "../MainNav/Hamburger";
import MainNav from "../MainNav";
import UserNav from "../UserNav";
import HeaderLogo from "../Logo/HeaderLogo";
import "./styles.scss";

const Header = ({ isNavOpen, navHandler }) => {
  return (
    <>
      <header className="app-header">
        <Container className="pl-0 pr-1" fluid>
          <Row>
            <Col xs={12}>
              <div className="app-header__container">
                <div className="d-flex flex-grow-1  align-items-center">
                  <div className="app-header__burger-wrap">
                    <Hamburger status={isNavOpen} clickHandler={navHandler} />
                  </div>
                  <div className="app-header__logo-wrap d-flex d-sm-none d-xl-flex">
                    <HeaderLogo />
                  </div>
                  <div className="app-header__search-wrap d-none d-sm-block">
                    
                  </div>
                </div>
                <div className="d-flex justify-content-end pr-md-4">
                  <div className="d-flex align-items-center">
                    
                  </div>
                  <div className="app-header__user-nav-wrap pr-sm-3 d-none d-sm-block">
                    <UserNav />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} className="d-block d-sm-none mt-2 mobile-view">
              <Row>
                <Col xs={{ size: 10 }}>
                  <div>
                    {/* <HeaderSearch /> */}
                  </div>
                </Col>
                <Col xs={2}>
                  <UserNav />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </header>
      <MainNav status={isNavOpen} />
    </>
  );
};

Header.propTypes = {
  isNavOpen: PropTypes.bool.isRequired,
  navHandler: PropTypes.func.isRequired,
};

export default Header;
