import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CInput,
  CLabel,
  CSelect,
  CTextarea,
} from "@coreui/react";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/categories.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { onInputChange } from "../components/utils";

const AddCategory = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const createCategory = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/categories/create`,
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
        <h4>Kategori</h4>
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

        <CCardHeader>Tambah Kategori</CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div>
                <CLabel htmlFor="name">Nama kategori :</CLabel>
                <CSelect
                  value={data.name}
                  onChange={(e) => onInputChange(data, setData, e, "name")}
                >
                  <option value="">Pilih kategori</option>
                  <option value="Pcs">Makanan</option>
                  <option value="Pak">Minuman</option>
                  <option value="Alat">Alat</option>
                  <option value="Bahan makanan">Bahan makanan</option>
                  <option value="Jasa elektronik">Jasa elektronik</option>
                </CSelect>
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
                  rows={5}
                  value={data.description}
                  minLength="3"
                  maxLength="300"
                />
              </div>

              <div className="d-flex flex-row-reverse">
                <CButton
                  onClick={() => createCategory()}
                  className="button-tambah-category mt-3"
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

export default AddCategory;
