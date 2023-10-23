import React, { useRef } from "react";
import "../../../assets/css/invoice.css";
import "../../../assets/css/invoice-print.css";
import { CButton, CCard, CDataTable } from "@coreui/react";
import utils, { formatRupiah } from "src/shared/utils";
import ReactToPrint from "react-to-print";
import { useLocation } from "react-router-dom";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Invoice = () => {
  const componentRef = useRef();
  const location = useLocation();

  let data = [];
  let data_details = [];
  let invoice_id = 0;

  if (location.state) {
    data = location.state.data;
    data_details = location.state.data_details;
    invoice_id = location.state.invoice_id;
  }

  const sumTotalProductPrice = () => {
    const result = data_details.reduce((total, { quantity, product_price }) => {
      let sumQuantity = Number(quantity) * Number(product_price);
      return Number(total) + sumQuantity;
    }, 0);

    return result;
  };

  const convertSubtotalToDiscount = () => {
    if (data.discount) {
      return (
        sumTotalProductPrice() -
          Math.round(sumTotalProductPrice() * (data.discount / 100)) || 0
      );
    } else {
      return sumTotalProductPrice() || 0;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4>Transaksi</h4>
        <hr />
      </div>

      <div className="mb-2 d-flex justify-content-end">
        <ReactToPrint
          trigger={() => (
            <CButton className="button-csv-invoice mr-2">
              <FontAwesomeIcon className="mr-2" icon={faPrint} />
              Print
            </CButton>
          )}
          content={() => componentRef.current}
        />
      </div>
      <div className="invoice-container" ref={componentRef}>
        <CCard className="p-5">
          <div className="d-flex justify-content-between">
            <div>
              <div className="logo"></div>
              <p className="mt-3">
                Address, <br />
                <div className="w-50">
                  JL. H. Saidi Jati, Cikarang Kota,Kec. Cikarang Utara,
                  Kabupaten Bekasi, Jawa Barat 17530
                </div>
              </p>
            </div>

            <div>
              <h1 className="mt-2">INVOICE</h1>
              <div className="font-weight text-right">
                <p>#INV {invoice_id || 0}</p>
              </div>
              <div className="d-flex flex-row-reverse">
                <p>{utils.convertIndonesiaTime(new Date(), 0)}</p>
              </div>
              <div className="d-flex flex-row-reverse">
                <p>{data.customer_name || ""}</p>
              </div>
            </div>
          </div>

          <div>
            <CDataTable
              items={data_details}
              fields={[
                "No",
                "namaProduk",
                "unit",
                "quantity",
                "hargaProduk",
                "total",
              ]}
              itemsPerPage={5}
              scopedSlots={{
                No: (item, index) => (
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
                quantity: (item) => (
                  <td>
                    <p>{item.quantity}</p>
                  </td>
                ),
                hargaProduk: (item) => (
                  <td>
                    <p>{formatRupiah(item.product_price || 0)}</p>
                  </td>
                ),
                total: (item) => (
                  <td>
                    <p>
                      {formatRupiah(item.product_price * item.quantity || 0)}
                    </p>
                  </td>
                ),
              }}
            />
          </div>

          <div className="d-flex justify-content-end">
            <p className="mr-3">Subtotal :</p>
            <p className="font-weight-bold">
              {formatRupiah(sumTotalProductPrice() || 0)}
            </p>
          </div>

          <div className="d-flex justify-content-end">
            <p className="mr-3">Diskon :</p>
            <p className="font-weight-bold">{(data.discount || 0) + "%"}</p>
          </div>

          <hr />
          <div className="d-flex justify-content-end">
            <p className="mr-3">Nominal yang di bayar :</p>
            <p className="font-weight-bold">
              {formatRupiah(data.paid_nominal || 0)}
            </p>
          </div>

          <div className="d-flex justify-content-end">
            <p className="mr-3">Grand Total :</p>
            <p className="font-weight-bold">
              {formatRupiah(convertSubtotalToDiscount() || 0)}
            </p>
          </div>

          <hr />

          <div className="d-flex justify-content-end">
            <p className="mr-3">Sisa :</p>
            <p className="font-weight-bold">
              {formatRupiah(
                data.paid_nominal - Number(convertSubtotalToDiscount()) || 0
              )}
            </p>
          </div>
        </CCard>
      </div>
    </div>
  );
};

export default Invoice;
