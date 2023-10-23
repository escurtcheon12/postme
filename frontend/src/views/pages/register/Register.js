import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert,
} from "@coreui/react";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import "../../../assets/css/register.css";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";

const Register = () => {
  const history = useHistory();
  const [errMessage, setErrMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      re_password: "",
    },
    onSubmit: async (values) => {
      try {
        const data = await axios.post(
          `${process.env.REACT_APP_BE_URL_PORT}/api/auth/register`,
          values
        );

        if (data.data.status === "success") history.push("/login");
      } catch (err) {
        setErrMessage(err.response.data.message);
      }
    },
  });

  return (
    <div className="c-app c-default-layout flex-row align-items-center bg-container-register">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {errMessage && <CAlert color="danger">{errMessage}</CAlert>}
                <CForm>
                  <div className="d-flex justify-content-center mb-4">
                    <div className="logo-register"></div>
                  </div>
                  <h3 className="text-muted mb-3 text-center">Register</h3>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="text"
                      name="username"
                      placeholder="Username"
                      autoComplete="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      minLength="6"
                      maxLength="30"
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      values={formik.values.email}
                      onChange={formik.handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      minLength="6"
                      maxLength="20"
                      values={formik.values.password}
                      onChange={formik.handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      name="re_password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      minLength="6"
                      maxLength="20"
                      values={formik.values.re_password}
                      onChange={formik.handleChange}
                      required
                    />
                  </CInputGroup>
                  <p>
                    Sudah punya akun?
                    <Link className="p-link" to="login">
                      {" "}
                      Disini
                    </Link>
                  </p>

                  <CButton
                    onClick={formik.handleSubmit}
                    className="button-register text-white"
                    block
                  >
                    Register
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
