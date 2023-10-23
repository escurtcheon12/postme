import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CLabel,
  CInput,
  CModalFooter,
  CButton,
  CSelect,
} from "@coreui/react";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ToastDataDeleteSuccess,
  ToastDataSaveFailed,
} from "src/views/components/toastify";
import { onInputChange } from "src/views/components/utils";

const ModalUpdatePaid = ({
  id,
  modal,
  setModal,
  closeModal,
  setStatusButtonPaid,
  statusButtonPaid,
  dataPaid,
  setDataPaid,
}) => {
  const [nominalPaid, setNominalPaid] = useState(dataPaid.nominal);

  const handleSavePaid = async () => {
    const totalPaid = nominalPaid - dataPaid.totalBelanja;
    if (!dataPaid.method) {
      return ToastDataSaveFailed("Metode pembayaran harus di pilih");
    }

    if (dataPaid.method === "Utang") {
      if (Math.sign(totalPaid) !== -1) {
        return ToastDataSaveFailed(
          "Metode pembayaran utang harus tidak mempunyai sisa atau yang mengandung nominal negative"
        );
      }
    } else {
      if (Math.sign(totalPaid) === -1) {
        return ToastDataSaveFailed(
          "Metode pembayaran cash dan e money harus mempunyai sisa yang mengandung nominal positive atau 0"
        );
      }
    }

    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/orders/update/${id}`,
        {
          method: dataPaid.method,
          paid_nominal: nominalPaid,
          less_nominal: nominalPaid - dataPaid.totalBelanja,
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
        setModal(false);
        setStatusButtonPaid(!statusButtonPaid);
        ToastDataDeleteSuccess("Success");
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  useEffect(() => {
    setNominalPaid(dataPaid.nominal);
  }, [dataPaid.nominal]); 

  return (
    <CModal show={modal} onClose={closeModal}>
      <CModalHeader closeButton>
        <CModalTitle>Update pembayaran</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <CLabel htmlFor="method">Metode pembayaran :</CLabel>
          <CSelect
            value={dataPaid.method}
            onChange={(e) => onInputChange(dataPaid, setDataPaid, e, "method")}
            custom
            name="method"
            id="method"
          >
            <option selected value="">
              Pilih Metode Pembayaran
            </option>
            <option value="Cash">Cash</option>
            <option value="Utang">Utang</option>
            <option value="EMoney">E-Money</option>
          </CSelect>
        </div>

        <div className="mt-2">
          <CLabel htmlFor="product_name">Nominal :</CLabel>
          <CInput
            onChange={(e) => setNominalPaid(e.target.value)}
            value={nominalPaid}
            type="number"
            placeholder="Isi nominal"
          />
        </div>

        <div className="mt-2">
          <CLabel htmlFor="product_name">Total Belanja :</CLabel>
          <CInput value={dataPaid.totalBelanja} type="number" readOnly />
        </div>

        <hr />

        <div className="mt-2">
          <CInput
            value={nominalPaid - dataPaid.totalBelanja}
            type="number"
            readOnly
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton
          className="button-save-paid_nominal"
          onClick={() => handleSavePaid()}
        >
          <FontAwesomeIcon className="mr-2" icon={faSave} />
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModalUpdatePaid;
