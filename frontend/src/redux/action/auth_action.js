export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const loginRequest = () => (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
  });
};

export const loginSuccess = () => (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
  });
};

export const loginFailure = (status) => (dispatch) => {
  dispatch({
    type: LOGIN_FAILURE,
    payload: status,
  });
};

export const logoutSuccess = () => (dispatch) => {
  dispatch({
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
  });
};
