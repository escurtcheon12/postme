import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import "../../assets/css/dashboard.css";
import { formatRupiah } from "src/shared/utils";

const sumTotal = (arr = [], key) => {
  const result = arr.reduce((total, item) => {
    return Number(total) + Number(item[key]);
  }, 0);

  return result;
};

const headerStyles = {
  // whiteSpace: 'pre-wrap',
  // wordWrap: 'break-word',
  wordBreak: "break-all",
};

const WidgetsDropdown = ({
  totalOrders,
  totalIncomes,
  totalDebts,
  totalCustomers,
}) => {
  return (
    <CRow>
      <CCol className="mt-2" sm="6" lg="3">
        <CWidgetDropdown
          className="widget-dashboard"
          color="gradient-info"
          header={
            <span style={headerStyles}>
              {sumTotal(totalOrders, "total_orders")}
            </span>
          }
          text="Penjualan"
        >
          <CDropdown>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Action</CDropdownItem>
              <CDropdownItem>Another action</CDropdownItem>
              <CDropdownItem>Something else here...</CDropdownItem>
              <CDropdownItem disabled>Disabled action</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>

      <CCol className="mt-2" sm="6" lg="3">
        <CWidgetDropdown
          className="widget-dashboard"
          color="gradient-info"
          header={
            <span style={headerStyles}>
              {formatRupiah(sumTotal(totalIncomes, "total_incomes"), 1)}
            </span>
          }
          text="Pendapatan"
        ></CWidgetDropdown>
      </CCol>

      <CCol className="mt-2" sm="6" lg="3">
        <CWidgetDropdown
          className="widget-dashboard"
          color="gradient-info"
          header={
            <span style={headerStyles}>
              {sumTotal(totalDebts, "total_debts")}
            </span>
          }
          text="Utang"
        >
          <CDropdown>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Action</CDropdownItem>
              <CDropdownItem>Another action</CDropdownItem>
              <CDropdownItem>Something else here...</CDropdownItem>
              <CDropdownItem disabled>Disabled action</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>

      <CCol className="mt-2" sm="6" lg="3">
        <CWidgetDropdown
          className="widget-dashboard"
          color="gradient-info"
          header={
            <span style={headerStyles}>
              {sumTotal(totalCustomers, "total_customers")}
            </span>
          }
          text="Pelanggan"
        >
          <CDropdown>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <CDropdownItem>Action</CDropdownItem>
              <CDropdownItem>Another action</CDropdownItem>
              <CDropdownItem>Something else here...</CDropdownItem>
              <CDropdownItem disabled>Disabled action</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CWidgetDropdown>
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
