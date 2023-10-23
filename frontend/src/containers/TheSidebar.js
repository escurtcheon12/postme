import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";

// import CIcon from '@coreui/icons-react'
import "../assets/css/sidebar.css";
// sidebar nav config

import { nav_admin, nav_user } from "./_nav";
// import navigationUser from "./_navUser";
// import navigationAdmin from "./_navAdmin";

const TheSidebar = () => {
  const user_role = localStorage.getItem("user_role");
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      className="sidebar"
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className=" d-md-down-none" to="/">
        <div className="logo-sidebar"></div>
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          className="link-sidebar"
          items={user_role === "admin" ? nav_admin : nav_user}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
