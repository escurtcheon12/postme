import {
  CButton,
  CCard,
  CInput,
  CImg,
  CModal,
  CModalHeader,
  CSelect,
  CRow,
  CCol,
  CCardBody,
  CInputGroup,
  CInputCheckbox,
  CLabel,
  CInputGroupPrepend,
  CInputGroupText,
  CCardHeader,
} from "@coreui/react";
import {
  faAdd,
  faCartShopping,
  faKey,
  faMoneyBill,
  faMoneyBill1,
  faSearch,
  faTrash,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/order.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-multi-carousel/lib/styles.css";
import React, { useEffect, useState } from "react";
import { fetchFirstData, onInputChange } from "../components/utils";
import ReactPaginate from "react-paginate";
import {
  addInventory,
  deleteInventory,
  increaseItem,
  deleteAllInventory,
} from "src/redux/action/cart_action";
import { useDispatch, useSelector } from "react-redux";
import ModalCheckoutOrder from "./components/ModalCheckoutOrder";
import { formatRupiah } from "src/shared/utils";

const AddOrder = () => {
  const seen = new Set();
  const [modalImg, setModalImg] = useState(false);
  const [dataNewOrders, setDataNewOrders] = useState([]);
  const [dataCustomers, setDataCustomers] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [statusSearch, setStatusSearch] = useState(false);
  const [filterList, setFilterList] = useState({
    search: "",
    category_id: "",
    rating: "",
  });
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusPagination, setStatusPagination] = useState(false);
  const globalState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [openModalCheckout, setOpenModalCheckout] = useState(false);
  const [image, setImage] = useState("");

  const [showGrid, setShowGrid] = useState(false);
  const [checkedCustomer, setCheckedCustomer] = useState(true);
  const [data, setData] = useState({
    user_id: Number(localStorage.getItem("user_id")) || 1,
    order_code:
      Object.keys(dataNewOrders).length > 0 ? dataNewOrders.id + 1 : 1,
    customers_id: 0,
    nominal_paid: 0,
    discount: 0,
    nominal_subtotal: 0,
    less_paid: 0,
    method_payment: "",
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
        const data_category = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/categories/list`
        );
        const data_customers = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/customers/list`
        );
        const data_new_orders = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/orders/list-new-orders`
        );

        const fetch_data = await Promise.all([
          data_products,
          data_category,
          data_customers,
          data_new_orders,
        ]);

        fetch_data.forEach((item, index) => {
          if (index == 0) {
            setDataProduct(item.data.data);

            let data = item.data.data;
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(data.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(data.length / itemsPerPage));
          } else if (index == 1) {
            setDataCategory(item.data.data);
          } else if (index == 2) {
            setDataCustomers(item.data.data);
          } else if (index == 3) {
            let last_data = item.data.data[item.data.data.length - 1] || [];
            setDataNewOrders(last_data);
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();

  }, [
    statusSearch,
    filterList.category_id,
    filterList.rating,
    statusPagination,
    data,
    globalState.cart_reducer,
  ]);

  const duplicateItemArrayRedux = (globalState.cart_reducer || []).filter(
    (item) => {
      const duplicate = seen.has(item.id);
      seen.add(item.id);

      return !duplicate;
    }
  );

  const handleClickPagination = (e) => {
    const newOffset = (e.selected * itemsPerPage) % dataProduct.length;
    setItemOffset(newOffset);
    setStatusPagination(!statusPagination);
  };

  const showGridRight = () => {
    const square_right_order = document.querySelector(".square-right-order");
    const card_product_order_before = document.querySelectorAll(
      ".card-product-order-before"
    );
    const square_left_order_before = document.querySelector(
      ".square-left-order-before"
    );

    if (card_product_order_before.length > 0 || square_left_order_before > 0) {
      card_product_order_before.forEach((item, index) => {
        item.classList.remove("card-product-order-before");
        item.classList.add("card-product-order-after");
      });

      square_left_order_before.classList.remove("square-left-order-before");
      square_left_order_before.classList.add("square-left-order-after");

      square_right_order.classList.remove("d-none");
    }

    setShowGrid(true);
  };

  const openModalImg = (image) => {
    setModalImg(true);
    setImage(image);
  };

  const closeModalImg = () => {
    setModalImg(false);
    setImage("");
  };

  const sumTotalChart = () => {
    const result = duplicateItemArrayRedux.reduce(
      (total, { qty, selling_price }) => {
        let sumQuantity = qty * Number(selling_price);
        return Number(total) + sumQuantity;
      },
      0
    );

    return result;
  };

  const handleDeleteCart = (item) => {
    dispatch(deleteInventory(item.id));
  };

  const handleAddChart = (item) => {
    dispatch(
      addInventory({
        id: item.id,
        name: item.product_name,
        category_id: item.category_id,
        unit_name: item.unit_name,
        unit_id: item.unit_id,
        capital_price: item.capital_price,
        selling_price: item.selling_price,
        stock_now: item.stock_now,
        // stock_status: item.stock_status,
        qty: 1,
      })
    );

    if (!showGrid) showGridRight();
  };

  const showingInputSubtotal = () => {
    if (data.discount) {
      return (
        <div className="mt-3">
          <CInputGroup className="input-prepend">
            <CInputGroupPrepend>
              <CInputGroupText>
                <FontAwesomeIcon icon={faMoneyBill1} />
              </CInputGroupText>
            </CInputGroupPrepend>
            <CInput
              id="prependedInput"
              size="16"
              type="number"
              value={sumTotalChart()}
              readOnly
            />
          </CInputGroup>
        </div>
      );
    }
  };

  const showingInputCustomer = () => {
    if (checkedCustomer) {
      return (
        <div className="d-flex mt-3">
          <CInputGroup className="input-prepend">
            <CInputGroupPrepend>
              <CInputGroupText>
                <FontAwesomeIcon icon={faUsers} />
              </CInputGroupText>
            </CInputGroupPrepend>

            <CSelect
              onChange={(e) => onInputChange(data, setData, e, "customers_id")}
              value={data.customers_id}
              custom
              name="all_customers"
              id="all_customers"
              disabled
            >
              <option value="">Pilih Pelanggan</option>
              {(dataCustomers || []).map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </CSelect>
          </CInputGroup>
        </div>
      );
    } else {
      return (
        <div className="d-flex mt-3">
          <CInputGroup className="input-prepend">
            <CInputGroupPrepend>
              <CInputGroupText>
                <FontAwesomeIcon icon={faUsers} />
              </CInputGroupText>
            </CInputGroupPrepend>

            <CSelect
              onChange={(e) => onInputChange(data, setData, e, "customers_id")}
              value={data.customers_id}
              custom
              name="all_customers"
              id="all_customers"
            >
              <option value="">Pilih Pelanggan</option>
              {(dataCustomers || []).map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </CSelect>
          </CInputGroup>
        </div>
      );
    }
  };

  return (
    <>
      <CModal show={modalImg} onClose={closeModalImg}>
        <CModalHeader closeButton></CModalHeader>
        <div className="p-4">
          <CImg
            className="modal-img-order"
            src={process.env.REACT_APP_BE_URL_PORT + "/public/uploads/" + image}
            height={100}
          />
        </div>
      </CModal>

      <ModalCheckoutOrder
        openModal={openModalCheckout}
        setOpenModal={setOpenModalCheckout}
        closeModal={setOpenModalCheckout}
        totalPaid={
          data.discount
            ? Math.round(
                sumTotalChart() - (data.discount / 100) * sumTotalChart()
              )
            : sumTotalChart()
        }
        listItemOrder={duplicateItemArrayRedux}
        dataOrder={data}
      />

      <div className="mb-4">
        <h4>Transaksi</h4>
        <hr />
      </div>

      <div className="d-flex">
        <div className="square-left-order-before">
          <CCard className="">
            <CCardHeader>Tambah Transaksi</CCardHeader>

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
                    className="btn button-search-order"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </div>
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
                  className="card-product-order-before p-3 ml-2 mr-2"
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex mr-2">
                      <CButton
                        onClick={() => openModalImg(item.image)}
                        className="button-square-product-order"
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

                    <div className="d-flex list-square-right-product-order">
                      <CInput
                        className="input-stock-order mr-2"
                        value={item.stock_now}
                        type="number"
                        readOnly
                      />

                      {globalState.cart_reducer.find(
                        (item_data_cart) => item_data_cart.id == item.id
                      ) ? (
                        <CButton
                          onClick={() => handleAddChart(item)}
                          className="btn button-add-order"
                          disabled
                        >
                          <FontAwesomeIcon icon={faAdd} />
                        </CButton>
                      ) : (
                        <CButton
                          onClick={() => handleAddChart(item)}
                          className="btn button-add-order"
                        >
                          <FontAwesomeIcon icon={faAdd} />
                        </CButton>
                      )}
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

        <div className="ml-3 square-right-order d-none">
          <CCard>
            <CCardBody>
              <div className="d-flex">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    size="16"
                    type="text"
                    value={
                      "USR-" + (Number(localStorage.getItem("user_id")) || 1)
                    }
                    onChange={(e) => onInputChange(data, setData, e, "user_id")}
                    readOnly
                  />
                </CInputGroup>
              </div>

              {/* <div className="d-flex mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faKey} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    size="16"
                    type="text"
                    value={
                      "TR-" +
                      (Object.keys(dataNewOrders).length > 0
                        ? dataNewOrders.id + 1
                        : 1)
                    }
                    onChange={(e) =>
                      onInputChange(data, setData, e, "order_code")
                    }
                    readOnly
                  />
                </CInputGroup>
              </div> */}

              {showingInputCustomer()}

              <div className="d-flex mt-2 flex-row-reverse">
                <CInputCheckbox
                  id="checkbox1"
                  name="checkbox1"
                  value={checkedCustomer}
                  onChange={() => setCheckedCustomer(!checkedCustomer)}
                />
                <CLabel className="mr-3">Pakai nama pelanggan?</CLabel>
              </div>

              {(duplicateItemArrayRedux || []).map((item, index) => {
                return (
                  <div key={index} className="d-flex mt-3">
                    <div className="container-name-order mr-2">
                      <CInput className="" value={item.name} readOnly />
                    </div>
                    <div className="container-stock-order mr-5">
                      <CInput
                        className="input-cart-stock-order"
                        type="number"
                        value={Number(item.qty)}
                        onChange={(e) => {
                          dispatch(
                            increaseItem({ ...item, qty: e.target.value })
                          );
                        }}
                        // min={0}
                      />
                    </div>
                    <div className="container-unit-order mr-2">
                      <div>
                        <CInput
                          className="input-cart-unit-order"
                          type="text"
                          value={item.unit_name}
                          // min={0}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="container-money-order mr-2">
                      <CInput
                        className="input_selling_price"
                        type="number"
                        value={Number(item.selling_price) || 0}
                        readOnly
                      />
                    </div>
                    <div>
                      <CButton
                        onClick={() => handleDeleteCart(item)}
                        className="bg-danger"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </CButton>
                    </div>
                  </div>
                );
              })}

              <hr />

              <CInputGroup className="input-prepend">
                <CInputGroupPrepend>
                  <CInputGroupText>
                    <FontAwesomeIcon icon={faMoneyBill} />
                  </CInputGroupText>
                </CInputGroupPrepend>

                <CSelect
                  value={data.method_payment}
                  onChange={(e) =>
                    onInputChange(data, setData, e, "method_payment")
                  }
                  custom
                  name="ccmonth"
                  id="ccmonth"
                >
                  <option selected value="">
                    Pilih Metode Pembayaran
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Utang">Utang</option>
                  <option value="EMoney">E-Money</option>
                </CSelect>
              </CInputGroup>

              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>%</CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    name="discount"
                    size="16"
                    type="number"
                    value={data.discount}
                    onChange={(e) =>
                      onInputChange(data, setData, e, "discount")
                    }
                    placeholder="Diskon"
                    min={0}
                  />
                </CInputGroup>
              </div>

              <hr />

              {showingInputSubtotal()}

              <div className="mt-3">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faMoneyBill1} />
                    </CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="prependedInput"
                    size="16"
                    type="number"
                    value={
                      data.discount
                        ? Math.round(
                            sumTotalChart() -
                              (data.discount / 100) * sumTotalChart()
                          )
                        : sumTotalChart()
                    }
                    readOnly
                  />
                </CInputGroup>
              </div>

              <div className="d-flex flex-row-reverse mt-3">
                <CButton
                  onClick={() => setOpenModalCheckout(true)}
                  className="btn button-checkout-order"
                >
                  <FontAwesomeIcon className="mr-2" icon={faCartShopping} />
                  Checkout
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  );
};

export default AddOrder;
