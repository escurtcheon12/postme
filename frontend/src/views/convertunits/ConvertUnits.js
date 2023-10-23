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
import { faAdd, faPencil } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/product.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { onInputChange } from "../components/utils";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";

const ConvertUnits = () => {
  const history = useHistory();
  const location = useLocation();
  const [dataUnits, setDataUnits] = useState([]);
  const [data, setData] = useState({
    name: "",
    conversion: 0,
  });

  let unit_conversion_id = 0;
  let product_id = 0;
  let stocks_id = 0;
  let unit_name = "";
  if (location.state) {
    const [productId, stocksId, unitConversionId] = location.state.data;

    unit_conversion_id = unitConversionId;
    product_id = productId;
    stocks_id = stocksId;
  }

  useEffect(() => {
    if (location.state) {
      setData({
        name: location.state.data[4],
        conversion: location.state.data[3],
      });
    }

    if (!product_id || product_id.length === 0) {
      history.push("/produk/list");
    }

    (async () => {
      try {
        const result = await axios.get(
          `${
            process.env.REACT_APP_BE_URL_PORT
          }/web/unit/listConversionUnitUsage?product_id=${Number(product_id)}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("authorization_token") || ""
              }`,
            },
          }
        );

        setDataUnits(result.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const createConversion = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/conversion/create`,
        {
          product_id,
          stocks_id,
          conversion: data.conversion,
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
          unit_id: 0,
          conversion: 0,
        });
        ToastDataSaveSuccess();
        history.push("/produk/list");
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  const updateConversion = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/conversion/update`,
        {
          id: unit_conversion_id,
          product_id,
          stocks_id,
          conversion: data.conversion,
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
          unit_id: 0,
          conversion: 0,
        });
        ToastDataSaveSuccess();
        history.push("/produk/list");
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <>
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

        <CCardHeader>
          {unit_conversion_id ? "Edit" : "Tambah"} Konversi
        </CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div>
                <CLabel htmlFor="name">Unit :</CLabel>
                <CInput name="name" type="text" value={data.name} readOnly />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="name">Konversi :</CLabel>
                <CInput
                  onChange={(e) =>
                    onInputChange(data, setData, e, "conversion")
                  }
                  placeholder="Isi konversi"
                  name="name"
                  type="number"
                  value={data.conversion}
                  minLength="3"
                  maxLength="20"
                  min="0"
                  step=".01"
                />
              </div>

              <div className="mt-3">
                <p>
                  <b>Perhatikan Dampak Menggunakan Konversi</b>
                  <i>
                    <br></br>
                    1. Konversi untuk masing masing unit akan menyesuaikan satu sama lain.
                    <br></br>
                    2. Rumus konversi adalah (total stok yang unit pilih / konversi yang unit dipilih * konversi yang tidak unit dipilih).
                  </i>
                </p>
              </div>

              <div className="d-flex flex-row-reverse">
                {unit_conversion_id ? (
                  <CButton
                    onClick={() => updateConversion()}
                    className="mt-3 button-add-konversi"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faPencil} />
                    Update
                  </CButton>
                ) : (
                  <CButton
                    onClick={() => createConversion()}
                    className="mt-3 button-add-konversi"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faAdd} />
                    Tambah
                  </CButton>
                )}
              </div>
            </CForm>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

export default ConvertUnits;
