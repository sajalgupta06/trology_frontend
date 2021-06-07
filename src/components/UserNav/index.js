import React, { useState, useEffect } from "react";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import { withRouter } from "react-router-dom";
// import Avatar from "../_common/Avatar";
import { Auth } from "aws-amplify";
import * as LocalStore from "../../utils/LocalStore";
import { refreshAuthUser } from "../../utils/AuthUtil";
// import "./styles.scss";
import { logout } from "../../store/reducers/profiles/action";
import { useSelector, useDispatch } from "react-redux";

const UserNav = ({ history }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let { profile, operatorLogin } = useSelector((state) => state);
  profile = profile ? profile.profile : {};
  const profileName = profile.name || "";
  const avatar = profile.username ? profile.username : "";
  
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const dispatch = useDispatch();
  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    // let userDetails = params.get("mock_user");
    // dispatch(setOperatorId(userDetails));
  }, []);
  const logOut = async () => {
    await Auth.signOut();
    LocalStore.clearUser();
    dispatch(logout());
    await refreshAuthUser(true);
    history.push("/login");
    window.location.reload();
  };
  const onCLickAccount = async () => {
    history.push("/account");
  };

  const onClick = async () => {};
  const getDropdownMenuItems = () => {
    //console.log(profile);
    if (profile.role === "IPU-Admin") {
      return (
        <DropdownMenu right>
          <DropdownItem>Account</DropdownItem>
          <DropdownItem
            onClick={(e) => {
              window.open("/operatorlogin");
            }}
          >
            Login as Operator
          </DropdownItem>
          <DropdownItem onClick={logOut}>LogOut</DropdownItem>
        </DropdownMenu>
      );
    }
    return (
      <DropdownMenu right>
        <DropdownItem onClick={onCLickAccount}>Account</DropdownItem>
        <DropdownItem onClick={logOut}>LogOut</DropdownItem>
      </DropdownMenu>
    );
  };
  return (
    <UncontrolledDropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className="user-nav"
    >
      <DropdownToggle className="pr-2 pr-md-4">
        <div className="mr-2 mr-lg-3">
          {/* <Avatar name={avatar} size="md" onClick={onClick} /> */}
        </div>
        <p className="d-none d-md-block">{profileName}</p>
      </DropdownToggle>
      {getDropdownMenuItems()}
    </UncontrolledDropdown>
  );
};

export default withRouter(UserNav);
