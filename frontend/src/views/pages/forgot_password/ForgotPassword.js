import React, { useEffect, useState } from "react";
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
  CRow,
  CAlert,
} from "@coreui/react";
import "../../../assets/css/login.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";

const ForgotPassword = () => {
  const history = useHistory();
  const [errMessage, setErrMessage] = useState("");
  const [dataUser, setDataUser] = useState({});
  const [statusButton, setStatusButton] = useState("");
  const [timeCountdown, setTimeCountdown] = useState(1);
  const formik = useFormik({
    initialValues: {
      username: "",
      token_number: 0,
      password: "",
      re_password: "",
    },
    onSubmit: async (values) => {
      try {
        if (statusButton === "change_password") {
          const api = `${process.env.REACT_APP_BE_URL_PORT}/api/auth/change_password/${dataUser.id}`;
          const data = await submitFunction(
            api,
            { re_password: values.re_password, password: values.password },
            "reset"
          );

          if (data.data.status === "success") {
            axios.post(
              `${process.env.REACT_APP_BE_URL_PORT}/api/auth/update-interval`,
              { id: dataUser.id, interval: 1 }
            );
            history.push("/login");
          }
        } else if (statusButton === "verify_number") {
          const api_verify = `${process.env.REACT_APP_BE_URL_PORT}/api/auth/verify`;
          const api_forgot_password = `${process.env.REACT_APP_BE_URL_PORT}/api/auth/forgot-password`;
          let interval = dataUser.interval;

          if (timeCountdown) {
            await submitFunction(
              api_verify,
              { token: values.token_number.toString() },
              "change_password"
            );
          } else {
            submitFunction(api_forgot_password, {
              username: dataUser.username,
            });
            setDataUser((dataValues) => ({
              ...dataValues,
              interval: dataValues.interval + 1,
            }));
            interval += 1;

            switch (interval) {
              case 1:
                setTimeCountdown(10);
                break;
              case 2:
                setTimeCountdown(15);
                break;
              case 3:
                setTimeCountdown(30);
                break;
            }
          }
        } else if (
          statusButton !== "change_password" ||
          statusButton !== "verify_number"
        ) {
          const api = `${process.env.REACT_APP_BE_URL_PORT}/api/auth/forgot-password`;
          const data = await submitFunction(
            api,
            { username: values.username },
            "verify_number"
          );
          if (Object.values(data.data.data).length > 0) {
            setDataUser((dataValues) => ({ ...dataValues, ...data.data.data }));

            switch (data.data.data.interval) {
              case 3:
                setTimeCountdown(30);
                break;
              case 2:
                setTimeCountdown(15);
                break;
              case 1:
                setTimeCountdown(10);
                break;
            }
          }
        }
      } catch (err) {
        console.log(err);
        setErrMessage(err.response.data.message);
      }
    },
  });

  useEffect(() => {
    let timer;

    if (statusButton === "verify_number" && timeCountdown > 0) {
      timer = setTimeout(() => setTimeCountdown((time) => time - 1), 1000);
    }

    (async () => {
      if (timeCountdown == 0) {
        if (dataUser.interval > 3) {
          await axios.post(
            `${process.env.REACT_APP_BE_URL_PORT}/api/auth/update-interval`,
            { id: dataUser.id, interval: 4 }
          );

          await axios.post(
            `${process.env.REACT_APP_BE_URL_PORT}/api/auth/nonactive-account`,
            { id: dataUser.id }
          );

          setErrMessage("Akun anda di nonaktif tolong hubungi pihak admin");
        }

        if (dataUser.interval == 3 || Object.values(dataUser).length > 0) {
          const update_forgot_token = axios.post(
            `${process.env.REACT_APP_BE_URL_PORT}/api/auth/update-forgot-token`,
            { id: dataUser.id, forgot_token: "" }
          );
          const update_interval = axios.post(
            `${process.env.REACT_APP_BE_URL_PORT}/api/auth/update-interval`,
            { id: dataUser.id, interval: dataUser.interval }
          );
          await Promise.all([update_forgot_token, update_interval]);
        }
      }
    })();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timeCountdown, statusButton, dataUser.interval]);

  const submitFunction = async (url_api, body_data, setValue) => {
    const data = await axios.post(url_api, body_data);
    if (data.data.status === "success" && setValue)
      setStatusButton(setValue === "reset" ? "" : setValue);

    return data;
  };

  const padTime = (time) => {
    return String(time).length === 1 ? `0${time}` : `${time}`;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${padTime(seconds)}`;
  };

  const showingStepToInput = (status, formik) => {
    if (status === "verify_number") {
      return (
        <CInput
          min="1"
          max="5"
          name="token_number"
          inputid="token_number"
          value={formik.values.token_number}
          type="number"
          placeholder="Your number"
          className="w-full mb-5"
          onChange={formik.handleChange}
        />
      );
    } else if (status === "change_password") {
      return (
        <div className="container-input-p w-100">
          <CInput
            name="password"
            inputid="password"
            value={formik.values.password}
            type="password"
            placeholder="Your password"
            className="w-100 mb-3 input_password"
            onChange={formik.handleChange}
            minLength="6"
            maxLength="20"
          />
          <CInput
            name="re_password"
            inputid="re_password"
            value={formik.values.re_password}
            type="password"
            placeholder="Your new password"
            className="w-100 mb-2 input_password"
            onChange={formik.handleChange}
            minLength="6"
            maxLength="20"
          />
        </div>
      );
    } else {
      return (
        <CInput
          minLength="6"
          maxLength="20"
          name="username"
          inputid="username"
          value={formik.values.username}
          type="text"
          placeholder="Your username"
          className="w-full mb-5"
          onChange={formik.handleChange}
        />
      );
    }
  };

  const showingStepButton = (status, handleSubmit) => {
    if (status === "verify_number") {
      if (dataUser.interval > 3) {
        return (
          <CButton
            disabled
            label="Verify"
            className="px-4 base-bg-color text-white button-login"
            onClick={handleSubmit}
          >
            Verify
          </CButton>
        );
      }
      return (
        <CButton
          label={timeCountdown ? "Verify" : "Send"}
          className="px-4 base-bg-color text-white button-login"
          onClick={handleSubmit}
        >
          {timeCountdown ? "Verify" : "Send"}
        </CButton>
      );
    } else if (status === "change_password") {
      return (
        <CButton
          label="Change Password"
          className="px-4 base-bg-color text-white button-login"
          onClick={handleSubmit}
        >
          Change Password
        </CButton>
      );
    } else {
      return (
        <CButton
          label="Forgot"
          className="px-4 base-bg-color text-white button-login"
          onClick={handleSubmit}
        >
          Forgot
        </CButton>
      );
    }
  };
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
                    <h3 className="text-muted text-bold text-center mb-4">
                      Forgot password
                    </h3>
                    <CInputGroup>
                      {showingStepToInput(statusButton, formik)}
                    </CInputGroup>

                    <div className="d-flex justify-content-center w-100 font-weight-bold mb-3">
                      <h5>
                        {dataUser.interval > 3 ||
                          (statusButton === "verify_number" &&
                            formatTime(timeCountdown))}
                      </h5>
                    </div>
                    <CRow>
                      {showingStepButton(statusButton, formik.handleSubmit)}
                    </CRow>
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

export default ForgotPassword;
