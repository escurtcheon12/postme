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
import { faAdd, faSave } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/units.css";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom/cjs/react-router-dom";

import { ToastContainer } from "react-toastify";

import {
  ToastDataSaveSuccess,
  ToastDataSaveFailed,
} from "../components/toastify";
import { fetchFirstData, onInputChange } from "../components/utils";

const InputOpnameProcess = () => {
  const history = useHistory();
  const location = useLocation();
  let status_input_opname_process = location.state ? location.state.data : {};
  const [dataProduct, setDataProduct] = useState([]);
  const [data, setData] = useState({
    id: location.state?.data.id || 0,
    stock_id: location.state?.data.stock_id || 0,
    stock_physique: location.state?.data.stock_physique || 0,
    description: location.state?.data.description || "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data_products = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/list-detail-stocks`,
          ""
        );

        const fetch_data = await Promise.all([data_products]);

        fetch_data.forEach((item, index) => {
          if (index === 0) {
            const data_exists =
              Object.keys(status_input_opname_process).length > 0
                ? status_input_opname_process.data.map(
                    (item) => item.product_name
                  )
                : [];

            const data = item.data.data.filter(
              (item) => !data_exists.includes(item.name)
            );

            setDataProduct(data);
          }
        });
      } catch (err) {
        console.log("err", err);
      }
    })();
  }, [data]);

  const data_select_product =
    dataProduct.find((item) => item.stock_id == data.stock_id) || {};

  const createStockOpname = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/stock-opnames/create`,
        {
          stock_physique: data.stock_physique,
          description: data.description,
          stock_id: data.stock_id,
          opname_id: status_input_opname_process.opname_id || 0,
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
          id: 0,
          stock_id: 0,
          stock_physique: 0,
          description: "",
        });
        history.push("/stok/opname");
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  const updateStockOpname = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/stock-opnames/update`,
        {
          id: data.id,
          stock_physique: data.stock_physique,
          description: data.description,
          stock_id: data.stock_id,
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
          id: 0,
          stock_id: 0,
          stock_physique: 0,
          description: "",
        });
        history.push("/stok/opname");
      })
      .catch((err) => {
        ToastDataSaveFailed(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <>
      <div className="mb-4">
        <h4>Stok</h4>
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

        <CCardHeader>
          {Object.keys(status_input_opname_process).length > 0 &&
          status_input_opname_process.status_edit == 1
            ? "Edit "
            : "Tambah "}
          Proses Opname
        </CCardHeader>
        <CCardBody>
          <div>
            <CForm>
              <div>
                <CLabel htmlFor="name">Nama Produk :</CLabel>
                <CSelect
                  onChange={(e) => onInputChange(data, setData, e, "stock_id")}
                  value={data.stock_id}
                  custom
                  name="product_name"
                  id="product_name"
                >
                  <option selected value={0}>
                    Pilih Produk
                  </option>
                  {(dataProduct || []).map((item, index) => {
                    return (
                      <option key={index} value={item.stock_id}>
                        {item.name} ( {item.unit_name} )
                      </option>
                    );
                  })}
                </CSelect>
              </div>

              <div className="mt-2">
                <CLabel htmlFor="stock_system">Stok Sistem :</CLabel>
                <CInput
                  value={
                    Object.values(data_select_product).length > 0
                      ? data_select_product.stock_now
                      : 0
                  }
                  placeholder="Stok"
                  name="stock_system"
                  type="number"
                  min="0"
                  readOnly
                />
              </div>

              <div className="mt-2">
                <CLabel htmlFor="stock_physique">Stok Fisik :</CLabel>
                <CInput
                  onChange={(e) =>
                    onInputChange(data, setData, e, "stock_physique")
                  }
                  value={data.stock_physique}
                  placeholder="Stok"
                  name="stock_physique"
                  type="number"
                  min="0"
                />
              </div>

              <div className="mt-3">
                <CLabel htmlFor="description">Deskripsi :</CLabel>
                <CTextarea
                  onChange={(e) =>
                    onInputChange(data, setData, e, "description")
                  }
                  placeholder="Isi deskripsi"
                  name="description"
                  type="text"
                  value={data.description}
                  rows={5}
                  minLength="3"
                  maxLength="300"
                />
              </div>

              <div className="d-flex flex-row-reverse">
                {Object.keys(status_input_opname_process).length > 0 &&
                status_input_opname_process.status_edit == 1 ? (
                  <CButton
                    onClick={() => updateStockOpname()}
                    className="button-tambah-unit mt-3"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faSave} />
                    Save
                  </CButton>
                ) : (
                  <CButton
                    onClick={() => createStockOpname()}
                    className="button-tambah-unit mt-3"
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

export default InputOpnameProcess;
