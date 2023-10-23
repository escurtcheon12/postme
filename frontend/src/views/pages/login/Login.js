import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import "../../../assets/css/login.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { useFormik } from "formik";
import { loginSuccess } from "src/redux/action/auth_action";
import { useDispatch } from "react-redux";

const Login = () => {
  const history = useHistory();
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    onSubmit: async (values) => {
      try {
        const result = await axios.post(
          `${process.env.REACT_APP_BE_URL_PORT}/api/auth/login`,
          values
        );
        if (result.data.status === "success") {
          localStorage.setItem("user_id", result.data.data.id);
          localStorage.setItem("username", result.data.data.username);
          localStorage.setItem("user_role", result.data.data.role);
          localStorage.setItem("authorization_token", result.data.token);

          // activate remember account with 1 weeks as due
          if (values.remember) {
            localStorage.setItem(
              "expire_time",
              new Date().setDate(new Date().getDate() + 7)
            );

          // nonactivate remember account with 24 hours as due
          } else {
            localStorage.setItem(
              "expire_time",
              new Date().setDate(new Date().getDate() + 1)
            );
          }

          dispatch(loginSuccess());
          history.push("/");
        }
      } catch (err) {
        setErrMessage(err.response.data.message);
      }
    },
  });

  return (
    <div className="c-app c-default-layout flex-row align-items-center bg-container-login">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                {errMessage && <CAlert color="danger">{errMessage}</CAlert>}
                <CCardBody>
                  <CForm>
                    <div className="d-flex justify-content-center mb-4">
                      <div className="logo-login"></div>
                    </div>
                    <h3 className="text-muted text-bold text-center mb-3">
                      Login
                    </h3>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        autoComplete="username"
                        minLength="6"
                        maxLength="20"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete="current-password"
                        minLength="6"
                        maxLength="20"
                      />
                    </CInputGroup>
                    <div className="d-flex justify-content-between mb-2">
                      <div className="form-check container-checkbox-login">
                        <CInput
                          className="form-check-input checkbox-login"
                          type="checkbox"
                          value={formik.values.remember}
                          id="defaultCheck1"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="defaultCheck1"
                        >
                          Remember me
                        </label>
                      </div>
                      <div>
                        <Link
                          className="lupa-password-login p-link"
                          to="forgot-password"
                        >
                          Lupa password?
                        </Link>
                      </div>
                    </div>
                    <CRow>
                      <CButton
                        onClick={formik.handleSubmit}
                        className="px-4 base-bg-color text-white button-login"
                      >
                        Login
                      </CButton>
                    </CRow>
                    <p className="mt-2">
                      Tidak punya akun?
                      <Link className="p-link" to="register">
                        {" "}
                        Disini
                      </Link>
                    </p>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
