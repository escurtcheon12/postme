import {
  CButton,
  CCard,
  CInput,
  CImg,
  CSelect,
  CRow,
  CCol,
  CCardBody,
  CInputGroup,
  CInputCheckbox,
  CLabel,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalHeader,
  CInputFile,
  CCardHeader,
} from "@coreui/react";
import {
  faArrowRightArrowLeft,
  faBoxes,
  faCancel,
  faFileExport,
  faList12,
  faMoneyBill,
  faPencil,
  faSave,
  faSearch,
  faSitemap,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-multi-carousel/lib/styles.css";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { fetchFirstData, onInputChange } from "../components/utils";
import {
  ToastDataDeleteFailed,
  ToastDataDeleteSuccess,
  ToastDataSaveFailed,
  ToastDataSaveSuccess,
  ToastDataUpdateFailed,
  ToastDataUpdateSuccess,
} from "../components/toastify";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";
import { formatRupiah } from "src/shared/utils";
import ModalDetailConversion from "./ModalDetailConversion";

let headers = [
  { label: "Nama Produk", key: "product_name" },
  { label: "Nama Kategori", key: "category_name" },
  { label: "Unit", key: "unit_name" },
  { label: "Harga Pokok", key: "capital_price" },
  { label: "Harga Jual", key: "selling_price" },
  { label: "Stok", key: "stock_now" },
  // { label: "Stok Status", key: "stock_status" },
  { label: "Tanggal di buat", key: "createdAt" },
];

const ListProduct = () => {
  const [dataUnit, setDataUnit] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [statusDelete, setStatusDelete] = useState(false);
  const [statusEdit, setStatusEdit] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [filterList, setFilterList] = useState({
    search: "",
    category_id: "",
    rating: "",
  });
  const [modalConversion, setModalConversion] = useState(false);
  const [modalImg, setModalImg] = useState(false);
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusPagination, setStatusPagination] = useState(false);
  
  const [data, setData] = useState({
    id: 0,
    stocks_id: 0,
    name: "",
    category_id: 0,
    unit_id: 0,
    capital_price: 0,
    selling_price: 0,
    stock_now: 0,
    // stock_status: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const data_products = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/list?search=${
            filterList.search
          }${filterList.category_id && `&category=${filterList.category_id}`}${
            filterList.rating && `&rating=${filterList.rating}`
          }`
        );
        const data_unit = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/unit/list`
        );

        const data_category = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/categories/list`
        );

        const fetch_data = await Promise.all([
          data_products,
          data_unit,
          data_category,
        ]);

        fetch_data.forEach((item, index) => {
          if (index == 0) {
            setDataProduct(item.data.data);

            let data = item.data.data;
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(data.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(data.length / itemsPerPage));
          } else if (index == 1) {
            setDataUnit(item.data.data);
          }
          else if (index == 2) setDataCategory(item.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [
    statusSearch,
    filterList.category_id,
    filterList.rating,
    statusEdit,
    statusDelete,
    statusPagination,
    data.unit_id
  ]);

  const handleClickPagination = (e) => {
    const newOffset = (e.selected * itemsPerPage) % dataProduct.length;
    setItemOffset(newOffset);
    setStatusPagination(!statusPagination);
  };

  const showGridRight = (status) => {
    const current_status = status === "show" ? "after" : "before";
    const changes_status = current_status !== "after" ? "after" : "before";

    const square_right_product = document.querySelector(".square-right-list");
    const card_product = document.querySelectorAll(
      `.card-product-list-${changes_status}`
    );

    const square_left_order = document.querySelector(
      `.square-left-list-${changes_status}`
    );

    if (card_product.length > 0 || square_left_order > 0) {
      card_product.forEach((item, index) => {
        item.classList.remove(`card-product-list-${changes_status}`);
        item.classList.add(`card-product-list-${current_status}`);
      });

      square_left_order.classList.remove(`square-left-list-${changes_status}`);
      square_left_order.classList.add(`square-left-list-${current_status}`);

      if (current_status === "after") {
        square_right_product.classList.remove("d-none");
      } else {
        square_right_product.classList.add("d-none");
      }
    }
  };

  const showBarUpdate = (item) => {
    setData({
      id: item.id,
      stocks_id: item.stocks_id,
      name: item.product_name,
      category_id: item.category_id,
      unit_id: item.unit_id,
      capital_price: item.capital_price,
      selling_price: item.selling_price,
      stock_now: item.stock_now,
      // stock_status: item.stock_status,
    });
    setImage(item.image);
    showGridRight("show");
  };

  const cancelSpaceProduct = () => {
    setData({
      id: 0,
      stocks_id: 0,
      name: "",
      category_id: 0,
      unit_id: 0,
      capital_price: 0,
      selling_price: 0,
      stock_now: 0,
      // stock_status: 0,
    });
    setImage("");
    showGridRight("close");
  };

  const updateDataProductWithImage = async () => {
    if (
      file.name.includes("jpg") ||
      file.name.includes("png") ||
      file.name.includes("jpeg")
    ) {
      let formData = new FormData();
      for (const property in data) {
        if (
          property !== "id" &&
          property !== "stock_now"
          // &&
          // property !== "stock_status"
        )
          formData.append(`${property}`, data[property]);
      }
      formData.append("image", file);

      await axios
        .post(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/update/${data.id}`,
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
          cancelSpaceProduct();
          ToastDataSaveSuccess();
        })
        .catch((err) => {
          ToastDataSaveFailed(err.response.data.message);
          console.log(err);
        });
    } else {
      ToastDataSaveFailed();
    }
  };

  const updateProduct = async () => {
    if (
      !data.name &&
      data.category_id == 0 &&
      data.unit_id == 0 &&
      !data.capital_price &&
      !data.selling_price
    ) {
      return ToastDataSaveFailed(
        "Nama produk, kategori, unit, harga pokok, dan harga jual harus di isi"
      );
    }

    if (file !== null) {
      await updateDataProductWithImage();
    } else {
      await axios
        .post(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/update/${data.id}`,
          {
            id: data.id,
            name: data.name,
            category_id: data.category_id,
            unit_id: data.unit_id,
            capital_price: data.capital_price,
            selling_price: data.selling_price,
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
          cancelSpaceProduct();
          ToastDataUpdateSuccess();
        })
        .catch((err) => {
          ToastDataUpdateFailed(err.response.data.message);
          console.log(err);
        });
    }

    // await axios
    //   .post(
    //     `${process.env.REACT_APP_BE_URL_PORT}/web/stocks/updateByProductId/${data.id}`,
    //     {
    //       status: data.stock_status,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${
    //           localStorage.getItem("authorization_token") || ""
    //         }`,
    //       },
    //     }
    //   )
    //   .catch((err) => {
    //     ToastDataUpdateFailed(err.response.data.message);
    //     console.log(err);
    //   });

    setStatusEdit(!statusEdit);
  };

  const deleteProduct = async (id) => {
    await axios
      .post(
        `${process.env.REACT_APP_BE_URL_PORT}/web/products/delete/${id}`,
        {},
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
        setStatusDelete(!statusDelete);
      })
      .catch((err) => {
        ToastDataDeleteFailed(err.response.data.message);
        console.log(err);
      });
  };

  const openModalImg = (image) => {
    setModalImg(true);
    setImage(image);
  };

  const closeModalImg = () => {
    setModalImg(false);
    setImage("");
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  const showInputStockBar = (stock_now) => {
    // if (stock_status) {
    //   return (
    //     <CInput
    //       className="input-stock-list"
    //       value={stock_now}
    //       type="number"
    //       readOnly
    //     />
    //   );
    // } else {
    //   return (
    //     <CInput className="input-stock-list" type="number" value="" readOnly />
    //   );
    // }

    return (
      <CInput
        className="input-stock-list"
        value={stock_now}
        type="number"
        readOnly
      />
    );
  };

  const showInputStock = () => {
    // if (data.stock_status) {
    return (
      <div className="mt-3">
        <CInputGroup className="input-prepend">
          <CInputGroupPrepend>
            <CInputGroupText>
              <FontAwesomeIcon icon={faSitemap} />
            </CInputGroupText>
          </CInputGroupPrepend>
          <CInput
            id="prependedInput"
            size="16"
            type="number"
            readOnly
            value={data.stock_now}
            placeholder="Harga Jual"
          />
        </CInputGroup>
      </div>
    );
    // }
  };

  const closeModalConversion = () => {
    setModalConversion(false);
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

      <CModal show={modalImg} onClose={closeModalImg}>
        <CModalHeader closeButton></CModalHeader>
        <div className="p-4">
          <CImg
            className="modal-img-product"
            src={process.env.REACT_APP_BE_URL_PORT + "/public/uploads/" + image}
            height={100}
          />
        </div>
      </CModal>

      <ModalDetailConversion
        modal={modalConversion}
        closeModal={closeModalConversion}
        productId={data.id}
        stocksId={data.stocks_id}
        selectParentUnitId={data.unit_id}
        dataUnit={dataUnit}
      />

      <div className="mb-4">
        <h4>Produk</h4>
        <hr />
      </div>

      <div className="d-flex">
        <div className="square-left-list-before">
          <CCard>
            <CCardHeader>List Produk</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <CInput
                    placeholder="Search Produk"
                    onChange={(e) =>
                      onInputChange(filterList, setFilterList, e, "search")
                    }
                    name="search"
                    type="text"
                  ></CInput>
                  <CButton
                    onClick={() => setStatusSearch(!statusSearch)}
                    className="btn button-search-product"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>

                <CSVLink
                  filename="list-product-postme"
                  className="text-white"
                  data={dataProduct}
                  headers={headers}
                >
                  <div>
                    <CButton className="button-csv-product">
                      <FontAwesomeIcon className="mr-2" icon={faFileExport} />
                      CSV
                    </CButton>
                  </div>
                </CSVLink>
              </div>
            </CCardBody>
          </CCard>

          <CCard>
            <CRow className="p-3">
              <CCol className="mb-2" lg={6}>
                <div>
                  <CSelect
                    onChange={(e) =>
                      onInputChange(filterList, setFilterList, e, "category_id")
                    }
                    value={filterList.category_id}
                    custom
                    name="all_category"
                    id="all_category"
                  >
                    <option value="">Semua Kategori</option>
                    {(dataCategory || []).map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </CSelect>
                </div>
              </CCol>
              <CCol lg={6}>
                <div>
                  <CSelect
                    onChange={(e) =>
                      onInputChange(filterList, setFilterList, e, "rating")
                    }
                    value={filterList.rating}
                    custom
                    name="rating"
                    id="rating"
                  >
                    <option value="">Semua Produk</option>
                    <option value="bestseller">Produk Paling Terfavorit</option>
                    <option value="cheap">Produk Paling Murah</option>
                    <option value="expensive">Produk Paling Mahal</option>
                  </CSelect>
                </div>
              </CCol>
            </CRow>
          </CCard>

          <div className="d-flex flex-wrap">
            {(currentItems || []).map((item, index) => {
              return (
                <CCard
                  key={index}
                  className="card-product-list-before p-3 ml-2 mr-2"
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex mr-2">
                      <CButton
                        onClick={() => openModalImg(item.image)}
                        className="button-square-product-list"
                      >
                        <CImg
                          className="img-square-product-list ml-3 mr-2"
                          src={
                            process.env.REACT_APP_BE_URL_PORT +
                            "/public/uploads/" +
                            item.image
                          }
                          height={60}
                        />
                      </CButton>

                      <div className="ml-2 w-50">
                        <h5 className="font-weight-bold">
                          {item.product_name} ({item.unit_name})
                        </h5>
                        <p>{formatRupiah(item.selling_price)}</p>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex flex-row-reverse">
                        <CButton
                          onClick={() => deleteProduct(item.id)}
                          color="danger"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </CButton>

                        <CButton
                          className="mr-2 button-edit-product"
                          onClick={() => showBarUpdate(item)}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </CButton>
                      </div>

                      <div className="d-flex mt-2 list-square-right-product-list flex-row-reverse">
                        <div>
                          {/* {showInputStockBar(item.stock_status, item.stock_now)} */}
                          {showInputStockBar(item.stock_now)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CCard>
              );
            })}
          </div>

          <div className="d-flex justify-content-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handleClickPagination}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="Previous"
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
        <div className="ml-3 square-right-list d-none">
          <CCard>
            <CCardBody>
              <div className="container-img-product d-flex justify-content-center align-items-center">
                <div>
                  <div className="justify-content-center p-2">
                    {image &&
                    image.includes(process.env.REACT_APP_FE_URL_PORT) ? (
                      <CImg
                        className="img-square-product-list ml-3 mr-2"
                        src={image}
                        height={150}
                      />
                    ) : (
                      <CImg
                        className="img-square-product-list ml-3 mr-2"
                        src={
                          process.env.REACT_APP_BE_URL_PORT +
                          "/public/uploads/" +
                          image
                        }
                        height={150}
                      />
                    )}
                  </div>

                  <div className="d-flex justify-content-center text-center align-items-center mt-1">
                    <CInputFile
                      id="file-input"
                      name="file-input"
                      onChange={(e) => handleFile(e)}
                    />
                  </div>
                  <p className="mt-2">Max 5MB</p>
                </div>
              </div>
              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faSitemap} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    size="16"
                    type="text"
                    value={data.name}
                    onChange={(e) => onInputChange(data, setData, e, "name")}
                    placeholder="Nama produk"
                    minLength="3"
                    maxLength="20"
                  />
                </CInputGroup>
              </div>
              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faMoneyBill} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    size="16"
                    type="number"
                    value={data.capital_price}
                    minLength={0}
                    onChange={(e) =>
                      onInputChange(data, setData, e, "capital_price")
                    }
                    placeholder="Harga Pokok"
                  />
                </CInputGroup>
              </div>
              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faMoneyBill} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    size="16"
                    type="number"
                    value={data.selling_price}
                    minLength={0}
                    onChange={(e) =>
                      onInputChange(data, setData, e, "selling_price")
                    }
                    placeholder="Harga Jual"
                  />
                </CInputGroup>
              </div>
              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faList12} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CSelect
                    onChange={(e) =>
                      onInputChange(data, setData, e, "category_id")
                    }
                    value={data.category_id}
                    custom
                    name="category_name"
                    id="category_name"
                  >
                    <option value={0}>Pilih Kategori</option>
                    {(dataCategory || []).map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </CSelect>
                </CInputGroup>
              </div>
              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faBoxes} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CSelect
                    onChange={(e) => onInputChange(data, setData, e, "unit_id")}
                    value={data.unit_id}
                    custom
                    name="unit_name"
                    id="unit_name"
                  >
                    <option value={0}>Pilih Unit</option>
                    {(dataUnit || []).map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </CSelect>
                </CInputGroup>
              </div>
              {/* <div>
                <div className="d-flex mt-2 flex-row-reverse">
                  <CInputCheckbox
                    id="checkbox"
                    name="checkbox"
                    value={data.stock_status}
                    checked={data.stock_status}
                    type="checkbox"
                    onChange={(e) => {
                      setData({
                        ...data,
                        stock_status: e.target.value == 1 ? 0 : 1,
                      });
                    }}
                  />
                  <CLabel className="mr-3">Pakai penggunaan stock?</CLabel>
                </div>
              </div> */}

              {showInputStock()}

              <div className="d-flex justify-content-between">
                <div className="mt-2 mr-2">
                  <CButton
                    className="button-conversion mt-2"
                    onClick={() => setModalConversion(true)}
                  >
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faArrowRightArrowLeft}
                    />
                    Konversi
                  </CButton>
                </div>

                <div className="d-flex mt-2 flex-row-reverse">
                  <CButton
                    onClick={() => cancelSpaceProduct()}
                    className="ml-2 mt-2"
                    color="danger"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faCancel} />
                    Cancel
                  </CButton>

                  <CButton
                    onClick={() => updateProduct()}
                    className="mt-2 button-save-product"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faSave} />
                    Save
                  </CButton>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  );
};

export default ListProduct;
