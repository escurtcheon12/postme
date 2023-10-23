export const SET_STATE_NOTIF = "SET_STATE_NOTIF";

export const setStateNotif = () => (dispatch) => {
  dispatch({
    type: SET_STATE_NOTIF,
    status: true,
  });
};
