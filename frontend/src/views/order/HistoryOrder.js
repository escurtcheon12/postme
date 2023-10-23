import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CInput,
  CButton,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faSearch,
  faFilter,
  faEye,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/order.css";
import axios from "axios";
import { CSVLink } from "react-csv";
import { ToastContainer } from "react-toastify";
import utils, { formatRupiah } from "src/shared/utils";
import ModalDetailOrder from "./components/ModalDetailOrder";
import ModalUpdatePaid from "./components/ModalUpdatePaid";

const [headers_orders, headers_order_detail] = [
  [
    { label: "Nama Pelanggan", key: "name" },
    { label: "Quantity", key: "quantity" },
    { label: "Diskon", key: "discount" },
    { label: "Metode Pembayaran", key: "method" },
    { label: "Total nominal yang di bayarkan", key: "paid_nominal" },
    { label: "Total Belanja", key: "total_order_price" },
    { label: "Total Nominal Yang Kurang", key: "less_nominal" },
    { label: "Di Buat", key: "createdAt" },
  ],
  [
    { label: "Nama Produk", key: "product_name" },
    { label: "Unit", key: "unit_name" },
    { label: "Quantity", key: "quantity" },
    { label: "Harga Produk", key: "product_price" },
    { label: "Total Harga Produk", key: "total_product_price" },
    { label: "Di Buat", key: "createdAt" },
  ],
];

const [fields_orders, fields_order_detail] = [
  [
    "No",
    "namaAkun",
    "namaPelanggan",
    "quantity",
    "diskon",
    "metodePembayaran",
    "totalNominalYangDiBayarkan",
    "totalBelanja",
    "totalNominalYangKurang",
    "diBuat",
    "action",
  ],
  ["No", "namaProduk", "unit", "quantity", "hargaProduk", "totalHargaProduk"],
];

const HistoryOrder = () => {
  const [data, setData] = useState([]);
  const [dataOrderDetails, setDataOrderDetails] = useState([]);
  const [sort, setSort] = useState("ASC");
  const [search, setSearch] = useState("");
  const [dataOrderId, setDataOrderId] = useState(0);
  const [modalPaid, setModalPaid] = useState(false);
  const [invoiceId, setInvoiceId] = useState(0);
  const [dataPaid, setDataPaid] = useState({
    id: 0,
    method: "",
    nominal: 0,
    totalBelanja: 0,
  });
  const [statusSearch, setStatusSearch] = useState(false);
  const [modal, setModal] = useState(false);
  const [statusButtonPaid, setStatusButtonPaid] = useState(true);

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `${process.env.REACT_APP_BE_URL_PORT}/web/orders/list-details?sort=${sort}&search=${search}`,
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
  }, [sort, statusSearch, statusButtonPaid]);

  const searchFilter = () => {
    setStatusSearch(!statusSearch);
  };

  const alphabetFilter = () => {
    const validationSort = sort === "ASC" ? "DESC" : "ASC";

    setSort(validationSort);
  };

  const openModalPaid = (item) => {
    setDataPaid({
      id: item.id,
      method: item.method,
      nominal: item.paid_nominal,
      totalBelanja: paidPriceRemaining(
        item.paid_nominal,
        item.subtotal_nominal,
        item.discount
      ),
    });
    setModalPaid(true);
  };

  const closeModalPaid = () => {
    setDataPaid({
      id: 0,
      method: "",
      nominal: 0,
      totalBelanja: 0,
    });
    setModalPaid(false);
  };

  const openModal = async (id, index) => {
    await axios
      .get(
        `${process.env.REACT_APP_BE_URL_PORT}/web/orders/list-order-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("authorization_token") || ""
            }`,
          },
        }
      )
      .then((res) => {
        setInvoiceId(index + 1);
        setDataOrderId(id);
        setDataOrderDetails(res.data.data);
      })
      .catch((err) => console.log("err", err));

    setModal(true);
  };

  const closeModal = async () => {
    setDataOrderDetails([]);
    setModal(false);
  };

  const paidPriceRemaining = (paid_nominal, nominal, discount) => {
    if (discount) {
      return Math.round(nominal - (discount / 100) * nominal);
    } else {
      return nominal;
    }
  };

  return (
    <>
      <CRow>
        <CCol>
          <div className="mb-4">
            <h4>Transaksi</h4>
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

            <ModalDetailOrder
              modal={modal}
              closeModal={closeModal}
              data_details={dataOrderDetails}
              headers={headers_order_detail}
              fields_detail={fields_order_detail}
              invoice_id={invoiceId}
              data={data.find((item) => item.id == dataOrderId) || 0}
            />

            <ModalUpdatePaid
              id={dataPaid.id}
              modal={modalPaid}
              setModal={setModalPaid}
              closeModal={closeModalPaid}
              setStatusButtonPaid={setStatusButtonPaid}
              statusButtonPaid={statusButtonPaid}
              dataPaid={dataPaid}
              setDataPaid={setDataPaid}
            />

            <CCardHeader>Tabel Histori Transaksi</CCardHeader>
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
                    className="button-search-order"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <div className="d-flex">
                  <CSVLink
                    filename="list-transaksi-postme"
                    className="text-white"
                    data={data}
                    headers={headers_orders}
                  >
                    <CButton className="button-csv-order">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </CSVLink>
                  <CButton
                    className="button-filter-order ml-2"
                    onClick={() => alphabetFilter()}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </CButton>
                </div>
              </div>
              <CDataTable
                items={data}
                fields={fields_orders}
                itemsPerPage={5}
                pagination
                scopedSlots={{
                  No: (item, index) => (
                    <td>
                      <p>{index + 1}</p>
                    </td>
                  ),
                  namaAkun: (item) => (
                    <td>
                      <p>{item.username}</p>
                    </td>
                  ),
                  namaPelanggan: (item) => (
                    <td>
                      <p>{item.name || "Unknown"}</p>
                    </td>
                  ),
                  quantity: (item) => (
                    <td>
                      <p>{item.quantity}</p>
                    </td>
                  ),
                  diskon: (item) => (
                    <td>
                      <p>{item.discount ? item.discount + "%" : 0}</p>
                    </td>
                  ),
                  metodePembayaran: (item) => (
                    <td>
                      <p>{item.method}</p>
                    </td>
                  ),
                  totalNominalYangDiBayarkan: (item) => (
                    <td>
                      <p>{formatRupiah(item.paid_nominal)}</p>
                    </td>
                  ),
                  totalBelanja: (item) => {
                    return (
                      <td>
                        <p>
                          {formatRupiah(
                            paidPriceRemaining(
                              item.paid_nominal,
                              item.subtotal_nominal,
                              item.discount
                            )
                          )}
                        </p>
                      </td>
                    );
                  },
                  totalNominalYangKurang: (item) => (
                    <td>
                      <p>{formatRupiah(item.less_nominal) || 0}</p>
                    </td>
                  ),
                  diBuat: (item) => {
                    return (
                      <td>
                        <p>{utils.convertIndonesiaTime(item.createdAt)}</p>
                      </td>
                    );
                  },
                  action: (item, index) => (
                    <td>
                      <div className="d-flex justify-content-center">
                        <CButton
                          onClick={() => openModalPaid(item)}
                          className="button-view-order mr-2"
                        >
                          <FontAwesomeIcon icon={faMoneyBill} />
                        </CButton>

                        <CButton
                          onClick={() => openModal(item.id, index)}
                          className="button-view-order"
                        >
                          <FontAwesomeIcon icon={faEye} />
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

export default HistoryOrder;
