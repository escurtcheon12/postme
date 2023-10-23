import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CImg,
  CInput,
  CInputFile,
  CLabel,
  CSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/product.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { fetchFirstData, onInputChange } from "../components/utils";

const AddProduct = () => {
  const [dataCategory, setDataCategory] = useState([]);
  const [dataUnit, setDataUnit] = useState([]);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [data, setData] = useState({
    name: "",
    category_id: 0,
    unit_id: 0,
    capital_price: "",
    selling_price: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data_categories = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/categories/list`
        );

        const data_unit = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/unit/list`
        );

        const fetch_data = await Promise.all([data_categories, data_unit]);

        fetch_data.forEach((item, index) => {
          if (index == 0) {
            setDataCategory(item.data.data);
          } else if (index == 1) {
            setDataUnit(item.data.data);
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [file, image]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const createProduct = async () => {

    if (!image && file === null) {
      return ToastDataSaveFailed("Foto produk harus di upload");
    }

    if (
      !data.name ||
      data.category_id == 0 ||
      data.unit_id == 0 ||
      !data.capital_price ||
      !data.selling_price
    ) {
      return ToastDataSaveFailed(
        "Nama produk, kategori, unit, harga pokok, dan harga jual harus di isi"
      );
    }

    if (
      file.name.includes("jpg") ||
      file.name.includes("png") ||
      file.name.includes("jpeg")
    ) {
      let product_id = 0;
      let formData = new FormData();
      for (const property in data) {
        formData.append(`${property}`, data[property]);
      }
      formData.append("image", file);

      await axios
        .post(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authorization_token") || ""
              }`,
            },
          }
        )
        .then((res) => {
          product_id = res.data.data.id;

          const fileInput = document.getElementById("file-input");
          if (fileInput) {
            fileInput.value = "";
          }

          ToastDataSaveSuccess();
          setFile(null);
          setImage("");
          setData({
            name: "",
            category_id: 0,
            unit_id: 0,
            capital_price: "",
            selling_price: "",
          });
        })
        .catch((err) => {
          console.log("error", err.response.data);
          ToastDataSaveFailed(
            err.response.data.message || err.response.data.error
          );
          console.log(err);
        });

      if (product_id) {
        await axios
          .post(
            `${process.env.REACT_APP_BE_URL_PORT}/web/stocks/create`,
            {
              product_id: product_id,
              suppliers_id: 0,
              stock_now: 0,
              status: 1,
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
          })
          .catch((err) => {
            ToastDataSaveFailed(err.response.data.message);
            console.log(err);
          });
      }
    } else {
      return ToastDataSaveFailed(
        "Foto produk harus berformat jpg, jpeg, atau png"
      );
    }
  };

  return (
    <>
      <div className="mb-4">
        <h4>Produk</h4>
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

        <CCardHeader>Tambah Produk</CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div className="w-50 place-upload-add-product d-flex justify-content-center align-items-center">
                <div>
                  <div className="justify-content-center p-2">
                    {image && (
                      <CImg
                        className="img-square-product-list ml-3 mr-2"
                        src={image}
                        height={150}
                      />
                    )}
                  </div>
                  <div className="d-flex justify-content-center mt-1">
                    <CInputFile
                      id="file-input"
                      name="file-input"
                      onChange={(e) => handleFile(e)}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-2">Max 5MB</p>

              <div className="mt-3 ">
                <CLabel htmlFor="name">Nama :</CLabel>
                <CInput
                  onChange={(e) => onInputChange(data, setData, e, "name")}
                  placeholder="Isi nama produk"
                  value={data.name}
                  name="name"
                  type="text"
                  minLength="3"
                  maxLength="20"
                />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="product_name">Kategori :</CLabel>

                <CSelect
                  onChange={(e) =>
                    onInputChange(data, setData, e, "category_id")
                  }
                  value={data.category_id}
                  custom
                  name="category_name"
                  id="category_name"
                >
                  <option selected value={0}>
                    Pilih Kategori
                  </option>
                  {(dataCategory || []).map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </CSelect>
              </div>

              <div className="mt-3">
                <CLabel htmlFor="unit_name">Unit :</CLabel>

                <CSelect
                  onChange={(e) => onInputChange(data, setData, e, "unit_id")}
                  value={data.unit_id}
                  custom
                  name="unit_name"
                  id="unit_name"
                >
                  <option selected value={0}>
                    Pilih Unit
                  </option>
                  {(dataUnit || []).map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </CSelect>
              </div>

              <div className="mt-3">
                <CLabel htmlFor="capital_price">Harga Pokok :</CLabel>
                <CInput
                  onChange={(e) =>
                    onInputChange(data, setData, e, "capital_price")
                  }
                  value={data.capital_price}
                  minLength={0}
                  placeholder="Isi harga pokok"
                  name="capital_price"
                  type="number"
                />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="selling_price">Harga Jual :</CLabel>
                <CInput
                  onChange={(e) =>
                    onInputChange(data, setData, e, "selling_price")
                  }
                  value={data.selling_price}
                  minLength={0}
                  placeholder="Isi harga jual"
                  name="selling_price"
                  type="number"
                />
              </div>

              <div className="d-flex flex-row-reverse">
                <CButton
                  onClick={() => createProduct()}
                  className="button-tambah-product mt-3"
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

export default AddProduct;
