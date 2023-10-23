import React from "react";
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { logoutSuccess } from "src/redux/action/auth_action";
import { useDispatch } from "react-redux";

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("authorization_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.clear();
    dispatch(logoutSuccess());
    history.push("/login");
  };
  

  return (
    <CDropdown inNav className="c-header-nav-items mx-1" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <FontAwesomeIcon size="xl" icon={faUserCircle} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Setting</strong>
        </CDropdownItem>

        <CDropdownItem>
          <CButton onClick={() => handleLogout()}>
            <FontAwesomeIcon className="mr-2" icon={faDoorOpen} />
            Logout
          </CButton>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
