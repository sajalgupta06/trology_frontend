import React from "react";
import PropTypes from "prop-types";

import "./styles.scss";

const Hamburger = ({ status, clickHandler }) => {
  return (
    <button
      className={`btn hamburger ${status ? "hamburger_open" : ""}`}
      onClick={clickHandler}
    >
      <i className="material-icons">menu</i>
      <i className="material-icons hamburger_arrow">chevron_right</i>
    </button>
  );
};

Hamburger.propTypes = {
  status: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

export default Hamburger;
