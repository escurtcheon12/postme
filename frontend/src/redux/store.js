import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import auth_reducer from "./reducers/auth_reducer";
import cart_reducer from "./reducers/cart_reducer";
import notif_reducer from "./reducers/notif_reducer";
import changeState from "./reducers/coreui_reducer";

const rootReducer = combineReducers({
  auth_reducer,
  cart_reducer,
  notif_reducer,
  changeState,
});
export const Store = createStore(rootReducer, applyMiddleware(thunk));
