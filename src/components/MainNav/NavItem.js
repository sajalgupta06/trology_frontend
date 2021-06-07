import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import LeftmenuIcon from "../_common/LeftmenuIcon";

const isDisableDefault = async () => false;

const NavItem = ({ showTooltip, title, icon, link, isActive = false,  isDisable = isDisableDefault }) => {
  const [disabled, setDisabled] = useState(true);

  async function resolveDisabled() {
    const disabledValue = await isDisable();

    setDisabled(disabledValue);
  }
  useEffect(() => {
    resolveDisabled();
  }, disabled);

  return (
    !disabled ? 
    <Link
      to={link}
      className={`main-nav_list-item ${
        isActive ? "main-nav_list-item_active" : ""
      }`}
    >
      {/*<i className='material-icons'>dashboard</i>*/}
      {/* <LeftmenuIcon
        name={icon}
        isActive={isActive}
        showTooltip={showTooltip}
        title={title}
      /> */}
      <h6>{title}</h6>
    </Link>
    : <span className={`main-nav_list-item main-nav_list-item_disabled`}>
      {/* <LeftmenuIcon
        name={icon}
        isActive={isActive || disabled}
        showTooltip={showTooltip}
        title={title}
      /> */}
      <h6>{title}</h6>
    </span>
  
  );
};

NavItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default NavItem;
