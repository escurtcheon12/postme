import {
  ADD_INVENTORY,
  INCREASE_ITEM,
  DECREASE_ITEM,
  DELETE_INVENTORY,
  DELETE_ALL_INVENTORY,
} from "../action/cart_action";

const initialState = [];

const onChangeIncreaseQty = (itemArray, item) => {
  return itemArray.map((reduxItem) => {
    if (reduxItem.id === item.id) {
      reduxItem.qty = Number(item.qty);
    }
    return reduxItem;
  });
};

const decreaseItem = (itemArray, item) => {
  return itemArray.map((reduxItem) => {
    if (reduxItem.id === item.id) {
      if (reduxItem.item > 1) {
        reduxItem.item -= 1;
      }
    }
    return reduxItem;
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INVENTORY:
      return [...state, action.payload];
    case INCREASE_ITEM:
      return onChangeIncreaseQty(state, action.payload);
    case DECREASE_ITEM:
      return decreaseItem(state, action.payload);
    case DELETE_INVENTORY:
      const newState = [...state];
      return newState.filter((item) => item.id != action.payload);
    case DELETE_ALL_INVENTORY:
      return state.filter((item) => item.id != item.id);
    default:
      return state;
  }
};

export default reducer;
