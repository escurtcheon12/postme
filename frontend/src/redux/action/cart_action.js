export const ADD_INVENTORY = "ADD_INVENTORY";
export const INCREASE_ITEM = "INCREASE_ITEM";
export const DECREASE_ITEM = "DECREASE_ITEM";
export const DELETE_INVENTORY = "DELETE_INVENTORY";
export const DELETE_ALL_INVENTORY = "DELETE_ALL_INVENTORY";

export const addInventory = (status) => (dispatch) => {
  dispatch({
    type: ADD_INVENTORY,
    payload: status,
  });
};

export const increaseItem = (status) => (dispatch) => {
  dispatch({
    type: INCREASE_ITEM,
    payload: status,
  });
};

export const decreaseItem = (status) => (dispatch) => {
  dispatch({
    type: DECREASE_ITEM,
    payload: status,
  });
};

export const deleteInventory = (status) => (dispatch) => {
  dispatch({
    type: DELETE_INVENTORY,
    payload: status,
  });
};

export const deleteAllInventory = (status) => (dispatch) => {
  dispatch({
    type: DELETE_ALL_INVENTORY,
    payload: status,
  });
};
