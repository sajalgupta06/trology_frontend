import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";

import MainRoutes from "../Routes/MainRoutes";
import Header from "../Header";
import "./styles.scss";
import { useDispatch } from "react-redux";

const Main = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navToggleHandler = () => {
    setIsNavOpen(!isNavOpen);
  };

  const dispatch = useDispatch();
  useEffect(() => {

    // dispatch(getNotification());
  }, [dispatch]);



  return (
    <div>
      <Header isNavOpen={isNavOpen} navHandler={navToggleHandler} />
      <Container
        className={`main-content px-0 py-4 px-md-4 pt-5 ${
          isNavOpen ? "main-content_nav-open" : ""
        }`}
        fluid
      >
        <MainRoutes />
      </Container>
    </div>
  );
};

export default Main;
