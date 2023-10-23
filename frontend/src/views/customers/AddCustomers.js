import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CInput,
  CLabel,
  CTextarea,
} from "@coreui/react";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/customers.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { onInputChange } from "../components/utils";

const AddCustomers = () => {
  const [data, setData] = useState({
    name: "",
    phone_number: "",
    address: "",
  });

  const createCustomers = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/customers/create`,
        {
          name: data.name,
          phone_number: data.phone_number,
          address: data.address,
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
          phone_number: "",
          address: "",
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

        <CCardHeader>Tambah Pelanggan</CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div>
                <CLabel htmlFor="name">Nama pelanggan :</CLabel>
                <CInput
                  onChange={(e) => onInputChange(data, setData, e, "name")}
                  placeholder="Isi nama pelanggan"
                  name="name"
                  type="text"
                  minLength="3"
                  maxLength="20"
                  value={data.name}
                />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="phone">Nomor hp :</CLabel>
                <CInput
                  onChange={(e) =>
                    onInputChange(data, setData, e, "phone_number")
                  }
                  value={data.phone_number}
                  min={0}
                  minLength="0"
                  maxLength="13"
                  placeholder="Isi nomor hp"
                  name="phone"
                  type="number"
                />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="address">Alamat :</CLabel>
                <CTextarea
                  onChange={(e) => onInputChange(data, setData, e, "address")}
                  placeholder="Isi alamat"
                  name="address"
                  type="text"
                  value={data.address}
                  rows={5}
                  minLength="3"
                  maxLength="300"
                />
              </div>

              <div className="d-flex flex-row-reverse">
                <CButton
                  onClick={() => createCustomers()}
                  className="button-tambah-customers mt-3"
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

export default AddCustomers;
