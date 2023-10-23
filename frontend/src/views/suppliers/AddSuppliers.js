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
import "../../assets/css/suppliers.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { onInputChange } from "../components/utils";

const AddSuppliers = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const createSuppliers = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/suppliers/create`,
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
          description: "",
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

        <CCardHeader>Tambah Supplier</CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div>
                <CLabel htmlFor="name">Nama supplier :</CLabel>
                <CInput
                  onChange={(e) => onInputChange(data, setData, e, "name")}
                  placeholder="Isi nama supplier"
                  name="name"
                  type="text"
                  value={data.name}
                  minLength="3"
                  maxLength="20"
                />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="desc">Deskripsi :</CLabel>
                <CTextarea
                  onChange={(e) =>
                    onInputChange(data, setData, e, "description")
                  }
                  placeholder="Isi deskripsi"
                  name="desc"
                  type="text"
                  value={data.description}
                  rows={5}
                  minLength="3"
                  maxLength="150"
                />
              </div>

              <div className="d-flex flex-row-reverse">
                <CButton
                  onClick={() => createSuppliers()}
                  className="button-tambah-suppliers mt-3"
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

export default AddSuppliers;
