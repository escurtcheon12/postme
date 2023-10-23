import {
  CButton,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import {
  faMoneyBill,
  faMoneyBill1,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import {
  ToastDataSaveFailed,
  ToastDataSaveSuccess,
} from "src/views/components/toastify";
import { useDispatch } from "react-redux";
import { setStateNotif } from "src/redux/action/notif_action";
import { deleteAllInventory } from "src/redux/action/cart_action";

const ModalCheckoutOrder = ({
  openModal,
  setOpenModal,
  closeModal,
  totalPaid,
  listItemOrder,
  dataOrder,
}) => {
  const [nominalPaid, setNomidalPaid] = useState(0);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    const sumPaid = nominalPaid - totalPaid;
    const data_obj = {
      customer_id: dataOrder.customers_id,
      method: dataOrder.method_payment,
      discount: dataOrder.discount,
      paid_nominal: nominalPaid,
      less_nominal: sumPaid,
      data_product_item: listItemOrder,
    };

    if (
      dataOrder.method_payment === "Cash" ||
      dataOrder.method_payment === "EMoney"
    ) {
      if (Math.sign(sumPaid) === -1) {
        ToastDataSaveFailed(
          "Pembayaran cash dan e-money tidak boleh mempunyai sisa total yang kurang atau nominal negative"
        );
      } else {
        await axios
          .post(
            `${process.env.REACT_APP_BE_URL_PORT}/web/orders/create`,
            data_obj,
            {
              headers: {
                Authorization: `Bearer ${
                  localStorage.getItem("authorization_token") || ""
                }`,
              },
            }
          )
          .then((res) => {
            setNomidalPaid(0);
            dispatch(deleteAllInventory());
            setOpenModal(false);
            dispatch(setStateNotif());
            ToastDataSaveSuccess();
          })
          .catch((err) => {
            ToastDataSaveFailed(err.response.data.message);
            console.log(err);
          });
      }
    } else if (dataOrder.method_payment === "Utang") {
      if (Math.sign(sumPaid) === -1) {
        await axios
          .post(
            `${process.env.REACT_APP_BE_URL_PORT}/web/orders/create`,
            data_obj,
            {
              headers: {
                Authorization: `Bearer ${
                  localStorage.getItem("authorization_token") || ""
                }`,
              },
            }
          )
          .then((res) => {
            dispatch(deleteAllInventory());
            setOpenModal(false);
            dispatch(setStateNotif());
            ToastDataSaveSuccess();
          })
          .catch((err) => {
            ToastDataSaveFailed(err.response.data.message);
            console.log(err);
          });
      } else {
        ToastDataSaveFailed(
          "Pembayaran utang harus mempunyai total yang kurang atau mengandung nominal negative"
        );
      }
    } else {
      ToastDataSaveFailed("Metode pembayaran harus di pilih");
    }
  };

  return (
    <>
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

      <CModal show={openModal} onClose={closeModal} size="sm">
        <CModalHeader closeButton>
          <CModalTitle className="text-center">Nominal yang di bayar</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <CInputGroup className="input-prepend">
              <CInputGroupPrepend>
                <CInputGroupText>
                  <FontAwesomeIcon icon={faMoneyBill} />
                </CInputGroupText>
              </CInputGroupPrepend>
              <CInput
                id="prependedInput"
                name="discount"
                size="16"
                type="number"
                placeholder="Nominal Paid"
                value={nominalPaid || 0}
                min={0}
                onChange={(e) => setNomidalPaid(e.target.value)}
              />
            </CInputGroup>
          </div>
          <div className="mt-3">
            <CInputGroup className="input-prepend">
              <CInputGroupPrepend>
                <CInputGroupText>
                  <FontAwesomeIcon icon={faMoneyBill1} />
                </CInputGroupText>
              </CInputGroupPrepend>
              <CInput
                id="prependedInput"
                name="discount"
                size="16"
                type="number"
                value={totalPaid || 0}
                readOnly
              />
            </CInputGroup>
          </div>
          <hr />
          <div className="mt-3">
            <CInputGroup className="input-prepend">
              <CInputGroupPrepend>
                <CInputGroupText>
                  <FontAwesomeIcon icon={faMoneyBillTransfer} />
                </CInputGroupText>
              </CInputGroupPrepend>
              <CInput
                id="prependedInput"
                name="discount"
                size="16"
                type="number"
                value={nominalPaid - totalPaid}
                readOnly
              />
            </CInputGroup>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => handleCheckout()} color="info">
            Bayar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default ModalCheckoutOrder;
