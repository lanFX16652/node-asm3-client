import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../apis/axios.js"


export const postAddItem = createAsyncThunk(
  'cart/add',
  async (cartData) => {
    const { productId, qty } = cartData
    try {

      const response = await axiosInstance.post('client/add-to-cart', {
        productId,
        qty
      })

      return response.data
    } catch (error) {
      console.log(error)
    }
  }
)

export const getCart = createAsyncThunk(
  'cart/getCart',
  async () => {
    try {

      const response = await axiosInstance.get('client/cart')
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
)

const initialState = {
  cart: [],
  isLoading: false,
  totalCartItem: 0,
  totalPrice: 0
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = []
      state.totalCartItem = 0
      state.totalPrice = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAddItem.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(postAddItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload?.cart
        state.totalCartItem = action.payload?.totalCartItem
        state.totalPrice = action.payload?.totalPrice
      })
      .addCase(postAddItem.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(getCart.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload?.cart
        state.totalCartItem = action.payload?.totalCartItem
        state.totalPrice = action.payload?.totalPrice
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false
      })
  },
})

export const selectCart = (state) => state.cart.cart;
export const selectQtyCartItem = (state) => state.cart.totalCartItem
export const selectCartLoading = state => state.cart.isLoading

export const { resetCart } = cartSlice.actions

export const cartReducer = cartSlice.reducer;
