import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CDataTable,
  CModalFooter,
} from "@coreui/react";
import {
  faAdd,
  faCheck,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import {
  ToastDataDeleteFailed,
  ToastDataDeleteSuccess,
  ToastDataSaveFailed,
  ToastDataUpdateFailed,
  ToastDataUpdateSuccess,
} from "../components/toastify";

const fields = ["no", "namaUnit", "konversi" /*, "mainConversion",*/, "action"];

const ModalDetailConversion = ({
  modal,
  closeModal,
  productId,
  stocksId,
  selectParentUnitId,
  dataUnit,
}) => {
  const history = useHistory();
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [event, setEvent] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (productId) {
      (async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BE_URL_PORT}/web/conversion/listByProductId?productId=${productId}`,
            {
              headers: {
                Authorization: `Bearer ${
                  localStorage.getItem("authorization_token") || ""
                }`,
              },
            }
          )
          .then((res) => {
            setData(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [productId, deleteStatus, event]);

  const deleteProductConversion = async (id, stock_id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/conversion/delete`,
        { id, stocks_id: stock_id },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("authorization_token") || ""
            }`,
          },
        }
      )
      .then((res) => {
        ToastDataDeleteSuccess();
        setDeleteStatus(!deleteStatus);
      })
      .catch((err) => {
        ToastDataDeleteFailed(err.response.data.message);
        console.log(err);
      });
  };

  // const updateMainConversionChanges = async (id) => {
  //   await axios
  //     .post(
  //       `${process.env.REACT_APP_BE_URL_PORT}/web/conversion/update-main-conversion`,
  //       { id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${
  //             localStorage.getItem("authorization_token") || ""
  //           }`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       ToastDataUpdateSuccess();
  //       setEvent(!event);
  //     })
  //     .catch((err) => {
  //       ToastDataUpdateFailed(err.response.data.message);
  //       console.log(err);
  //     });
  // };

  const redirectInputConversion = async (
    statusEvent,
    unitConversionId = 0,
    selectProductId = 0,
    uniConversion,
    unitId
  ) => {
    console.log("result", dataUnit.find((item) => item.id == unitId)?.name);
    if (statusEvent === "edit") {
      history.push({
        pathname: "/produk/konversi-unit",
        state: {
          data: [
            selectProductId || 0,
            stocksId || 0,
            unitConversionId,
            uniConversion,
            dataUnit.find((item) => item.id == unitId)?.name,
          ],
        },
      });
    } else {
      if (data.length == 0) {
        await axios
          .post(
            `${process.env.REACT_APP_BE_URL_PORT}/web/conversion/create`,
            {
              product_id: productId,
              stocks_id: stocksId,
              conversion: 1,
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
            ToastDataDeleteSuccess();
            setEvent(!event);
            closeModal();
          })
          .catch((err) => {
            ToastDataSaveFailed(err.response.data.message);
            console.log(err);
          });
      } else {
        history.push({
          pathname: "/produk/konversi-unit",
          state: {
            data: [
              productId || 0,
              stocksId || 0,
              unitConversionId,
              uniConversion,
              dataUnit.find((item) => item.id == unitId)?.name,
            ],
          },
        });
      }
    }
  };

  return (
    <CModal show={modal} onClose={closeModal} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>List Konversi Unit</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="d-flex mb-2 flex-row-reverse">
          <CButton
            className="button-add-konversi"
            onClick={() =>
              redirectInputConversion("add", 0, 0, 0, selectParentUnitId)
            }
          >
            <FontAwesomeIcon className="mr-2" icon={faAdd} />
            Tambah
          </CButton>
        </div>

        <CDataTable
          items={data}
          fields={fields}
          itemsPerPage={5}
          pagination
          scopedSlots={{
            no: (item, index) => (
              <td>
                <p>{index + 1}</p>
              </td>
            ),
            namaUnit: (item) => (
              <td>
                <p>{item.unit_name}</p>
              </td>
            ),
            konversi: (item) => (
              <td>
                <p>{item.conversion}</p>
              </td>
            ),
            // mainConversion: (item) => {
            //   if (item.status == 1) {
            //     return (
            //       <td>
            //         <p>
            //           <CButton className="button-edit-conversion text-white mr-2">
            //             <FontAwesomeIcon icon={faCheck} />
            //           </CButton>
            //         </p>
            //       </td>
            //     );
            //   } else {
            //     return (
            //       <td>
            //         <p>
            //           <CButton
            //             onClick={() => updateMainConversionChanges(item.id)}
            //             color="danger"
            //             className=" text-white mr-2"
            //           >
            //             <FontAwesomeIcon icon={faCheck} />
            //           </CButton>
            //         </p>
            //       </td>
            //     );
            //   }
            // },
            action: (item, index) => {
              if (item.status == 0 || data.length == 1) {
                return (
                  <td>
                    <div className="action-input-users">
                      <CButton
                        onClick={() =>
                          redirectInputConversion(
                            "edit",
                            item.id,
                            item.product_id,
                            item.conversion,
                            item.unit_id
                          )
                        }
                        className="button-edit-conversion text-white mr-2"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </CButton>
                      <CButton
                        onClick={() =>
                          deleteProductConversion(item.id, item.stock_id)
                        }
                        color="danger"
                        className="button-delete-conversion"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </CButton>
                    </div>
                  </td>
                );
              } else {
                return (
                  <td>
                    <div className="action-input-users">
                      <CButton
                        onClick={() =>
                          redirectInputConversion(
                            "edit",
                            item.id,
                            item.product_id,
                            item.conversion,
                            item.unit_id
                          )
                        }
                        className="button-edit-conversion text-white mr-2"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </CButton>
                    </div>
                  </td>
                );
              }
            },
          }}
        />
      </CModalBody>
      <CModalFooter>
        <div className="d-flex justify-content-left w-100">
          <p className="text-left">
            <b>Cara menggunakan konversi:</b>
            <br></br>
            1. Pastikan membuat produk baru dengan nama yang dan pasti unit nya
            berbeda-beda.
            <br></br>
            2. Ketika konversi di delete maka stok yang terikat akan hilang
            kecuali konversi yang pertama.
          </p>
        </div>
      </CModalFooter>
    </CModal>
  );
};

export default ModalDetailConversion;
