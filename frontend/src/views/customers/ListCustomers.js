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
  CTextarea,
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
import "../../assets/css/customers.css";
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
  { label: "Nama", key: "name" },
  { label: "No Hp", key: "phone_number" },
  { label: "Alamat", key: "address" },
  { label: "Tanggal di buat", key: "createdAt" },
];

const fields = ["No", "nama", "noHp", "alamat", "diBuat", "action"];

const ListCustomers = () => {
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataItem, setDataItem] = useState({
    id: 0,
    name: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `${process.env.REACT_APP_BE_URL_PORT}/web/customers/list?sort=${sort}&search=${search}`,
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

  const openModalEdit = (item) => {
    setDataItem({
      id: item.id,
      name: item.name,
      phone_number: item.phone_number,
      address: item.address,
    });
    setModalEdit(true);
  };

  const editCustomers = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/customers/update`,
        {
          id,
          name: dataItem.name,
          phone_number: dataItem.phone_number,
          address: dataItem.address,
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

  const deleteCustomers = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/customers/delete`,
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
          <div className="mb-4">
            <h4>Pelanggan</h4>
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

            <CModal show={modalEdit} onClose={setModalEdit}>
              <CModalHeader closeButton>
                <CModalTitle>Edit Pelanggan</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div>
                    <CLabel htmlFor="name">Nama pelanggan :</CLabel>
                    <CInput
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "name")
                      }
                      value={dataItem.name}
                      placeholder="Isi nama pelanggan"
                      name="name"
                      type="text"
                      minLength="3"
                      maxLength="20"
                    />
                  </div>

                  <div className="mt-3">
                    <CLabel htmlFor="phone">Nomor hp :</CLabel>
                    <CInput
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "phone_number")
                      }
                      value={dataItem.phone_number || 0}
                      minLength={0}
                      maxLength={13}
                      placeholder="Isi nomor hp"
                      name="phone"
                      type="text"
                    />
                  </div>

                  <div className="mt-3">
                    <CLabel htmlFor="address">Alamat :</CLabel>
                    <CTextarea
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "address")
                      }
                      value={dataItem.address}
                      placeholder="Isi alamat"
                      name="address"
                      type="text"
                      rows={5}
                      minLength="3"
                      maxLength="300"
                    />
                  </div>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="button-edit-customers"
                  onClick={() => editCustomers(dataItem.id)}
                >
                  <FontAwesomeIcon className="mr-2" icon={faSave} />
                  Save
                </CButton>
                <CButton color="danger" onClick={() => setModalEdit(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>

            <CCardHeader>Tabel Pelanggan</CCardHeader>
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
                    className="button-search-customers"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <div className="d-flex">
                  <CSVLink
                    filename="list-customers-postme"
                    className="text-white"
                    data={data}
                    headers={headers}
                  >
                    <CButton className="button-csv-customers">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </CSVLink>
                  <CButton
                    className="button-filter-customers ml-2"
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
                  nama: (item) => (
                    <td>
                      <p>{item.name}</p>
                    </td>
                  ),
                  noHp: (item) => (
                    <td>
                      <p>{item.phone_number}</p>
                    </td>
                  ),
                  alamat: (item) => (
                    <td className="input-alamat-customers">
                      <p>{item.address}</p>
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
                      <CButton
                        onClick={() => openModalEdit(item)}
                        className="button-edit-customers"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </CButton>
                      <CButton
                        onClick={() => deleteCustomers(item.id)}
                        className="ml-1"
                        color="danger"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </CButton>
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

export default ListCustomers;
