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
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faSearch,
  faFilter,
  faSave,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/stok.css";
import axios from "axios";
import { CSVLink } from "react-csv";
import { ToastContainer } from "react-toastify";
import {
  ToastDataSaveFailed,
  ToastDataSaveSuccess,
} from "../components/toastify";
import { fetchFirstData, onInputChange } from "../components/utils";
import utils from "src/shared/utils";
import { setStateNotif } from "src/redux/action/notif_action";
import { useDispatch } from "react-redux";

let headers = [
  // { label: "No", key: "id" },
  { label: "Nama Produk", key: "product_name" },
  { label: "Stok Sebelumnya", key: "stock_before" },
  // { label: "Stok Ditambahkan", key: "stock_added" },
  { label: "Stok Setelahnya", key: "stock_after" },
  { label: "Nama Suppliers", key: "suppliers_name" },
  { label: "Unit", key: "unit" },
  { label: "Deskripsi", key: "description" },
  { label: "Tanggal di buat", key: "createdAt" },
];

const fields = [
  "no",
  "namaProduk",
  "stokSebelumnya",
  // "stokDitambahkan",
  "stokSetelahnya",
  "namaSuppliers",
  "unit",
  "deskripsi",
  "diBuat",
];

const StockIn = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataSuppliers, setDataSuppliers] = useState([]);
  const [dataStockLogs, setDataStockLogs] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [modal, setModal] = useState(false);

  const [dataItem, setDataItem] = useState({
    id: 0,
    product_id: 0,
    category_name: "",
    stock: 0,
    suppliers_id: 0,
    description: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data_stocks_in = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/stocks/list-detail-logs?sort=${sort}&search=${search}&status_stock_logs=1`,
          ""
        );
        const data_products = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/list-detail-stocks`,
          ""
        );
        const data_suppliers = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/suppliers/list`,
          ""
        );
        const data_stock_logs = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/stock-logs/list-description`,
          ""
        );

        const fetch_data = await Promise.all([
          data_stocks_in,
          data_products,
          data_suppliers,
          data_stock_logs,
        ]);

        fetch_data.forEach((item, index) => {
          if (index === 0) setData(item.data.data);
          if (index === 1) setDataProduct(item.data.data);
          if (index === 2) setDataSuppliers(item.data.data);
          if (index === 3) {
            setDataStockLogs(item.data.data);
          }
        });
      } catch (err) {
        console.log("err", err);
      }
    })();
  }, [sort, statusSearch, deleteData, dataItem]);

  const selectProduct =
    dataProduct.filter((item) => {
      return item.id == dataItem.product_id;
    }) || 0;

  const searchFilter = () => {
    setStatusSearch(!statusSearch);
  };

  const alphabetFilter = () => {
    const validationSort = sort === "ASC" ? "DESC" : "ASC";

    setSort(validationSort);
  };

  const closeModal = () => {
    setDataItem({
      id: 0,
      product_id: 0,
      category_name: "",
      stock: 0,
      suppliers_id: 0,
      description: "",
    });
    setModal(false);
  };

  const buttonSaveStock = async () => {
    if (dataItem.product_id == 0 || !dataItem.stock) {
      return ToastDataSaveFailed("Produk, dan stock harus di isi");
    }

    if (!dataItem.stock || Math.sign(dataItem.stock) === -1) {
      return ToastDataSaveFailed(
        "Stok yang masuk harus mengandung input stok yang mengandung angka positive"
      );
    }

    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/stocks/update-logs`,
        {
          id: selectProduct.length > 0 ? selectProduct[0].stock_id : 0,
          product_id: dataItem.product_id,
          stock_now: dataItem.stock,
          suppliers_id: dataItem.suppliers_id,
          description: dataItem.description,
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
        setDataItem({
          id: 0,
          product_id: 0,
          category_name: "",
          stock: 0,
          suppliers_id: 0,
          description: "",
        });
        dispatch(setStateNotif());
        ToastDataSaveSuccess();
        setDeleteData(!deleteData);
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <>
      <div className="mb-4">
        <h4>Stok</h4>
        <hr />
      </div>

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

            <CModal show={modal} onClose={closeModal}>
              <CModalHeader closeButton>
                <CModalTitle>Tambah Stok Masuk</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div>
                    <CLabel htmlFor="product_name">Produk :</CLabel>

                    <CSelect
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "product_id")
                      }
                      value={dataItem.product_id}
                      custom
                      name="product_name"
                      id="product_name"
                    >
                      <option selected value={0}>
                        Pilih Produk
                      </option>
                      {(dataProduct || []).map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {item.name} ( {item.unit_name} )
                          </option>
                        );
                      })}
                    </CSelect>
                  </div>
                  <div className="mt-2">
                    <CLabel htmlFor="stock_before">Stok Sebelumnya:</CLabel>
                    <CInput
                      value={
                        selectProduct.length > 0
                          ? selectProduct[0].stock_now
                          : 0
                      }
                      placeholder="Stok"
                      name="stock_before"
                      type="number"
                      readOnly
                    />
                  </div>

                  <div className="mt-2">
                    <CLabel htmlFor="stock">Stok Ditambahkan :</CLabel>
                    <CInput
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "stock")
                      }
                      value={dataItem.stock}
                      placeholder="Stok"
                      name="stock"
                      type="number"
                      min="0"
                    />
                  </div>

                  <div className="mt-2">
                    <CLabel htmlFor="suppliers_name">Supplier :</CLabel>
                    <CSelect
                      onChange={(e) =>
                        onInputChange(dataItem, setDataItem, e, "suppliers_id")
                      }
                      value={dataItem.suppliers_id}
                      custom
                      name="suppliers_name"
                      id="suppliers_name"
                    >
                      <option selected value={Number(0)}>
                        Pilih Suppliers
                      </option>
                      {(dataSuppliers || []).map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </CSelect>
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
                      rows={5}
                      minLength="3"
                      maxLength="300"
                    />
                  </div>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className="button-edit-stock"
                  onClick={() => buttonSaveStock()}
                >
                  <FontAwesomeIcon className="mr-2" icon={faSave} />
                  Save
                </CButton>
              </CModalFooter>
            </CModal>

            <CCardHeader>Tabel Stok Masuk</CCardHeader>
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
                    className="button-search-stock"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <div className="d-flex">
                  <CButton
                    onClick={() => setModal(true)}
                    className="button-edit-stock mr-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </CButton>

                  <CSVLink
                    filename="list-stock-in-postme"
                    className="text-white"
                    data={data}
                    headers={headers}
                  >
                    <CButton className="button-csv-stock">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </CSVLink>
                  <CButton
                    className="button-filter-stock ml-2"
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
                  namaSuppliers: (item) => (
                    <td className="stock-field-suppliers">
                      <p>{item.suppliers_name}</p>
                    </td>
                  ),
                  unit: (item) => (
                    <td>
                      <p>{item.unit}</p>
                    </td>
                  ),
                  stokSebelumnya: (item) => (
                    <td className="stock-field-stock-before">
                      <p>{item.stock_before}</p>
                    </td>
                  ),
                  stokSetelahnya: (item) => (
                    <td className="stock-field-stock-after">
                      <p>{item.stock_after}</p>
                    </td>
                  ),
                  deskripsi: (item) => (
                    <td className="input-deskripsi-stock">
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
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default StockIn;
