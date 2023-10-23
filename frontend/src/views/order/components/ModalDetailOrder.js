import {
  CButton,
  CDataTable,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { faFileExport, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";

const ModalDetailOrder = ({
  modal,
  closeModal,
  data_details,
  headers,
  fields_detail,
  data,
  invoice_id,
}) => {
  const history = useHistory();
  const componentRef = useRef();

  const redirectInvoice = () => {
    history.push({
      pathname: "/invoice",
      state: { data, data_details, invoice_id },
    });
  };

  return (
    <CModal show={modal} onClose={closeModal} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>List Transaksi Detail</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex mb-2 flex-row-reverse">
          <CSVLink
            filename="list-transaksi-detail-postme"
            className="text-white"
            data={data_details}
            headers={headers}
          >
            <CButton className="button-csv-order">
              <FontAwesomeIcon className="mr-2" icon={faFileExport} />
              CSV
            </CButton>
          </CSVLink>

          <CButton
            onClick={() => redirectInvoice()}
            className="button-csv-order mr-2"
          >
            <FontAwesomeIcon className="mr-2" icon={faPrint} />
            Invoice
          </CButton>
        </div>

        <div className="d-none" ref={componentRef}></div>

        <CDataTable
          items={data_details}
          fields={fields_detail}
          itemsPerPage={5}
          pagination
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
                <p>{"Rp. " + item.product_price}</p>
              </td>
            ),
            totalHargaProduk: (item) => (
              <td>
                <p>{"Rp. " + item.total_product_price}</p>
              </td>
            ),
          }}
        />
      </CModalBody>
    </CModal>
  );
};

export default ModalDetailOrder;
