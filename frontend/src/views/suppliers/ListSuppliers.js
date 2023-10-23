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
import "../../assets/css/suppliers.css";
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
  { label: "Deskripsi", key: "description" },
  { label: "Tanggal di buat", key: "createdAt" },
];

const fields = ["No", "nama", "deskripsi", "diBuat", "action"];

const ListSuppliers = () => {
  const [data, setData] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataItem, setDataItem] = useState({
    id: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `${process.env.REACT_APP_BE_URL_PORT}/web/suppliers/list?sort=${sort}&search=${search}`,
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
      description: item.description,
    });
    setModalEdit(true);
  };

  const editSuppliers = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/suppliers/update`,
        { id, name: dataItem.name, description: dataItem.description },
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
        console.log(err);
      });
  };

  const deleteSuppliers = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/suppliers/delete`,
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
            <h4>Supplier</h4>
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
                <CModalTitle>Edit Kategori</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div>
                    <CLabel htmlFor="name">Nama supplier :</CLabel>
                    <CInput
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "name")
                      }
                      value={dataItem.name}
                      placeholder="Isi nama supplier"
                      name="name"
                      type="text"
                      minLength="3"
                      maxLength="20"
                    />
                  </div>

                  <div className="mt-3">
                    <CLabel htmlFor="desc">Deskripsi :</CLabel>
                    <CTextarea
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "description")
                      }
                      value={dataItem.description}
                      placeholder="Isi deskripsi"
                      name="desc"
                      type="text"
                      minLength="3"
                      maxLength="150"
                    />
                  </div>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="button-edit-suppliers"
                  onClick={() => editSuppliers(dataItem.id)}
                >
                  <FontAwesomeIcon className="mr-2" icon={faSave} />
                  Save
                </CButton>
                <CButton color="danger" onClick={() => setModalEdit(false)}>
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>

            <CCardHeader>Tabel Supplier</CCardHeader>
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
                    className="button-search-suppliers"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <div className="d-flex">
                  <CSVLink
                    filename="list-suppliers-postme"
                    className="text-white"
                    data={data}
                    headers={headers}
                  >
                    <CButton className="button-csv-suppliers">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </CSVLink>
                  <CButton
                    className="button-filter-suppliers ml-2"
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
                  deskripsi: (item) => (
                    <td className="input-deskripsi-suppliers">
                      <p>{item.description}</p>
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
                        className="button-edit-suppliers"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </CButton>
                      <CButton
                        onClick={() => deleteSuppliers(item.id)}
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

export default ListSuppliers;
