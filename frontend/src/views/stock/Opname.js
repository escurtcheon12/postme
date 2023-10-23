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
import { useHistory } from "react-router-dom/cjs/react-router-dom";

let headers = [
  { label: "Username", key: "username" },
  { label: "Proses Status", key: "result_status" },
  { label: "Tanggal di buat", key: "createdAt" },
];
const fields = ["no", "username", "status", "tanggalProses", "action"];
const getBadge = (status) => {
  switch (status) {
    case "1":
      return "success";
    default:
      return "dark";
  }
};

const Opname = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataItem, setDataItem] = useState({
    id: 0,
    name: "",
  });

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `${process.env.REACT_APP_BE_URL_PORT}/web/opnames/list?sort=${sort}&search=${search}`,
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
  }, [sort, statusSearch, deleteData]);

  const searchFilter = () => {
    setStatusSearch(!statusSearch);
  };

  const alphabetFilter = () => {
    const validationSort = sort === "ASC" ? "DESC" : "ASC";

    setSort(validationSort);
  };

  const redirectAddProsesOpname = async () => {
    history.push({
      pathname: "/stok/form-proses-opname",
      state: {
        data: {},
      },
    });
  };

  const redirectProsesOpname = async (id, status) => {
    if (status === "update") {
      history.push({
        pathname: "/stok/proses-opname",
        state: {
          data: [
            {
              opname_id: id,
              status_edit: 1,
            },
          ],
        },
      });
    } else {
      history.push({
        pathname: "/stok/proses-opname",
        state: {
          data: [
            {
              opname_id: id,
              status_edit: 0,
              data: [],
            },
          ],
        },
      });
    }
  };

  const deleteOpname = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/opnames/delete`,
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

            <CCardHeader>Tabel Stok Opname</CCardHeader>
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
                  <CButton
                    className="button-filter-opname mr-2"
                    onClick={() => redirectAddProsesOpname()}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faBarsProgress} />
                    Proses Opname
                  </CButton>
                  <CSVLink
                    filename="list-opname-postme"
                    className="text-white"
                    data={data}
                    headers={headers}
                  >
                    <CButton className="button-csv-opname">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </CSVLink>
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
                  username: (item) => (
                    <td>
                      <p>{item.username}</p>
                    </td>
                  ),
                  status: (item) => {
                    return (
                      <td>
                        <CBadge color={getBadge(item.status)}>
                          {item.status == 1
                            ? "Proses Selesai"
                            : "Sedang Proses"}
                        </CBadge>
                      </td>
                    );
                  },
                  tanggalProses: (item) => {
                    return (
                      <td>
                        <p>{utils.convertIndonesiaTime(item.createdAt)}</p>
                      </td>
                    );
                  },
                  action: (item) => {
                    if (item.status == 1) {
                      return (
                        <td>
                          <CButton
                            onClick={() =>
                              redirectProsesOpname(item.id, "view")
                            }
                            className="button-views-opname"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                        </td>
                      );
                    } else {
                      return (
                        <td>
                          <CButton
                            onClick={() =>
                              redirectProsesOpname(item.id, "update")
                            }
                            className="button-edit-opname mr-1"
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </CButton>
                          <CButton
                            onClick={() =>
                              redirectProsesOpname(item.id, "view")
                            }
                            className="button-views-opname"
                          >
                            <FontAwesomeIcon icon={faEye} />
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
                    }
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Opname;
