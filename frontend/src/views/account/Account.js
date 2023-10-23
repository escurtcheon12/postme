import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CForm,
  CLabel,
  CSelect,
  CBadge,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faFileExport,
  faSearch,
  faFilter,
  faPencil,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/users.css";
import axios from "axios";
import { CSVLink } from "react-csv";
import { ToastContainer } from "react-toastify";
import {
  ToastDataDeleteFailed,
  ToastDataDeleteSuccess,
  ToastDataUpdateFailed,
  ToastDataUpdateSuccess,
} from "../components/toastify";
import { onInputChange } from "../components/utils";
import utils from "src/shared/utils";

let headers = [
  { label: "Username", key: "username" },
  { label: "Email", key: "email" },
  { label: "Password", key: "password" },
  { label: "Status", key: "status" },
  { label: "Interval", key: "interval" },
  { label: "Forgot Token", key: "forgot_token" },
  { label: "Tanggal di buat", key: "createdAt" },
];

const fields = [
  "No",
  "username",
  "email",
  "password",
  "status",
  "interval",
  "forgot_token",
  "diBuat",
  "action",
];

const getBadge = (status) => {
  switch (status) {
    case 1:
      return "success";
    default:
      return "dark";
  }
};

const Account = () => {
  let isMounted = true;
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataItem, setDataItem] = useState({
    id: 0,
    username: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    const getUserList = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_BE_URL_PORT}/web/user/list?sort=${sort}&search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authorization_token") || ""
              }`,
            },
          }
        )
        .then((res) => {
          if (isMounted) {
            setData(res.data.data);
          }
        })
        .catch((err) => console.log("err", err));
    };
    // (async () => {
    getUserList();
    // })();

    return () => {
      // setData([]);
      isMounted = false;
    };
  }, [sort, statusSearch, deleteData]);

  const searchFilter = () => {
    setStatusSearch(!statusSearch);
  };

  const alphabetFilter = () => {
    const validationSort = sort === "ASC" ? "DESC" : "ASC";

    setSort(validationSort);
  };

  const openModalEdit = (item) => {
    setDataItem({
      id: item.id,
      username: item.username,
      email: item.email,
      status: item.status,
    });
    setModalEdit(true);
  };

  const editUsers = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/user/update`,
        {
          id,
          username: dataItem.username,
          email: dataItem.email,
          status: dataItem.status,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("authorization_token") || ""
            }`,
          },
        }
      )
      .then((res) => {
        ToastDataUpdateSuccess();
        setDeleteData(!deleteData);
        setModalEdit(false);
      })
      .catch((err) => {
        ToastDataUpdateFailed(err.response.data.message);
        console.log("err", err);
      });
  };

  const deleteUsers = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/user/delete`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("authorization_token") || ""
            }`,
          },
        }
      )
      .then((res) => {
        ToastDataDeleteSuccess();
        setDeleteData(!deleteData);
      })
      .catch((err) => {
        ToastDataDeleteFailed(err.response.data.message);
        console.log("err", err);
      });
  };

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <ToastContainer />

            <CModal show={modalEdit} onClose={setModalEdit}>
              <CModalHeader closeButton>
                <CModalTitle>Edit Users</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div>
                    <CLabel htmlFor="username">Username :</CLabel>
                    <CInput
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "username")
                      }
                      value={dataItem.username}
                      placeholder="Isi username"
                      name="username"
                      type="text"
                      minLength="3"
                      maxLength="20"
                    />
                  </div>

                  <div className="mt-3">
                    <CLabel htmlFor="email">Email :</CLabel>
                    <CInput
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "email")
                      }
                      value={dataItem.email}
                      placeholder="Isi email"
                      name="email"
                      type="email"
                      minLength="3"
                      maxLength="20"
                    />
                  </div>

                  <div className="mt-3">
                    <CLabel htmlFor="status">Status :</CLabel>

                    <CSelect
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "status")
                      }
                      value={dataItem.status}
                      custom
                      name="status"
                      id="status"
                    >
                      <option value="0">Nonactive</option>
                      <option value="1">Active</option>
                    </CSelect>
                  </div>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="button-edit-users"
                  onClick={() => editUsers(dataItem.id)}
                >
                  <FontAwesomeIcon className="mr-2" icon={faSave} />
                  Save
                </CButton>
                <CButton color="danger" onClick={() => setModalEdit(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>

            <CCardHeader>Tabel User</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex">
                  <CInput
                    onChange={(e) => setSearch(e.target.value)}
                    labels="Search"
                    type="text"
                    placeholder="Search"
                  />
                  <CButton
                    onClick={() => searchFilter()}
                    className="button-search-users"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <div className="d-flex">
                  <CSVLink
                    filename="list-users-postme"
                    className="text-white"
                    data={data}
                    headers={headers}
                  >
                    <CButton className="button-csv-users">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </CSVLink>
                  <CButton
                    className="button-filter-users ml-2"
                    onClick={() => alphabetFilter()}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </CButton>
                </div>
              </div>
              <CDataTable
                items={data}
                fields={fields}
                itemsPerPage={5}
                pagination
                scopedSlots={{
                  No: (item, index) => (
                    <td>
                      <p>{index + 1}</p>
                    </td>
                  ),
                  username: (item) => (
                    <td>
                      <p>{item.username}</p>
                    </td>
                  ),
                  email: (item) => (
                    <td>
                      <div className="input-email-users">
                        <p>{item.email}</p>
                      </div>
                    </td>
                  ),
                  password: (item) => (
                    <td>
                      <div className="input-password-users">
                        <p>{item.password}</p>
                      </div>
                    </td>
                  ),
                  status: (item) => (
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status ? "Active" : "Nonactive"}
                      </CBadge>
                    </td>
                  ),
                  forgot_token: (item) => (
                    <td>
                      <p>{item.forgot_token}</p>
                    </td>
                  ),
                  diBuat: (item) => {
                    return (
                      <td>
                        <p>{utils.convertIndonesiaTime(item.createdAt)}</p>
                      </td>
                    );
                  },
                  action: (item) => (
                    <td>
                      <div className="action-input-users">
                        <CButton
                          onClick={() => openModalEdit(item)}
                          className="button-edit-users"
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </CButton>
                        <CButton
                          onClick={() => deleteUsers(item.id)}
                          className="ml-1"
                          color="danger"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </CButton>
                      </div>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Account;
