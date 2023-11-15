import React, { lazy, useEffect, useState } from "react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDataTable,
} from "@coreui/react";

import ChartIncomes from "../charts/ChartIncomes.js";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";

import "../../assets/css/dashboard.css";
import { fetchFirstData } from "../components/utils.js";
import {
  convertIndonesiaTime,
  convertTimeToIndonesiaDay,
  convertTimeToIndonesiaMonth,
  dynamicSort,
  formatRupiah,
  substractDate,
} from "src/shared/utils.js";

const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));

const [orders_fields, products_fields] = [
  [
    "no",
    "namaPelanggan",
    "diskon",
    "metodePembayaran",
    "nominalYangDibayarkan",
    "nominalYangKurang",
    "diBuat",
  ],
  ["no", "namaProduk", "totalItemYangDiBeli"],
];

const Dashboard = () => {
  const [dataNewOrders, setDataNewOrders] = useState([]);
  const [dataProductsBestSeller, setDataProductBestSeller] = useState([]);
  const [selectFilter, setSelectFilter] = useState("Day");
  const [dataProducts, setDataProducts] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [dataIncomes, setDataIncomes] = useState([]);
  const [dataDebts, setDataDebts] = useState([]);
  const [dataCustomers, setDataCustomers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data_new_orders = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/orders/list-new-orders?status=${selectFilter}`
        );

        const data_bestsellers = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/list-bestseller?status=${selectFilter}`
        );

        const data_total_orders = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/orders/total-orders?status=${selectFilter}`
        );

        const data_total_income = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/orders/total-nominal-orders?status=${selectFilter}`
        );

        const data_total_debt = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/orders/total-debt-orders?status=${selectFilter}`
        );

        const data_total_customers = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/customers/total-customers?status=${selectFilter}`
        );

        const data_total_products = fetchFirstData(
          `${process.env.REACT_APP_BE_URL_PORT}/web/products/total-products?status=${selectFilter}`
        );

        const fetch_data = await Promise.all([
          data_new_orders,
          data_bestsellers,
          data_total_orders,
          data_total_income,
          data_total_debt,
          data_total_customers,
          data_total_products,
        ]);

        fetch_data.forEach((item, index) => {
          if (index == 0) setDataNewOrders(item.data.data);
          if (index == 1) {
            const sumCountItemSelling = Array.from(
              (item.data.data || []).reduce(
                (m, { name, count_item_selling }) =>
                  m.set(name, (m.get(name) || 0) + count_item_selling),
                new Map()
              ),
              ([name, count_item_selling]) => ({ name, count_item_selling })
            );

            setDataProductBestSeller(
              sumCountItemSelling
                ? sumCountItemSelling.filter((item, index) => index < 5)
                : []
            );
          }
          if (index == 2) setDataOrders(item.data.data);
          if (index == 3) setDataIncomes(item.data.data);
          if (index == 4) setDataDebts(item.data.data);
          if (index == 5) setDataCustomers(item.data.data);
          if (index == 6) setDataProducts(item.data.data);
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [selectFilter]);

  const conditionDataSetLogic = (
    data_process,
    select_filter,
    data,
    data_description,
    key_data
  ) => {
    let num_to_backward;

    switch (select_filter) {
      case "Month":
        num_to_backward = 11;
        break;
      case "Year":
        num_to_backward = 4;
        break;
      default:
        num_to_backward = 6;
        break;
    }

    for (let i = num_to_backward; i >= 0; i--) {
      let find_data_by_date;
      let logic_find_by_date;

      switch (select_filter) {
        case "Month":
          find_data_by_date =
            data.find(
              (item) =>
                new Date(item.createdAt).toJSON().slice(0, 7) ==
                substractDate(new Date(), i, select_filter).toJSON().slice(0, 7)
            ) || null;
          logic_find_by_date = convertTimeToIndonesiaMonth(
            substractDate(new Date(), i, select_filter).getMonth()
          );

          break;
        case "Year":
          find_data_by_date =
            data.find(
              (item) =>
                new Date(item.createdAt).toJSON().slice(0, 4) ==
                substractDate(new Date(), i, select_filter).toJSON().slice(0, 4)
            ) || null;
          logic_find_by_date = substractDate(
            new Date(),
            i,
            select_filter
          ).getFullYear();

          break;
        default:
          find_data_by_date =
            data.find(
              (item) =>
                new Date(item.createdAt).toJSON().slice(0, 10) ==
                substractDate(new Date(), i, select_filter)
                  .toJSON()
                  .slice(0, 10)
            ) || null;

          logic_find_by_date = convertTimeToIndonesiaDay(
            substractDate(new Date(), i),
            select_filter
          );

          break;
      }

      if (find_data_by_date) {
        data_description.push(logic_find_by_date);
        data_process.push(find_data_by_date[key_data]);
      } else {
        data_description.push(logic_find_by_date);
        data_process.push(0);
      }
    }
  };

  const operateDataSetLogic = (data, select_filter, key_data) => {
    let data_description = [];
    let data_process = [];

    if (select_filter === "Month") {
      conditionDataSetLogic(
        data_process,
        select_filter,
        data,
        data_description,
        key_data
      );

      data_description = [...data_description, data_description[0]];
      data_description.shift();

      return [data_description, data_process, data];
    } else if (select_filter === "Year") {
      conditionDataSetLogic(
        data_process,
        select_filter,
        data,
        data_description,
        key_data
      );

      return [data_description, data_process, data];
    } else {
      conditionDataSetLogic(
        data_process,
        select_filter,
        data,
        data_description,
        key_data
      );

      return [data_description, data_process, data];
    }
  };

  const maxTotalOrders =
    operateDataSetLogic(dataOrders, selectFilter, "total_orders")[1].length > 0
      ? Math.max(
          ...operateDataSetLogic(dataOrders, selectFilter, "total_orders")[1]
        )
      : 10;

  const maxTotalCustomers =
    operateDataSetLogic(dataCustomers, selectFilter, "total_customers")[1]
      .length > 0
      ? Math.max(
          ...operateDataSetLogic(
            dataCustomers,
            selectFilter,
            "total_customers"
          )[1]
        )
      : 10;

  const maxTotalDebts =
    operateDataSetLogic(dataDebts, selectFilter, "total_debts")[1].length > 0
      ? Math.max(
          ...operateDataSetLogic(dataDebts, selectFilter, "total_debts")[1]
        )
      : 10;

  const maxTotalProducts =
    operateDataSetLogic(dataProducts, selectFilter, "total_products")[1]
      .length > 0
      ? Math.max(
          ...operateDataSetLogic(
            dataProducts,
            selectFilter,
            "total_products"
          )[1]
        )
      : 10;

  return (
    <>
      <div className="mb-4">
        <h4>Dashboard</h4>
        <hr />
      </div>

      <WidgetsDropdown
        totalOrders={dataOrders}
        totalIncomes={dataIncomes}
        totalCustomers={dataCustomers}
        totalDebts={dataDebts}
      />
      <CCard className="mt-3">
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">
                Pendapatan
              </h4>
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButtonGroup className="float-right mr-3">
                {["Day", "Month", "Year"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    onClick={() => setSelectFilter(value)}
                    active={value === (selectFilter ? selectFilter : "Day")}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <ChartIncomes
            data={
              operateDataSetLogic(dataIncomes, selectFilter, "total_incomes")[1]
            }
            data_description={
              operateDataSetLogic(dataIncomes, selectFilter, "total_incomes")[0]
            }
            style={{ height: "300px", marginTop: "40px" }}
          />
        </CCardBody>
      </CCard>

      <CRow>
        <CCol lg="6">
          <CCard>
            <CCardHeader>Penjualan</CCardHeader>
            <CCardBody>
              <CChartLine
                style={{ height: "100%", marginTop: "10px" }}
                datasets={[
                  {
                    label: "Total",
                    backgroundColor: "#2f8fe9",
                    data: operateDataSetLogic(
                      dataOrders,
                      selectFilter,
                      "total_orders"
                    )[1],
                  },
                ]}
                labels={
                  operateDataSetLogic(
                    dataOrders,
                    selectFilter,
                    "total_orders"
                  )[0]
                }
                options={{
                  tooltips: {
                    enabled: true,
                  },
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          drawOnChartArea: false,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          stepSize: Math.ceil(maxTotalOrders / 4),
                          max: (maxTotalOrders || 1) * 1.5,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg="6">
          <CCard>
            <CCardHeader>Pelanggan</CCardHeader>
            <CCardBody>
              <CChartBar
                style={{ height: "100%", marginTop: "10px" }}
                datasets={[
                  {
                    label: "Total",
                    backgroundColor: "#2f8fe9",
                    data: operateDataSetLogic(
                      dataCustomers,
                      selectFilter,
                      "total_customers"
                    )[1],
                  },
                ]}
                labels={
                  operateDataSetLogic(
                    dataCustomers,
                    selectFilter,
                    "total_customers"
                  )[0]
                }
                options={{
                  tooltips: {
                    enabled: true,
                  },
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          drawOnChartArea: false,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          stepSize: Math.ceil(maxTotalCustomers / 4),
                          max: maxTotalCustomers * 1.5,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol lg="6">
          <CCard>
            <CCardHeader>Utang</CCardHeader>
            <CCardBody>
              <CChartBar
                style={{ height: "100%", marginTop: "10px" }}
                datasets={[
                  {
                    label: "Total",
                    backgroundColor: "#2f8fe9",
                    data: operateDataSetLogic(
                      dataDebts,
                      selectFilter,
                      "total_debts"
                    )[1],
                  },
                ]}
                labels={
                  operateDataSetLogic(dataDebts, selectFilter, "total_debts")[0]
                }
                options={{
                  tooltips: {
                    enabled: true,
                  },
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          drawOnChartArea: false,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          stepSize: Math.ceil(maxTotalDebts / 4),
                          max: maxTotalDebts * 1.5,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg="6">
          <CCard>
            <CCardHeader>Produk</CCardHeader>

            <CCardBody>
              <CChartLine
                style={{ height: "100%", marginTop: "10px" }}
                datasets={[
                  {
                    label: "Total",
                    backgroundColor: "#2f8fe9",
                    data: operateDataSetLogic(
                      dataProducts,
                      selectFilter,
                      "total_products"
                    )[1],
                  },
                ]}
                labels={
                  operateDataSetLogic(
                    dataProducts,
                    selectFilter,
                    "total_products"
                  )[0]
                }
                options={{
                  tooltips: {
                    enabled: true,
                  },
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          drawOnChartArea: false,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          stepSize: Math.ceil(maxTotalProducts / 4),
                          max: (maxTotalProducts || 1) * 1.5,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol lg="6">
          <CCard>
            <CCardHeader>Transaksi terbaru</CCardHeader>
            <CCardBody>
              <CDataTable
                items={dataNewOrders}
                fields={orders_fields}
                itemsPerPage={5}
                pagination
                scopedSlots={{
                  no: (item, index) => (
                    <td>
                      <p>{index + 1}</p>
                    </td>
                  ),
                  namaPelanggan: (item) => (
                    <td>
                      <p>{item.name || "Unknown"}</p>
                    </td>
                  ),
                  diskon: (item) => (
                    <td>
                      <p>{item.discount}</p>
                    </td>
                  ),
                  metodePembayaran: (item) => (
                    <td>
                      <p>{item.method}</p>
                    </td>
                  ),
                  nominalYangDibayarkan: (item) => (
                    <td>
                      <p>{formatRupiah(item.paid_nominal)}</p>
                    </td>
                  ),
                  nominalYangKurang: (item) => (
                    <td>
                      <p>{formatRupiah(item.less_nominal)}</p>
                    </td>
                  ),
                  diBuat: (item) => {
                    return (
                      <td>
                        <p>{convertIndonesiaTime(item.createdAt)}</p>
                      </td>
                    );
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg="6">
          <CCard>
            <CCardHeader>Produk paling terfavorit</CCardHeader>
            <CCardBody>
              <CDataTable
                items={
                  dataProductsBestSeller.sort(
                    dynamicSort("count_item_selling")
                  ) || []
                }
                fields={products_fields}
                itemsPerPage={5}
                pagination
                scopedSlots={{
                  no: (item, index) => (
                    <td>
                      <p>{index + 1}</p>
                    </td>
                  ),
                  namaProduk: (item) => (
                    <td>
                      <p>{item.name}</p>
                    </td>
                  ),
                  totalItemYangDiBeli: (item) => (
                    <td>
                      <p>{item.count_item_selling}</p>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
