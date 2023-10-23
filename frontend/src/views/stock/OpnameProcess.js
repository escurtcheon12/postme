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
  faBarsProgress,
  faEye,
  faCheck,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/opname.css";
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
import { useLocation, useHistory } from "react-router-dom";

let headers = [
  { label: "Nama Produk", key: "product_name" },
  { label: "Unit", key: "unit_name" },
  { label: "Stok Sistem", key: "stock_now" },
  { label: "Stok Fisik", key: "stock_physique" },
  { label: "Selisih", key: "deviation" },
  { label: "Deskripsi", key: "description" },
  { label: "Tanggal di Buat", key: "createdAt" },
];

const fields = [
  "no",
  "namaProduk",
  "unit",
  "stokSistem",
  "stokFisik",
  "selisih",
  "description",
  "action",
];

const OpnameProcess = () => {
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [updateData, setUpdateData] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  let status_open = location.state ? location.state.data[0].status_edit : 0;
  let opname_id = location.state ? location.state.data[0].opname_id : 0;

  useEffect(() => {
    let data_opname = {};
    if (location.state) {
      data_opname = location.state.data[0] || {};
    }

    if (Object.keys(data_opname).length == 0) {
      history.push("/stok/opname");
    }

    (async () => {
      await axios
        .post(
          `${process.env.REACT_APP_BE_URL_PORT}/web/stock-opnames/list-by-opname-detail?sort=${sort}&search=${search}`,
          { id: data_opname.opname_id },
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authorization_token") || ""
              }`,
            },
          }
        )
        .then((res) => {
          setData(res.data.data);
        })
        .catch((err) => console.log("err", err));
    })();

    // if (updateData) {
    //   // Redirect to "/stok/opname" after a short delay (e.g., 100ms)
    //   // setUpdateData(false);
    //   const redirectTimeout = setTimeout(() => {
    //     history.push("/stok/opname");
    //   }, 100);

    //   return () => {
    //     // Clean up the timeout if the component unmounts before the redirect
    //     clearTimeout(redirectTimeout);
    //   };
    // }
  }, [sort, statusSearch, deleteData, updateData, history]);

  const searchFilter = () => {
    setStatusSearch(!statusSearch);
  };

  const alphabetFilter = () => {
    const validationSort = sort === "ASC" ? "DESC" : "ASC";

    setSort(validationSort);
  };

  const redirectProsesOpname = async (data, status) => {
    if (status === "add") {
      history.push({
        pathname: "/stok/form-proses-opname",
        state: {
          data,
        },
      });
    } else {
      history.push({
        pathname: "/stok/form-proses-opname",
        state: {
          data,
        },
      });
    }
  };

  const updateStatusOpname = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/opnames/update`,
        { id: opname_id, status: "1" },
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
        window.location.reload();
        setUpdateData(true);
      })
      .catch((err) => {
        ToastDataDeleteFailed(err.response.data.message);
        console.log(err);
      });
  };

  const deleteOpname = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/stock-opnames/delete`,
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

        if (data.length == 1) {
          history.push("/stok/opname");
        }
        setDeleteData(!deleteData);
      })
      .catch((err) => {
        ToastDataDeleteFailed(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <>
      <CRow>
        <CCol>
          <div className="mb-4">
            <h4>Stok</h4>
            <hr />
          </div>

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

            <CCardHeader>Tabel Proses Opname</CCardHeader>
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
                    className="button-search-opname"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <div className="d-flex">
                  {status_open ? (
                    <CButton
                      className="button-filter-opname"
                      onClick={() =>
                        redirectProsesOpname(
                          { opname_id, status_edit: 0, data },
                          "add"
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faAdd} />
                    </CButton>
                  ) : (
                    <CSVLink
                      filename="list-stock-opname-postme"
                      className="text-white"
                      data={data}
                      headers={headers}
                    >
                      <CButton className="button-csv-opname">
                        <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                        CSV
                      </CButton>
                    </CSVLink>
                  )}

                  <CButton
                    className="button-filter-opname ml-2"
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
                  no: (item, index) => (
                    <td>
                      <p>{index + 1}</p>
                    </td>
                  ),
                  namaProduk: (item) => (
                    <td>
                      <p>{item.product_name}</p>
                    </td>
                  ),
                  unit: (item) => (
                    <td>
                      <p>{item.unit_name}</p>
                    </td>
                  ),
                  stokSistem: (item) => (
                    <td>
                      <p>
                        {item.status == 1 ? item.stock_system : item.stock_now}
                      </p>
                    </td>
                  ),
                  stokFisik: (item) => (
                    <td>
                      <p>{item.stock_physique}</p>
                    </td>
                  ),
                  selisih: (item) => (
                    <td>
                      <p>
                        {item.status == "0"
                          ? item.deviation
                          : item.stock_physique - item.stock_system}
                      </p>
                    </td>
                  ),
                  description: (item) => (
                    <td className="input-deskripsi-opnam">
                      <p>{item.description}</p>
                    </td>
                  ),
                  action: (item) => {
                    if (status_open) {
                      return (
                        <td>
                          <CButton
                            onClick={() =>
                              redirectProsesOpname(
                                { ...item, status_edit: 1, data },
                                "update"
                              )
                            }
                            className="button-edit-opname mr-1"
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </CButton>

                          <CButton
                            onClick={() => deleteOpname(item.id)}
                            className="ml-1"
                            color="danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </td>
                      );
                    } else {
                      return <td>-</td>;
                    }
                  },
                }}
              />
            </CCardBody>
          </CCard>
          {status_open ? (
            <CCard className="p-3">
              <div className="d-flex justify-content-end">
                <CButton onClick={() => updateStatusOpname()} color="info">
                  <FontAwesomeIcon className="mr-3" icon={faCheck} />
                  Submit Proses Opname
                </CButton>
              </div>
            </CCard>
          ) : null}
        </CCol>
      </CRow>
    </>
  );
};

export default OpnameProcess;
