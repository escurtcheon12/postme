import React, { useEffect, useState } from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { fetchFirstData } from "src/views/components/utils";
import "../assets/css/dashboard.css";
import axios from "axios";
import { ToastDataSaveFailed } from "src/views/components/toastify";
import { useSelector } from "react-redux";
import { convertIndonesiaTime } from "src/shared/utils";

const TheHeaderDropdownNotif = () => {
  const globalState = useSelector((state) => state);
  const user_role = localStorage.getItem("user_role");
  const [dataNotif, setDataNotif] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [statusRead, setStatusRead] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data_notifications = fetchFirstData(
          `${
            process.env.REACT_APP_BE_URL_PORT
          }/web/notifications/list?status_admin=${
            user_role === "admin" ? 1 : 0
          }&sort=DESC`
        );
        const data_count = fetchFirstData(
          `${
            process.env.REACT_APP_BE_URL_PORT
          }/web/notifications/count?status_admin=${
            user_role === "admin" ? 1 : 0
          }`
        );

        const fetch_data = await Promise.all([data_notifications, data_count]);
        fetch_data.forEach((item, index) => {
          if (index == 0) {
            setDataNotif(item.data.data);
          } else if (index == 1) {
            setItemCount(item.data.data.total);
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [itemCount, statusRead, globalState.notif_reducer]);

  const showBellNotifCount = () => {
    if (itemCount) {
      return (
        <CBadge shape="pill" color="danger">
          {itemCount}
        </CBadge>
      );
    }
  };

  const handleReadNotifications = async () => {
    if (user_role === "admin") {
      await axios
        .post(
          `${process.env.REACT_APP_BE_URL_PORT}/web/notifications/read-all-admin`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authorization_token") || ""
              }`,
            },
          }
        )
        .catch((err) => {
          ToastDataSaveFailed(err.response.data.message);
          console.log(err);
        });
    } else {
      await axios
        .post(
          `${process.env.REACT_APP_BE_URL_PORT}/web/notifications/read-all`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authorization_token") || ""
              }`,
            },
          }
        )
        .catch((err) => {
          ToastDataSaveFailed(err.response.data.message);
          console.log(err);
        });
    }

    setStatusRead(!statusRead);
  };

  return (
    <CDropdown
      onClick={() => handleReadNotifications()}
      inNav
      className="c-header-nav-item mx-2 "
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell" />
        {showBellNotifCount()}
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownItem header tag="div" color="light">
          <strong>NOTIFICATIONS</strong>
        </CDropdownItem>
        <div className="overflow-auto container-notification-list">
          {(dataNotif || []).map((item, index) => {
            return (
              <CDropdownItem className={`d-block custom-dropdown-item ${isHovered ? 'custom-dropdown-item-hover' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
                <div className="text-uppercase mb-1">
                  <small>
                    <b>{item.title}</b>
                  </small>
                </div>
                <small>
                  <p>{item.message}</p>
                </small>

                <small className="text-muted">
                  {convertIndonesiaTime(item.createdAt)}
                </small>
              </CDropdownItem>
            );
          })}
        </div>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdownNotif;
