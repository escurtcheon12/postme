import { SET_STATE_NOTIF } from "../action/notif_action";

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE_NOTIF:
      return Object.assign({}, state, {
        status: true,
      });
    default:
      return state;
  }
};

export default reducer;
