import React from "react";
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CBreadcrumbRouter,
  CCard,
  CCardBody,
  CCardHeader,
  CLink,
  CCol,
  CRow,
} from "@coreui/react";
import { DocsLink } from "src/reusable";
import { admin_routes, user_routes } from "../../../routes";

const Breadcrumbs = () => {
  const user_role = localStorage.getItem("user_role");

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            Bootstrap Breadcrumb
            <DocsLink name="CBreadcrumb" />
          </CCardHeader>
          <CCardBody>
            <h6>CBreadcrumbRouter wrapper component</h6>
            <CBreadcrumbRouter
              routes={user_role === "admin" ? admin_routes : user_routes}
            />
            <h6>Manual</h6>
            <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink>Home</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>Library</CBreadcrumbItem>
            </CBreadcrumb>
            <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink>Home</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem>
                <CLink>Library</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>Data</CBreadcrumbItem>
            </CBreadcrumb>
            <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink>Home</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem>
                <CLink>Library</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem>
                <CLink>Data</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>
                <span>Bootstrap</span>
              </CBreadcrumbItem>
            </CBreadcrumb>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Breadcrumbs;
