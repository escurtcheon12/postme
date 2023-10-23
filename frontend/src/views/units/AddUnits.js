import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CInput,
  CLabel,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/units.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { onInputChange } from "../components/utils";

const AddUnits = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const createUnit = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/unit/create`,
        {
          name: data.name,
          description: data.description,
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
        setData({
          name: "",
        });
        ToastDataSaveSuccess();
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <>
      <div className="mb-4">
        <h4>Unit</h4>
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

        <CCardHeader>Tambah Unit</CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div>
                <CLabel htmlFor="name">Nama Unit</CLabel>
                <CSelect
                  value={data.name}
                  onChange={(e) => onInputChange(data, setData, e, "name")}
                >
                  <option value="">Pilih Unit</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Pak">Pak</option>
                  <option value="Dus">Dus</option>
                  <option value="Renceng">Renceng</option>
                  <option value="Kilogram">Kilogram</option>
                  <option value="Gram">Gram</option>
                  <option value="Liter">Liter</option>
                  <option value="Centimeter">Centimeter</option>
                </CSelect>
              </div>

              <div className="d-flex flex-row-reverse">
                <CButton
                  onClick={() => createUnit()}
                  className="button-tambah-unit mt-3"
                >
                  <FontAwesomeIcon className="mr-2" icon={faAdd} />
                  Tambah
                </CButton>
              </div>
            </CForm>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

export default AddUnits;
