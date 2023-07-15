import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  carts: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    doAddBookAction: (state, action) => {
      let carts = state.carts;
      let item = action.payload;

      let itemIndex = carts.findIndex((c) => c._id === item._id);

      if (itemIndex > -1) {
        carts[itemIndex].quantity += item.quantity;

        if (carts[itemIndex].quantity > item.detail.quantity) {
          carts[itemIndex].quantity = item.detail.quantity
        }
      } else {
        carts.push({
          quantity: item.quantity,
          _id: item._id,
          detail: item.detail,
        });
      }
      state.carts = carts;
      message.success('Thêm sản phẩm thành công!')
    },

    doUpdateBookAction: (state, action) => {
      let carts = state.carts;
      let item = action.payload;

      let itemIndex = carts.findIndex(c => c._id === item._id)

      if (itemIndex > -1) {
        carts[itemIndex].quantity = item.quantity
      }
      state.carts = carts;

    },

    doDeleteBookAction: (state, action) => {
      let carts = state.carts;
      let item = action.payload;

      carts = carts.filter(c => c._id !== item._id)

      state.carts = carts;
    }
    ,
    doResetCartsAction: (state, action) => {
      state.carts = [];
    }
  },
});

export default orderSlice.reducer;

export const { doAddBookAction, doUpdateBookAction, doDeleteBookAction, doResetCartsAction } = orderSlice.actions;
