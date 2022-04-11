import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toWei } from '../utils/utils'
import { ethers } from 'ethers'

const initialState = {
  self: {},
  currentPhase: {},
  latestPrice: undefined,
  tokenPrice: undefined,
  loadingPurchase: false,
  errorPurchasing: false,
  successPurchasing: false,
  purchases: {
    totalAmount: 0,
    totalRemain: 0,
    history: [],
  }
}

export const buyToken = createAsyncThunk(
  'contract/buyToken',
  async ({ quantity, account }, { getState, rejectWithValue }) => {
    try {
      const contract = getState().contract.self;
      const currentPhase = await contract.getcurrentPhase();
      const latestPrice = await contract.getLatestPrice();
      const tokenPrice = currentPhase.price / latestPrice;

      const options = {
        from: account,
        value: ethers.utils.parseUnits(
          Math.ceil(
            tokenPrice * ethers.utils.parseUnits(quantity, "ether")
          ).toString(), "wei"),
      }

      console.log(`quantity: ${quantity}`)
      console.log(`tokenPrice: ${tokenPrice}`)
      console.log(`options.value: ${options.value}`)
      const tx = await contract.buyToken(toWei(quantity), options)
      return tx.wait();
    } catch (error) {
      if (error?.data?.message) {
        throw new Error(error.data.message)
      } else {
        throw error;
      }
    }
  });

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setContract: (state, action) => {
      state.self = action.payload;
    },
    setCurrentPhase: (state, action) => {
      state.currentPhase = action.payload;
    },
    setLatestPrice: (state, action) => {
      state.latestPrice = action.payload;
    },
    setTokenPrice: (state, action) => {
      state.tokenPrice = action.payload;
    },
    resetPurchasing: (state) => {
      state.loadingPurchase = false;
      state.errorPurchasing = false;
      state.successPurchasing = false;
    },
    setPurchases: (state, action) => {
      state.purchases = action.payload;
    },
  },
  extraReducers: {
    [buyToken.pending]: (state) => {
      state.loadingPurchase = true;
      state.errorPurchasing = false;
      state.successPurchasing = false;
    },
    [buyToken.fulfilled]: (state, { payload }) => {
      state.loadingPurchase = false;
      state.errorPurchasing = false;
      state.successPurchasing = true;
    },
    [buyToken.rejected]: (state, { error }) => {
      state.loadingPurchase = false;
      state.errorPurchasing = true;
      state.successPurchasing = false;
    },
  }
});

// Action creators are generated for each case reducer function
export const { setContract, setCurrentPhase, setLatestPrice, setTokenPrice, resetPurchasing, setPurchases } = contractSlice.actions;

// slice selectors
export const selectContract = (state) => state.contract.self;
export const selectCurrentPhase = (state) => state.contract.currentPhase;
export const selectLatestPrice = (state) => state.contract.latestPrice;
export const selectTokenPrice = (state) => state.contract.tokenPrice;
export const selectLoadingPurchase = (state) => state.contract.loadingPurchase;
export const selectErrorPurchasing = (state) => state.contract.errorPurchasing;
export const selectSuccessPurchasing = (state) => state.contract.successPurchasing;
export const selectPurchases = (state) => state.contract.purchases;

export default contractSlice.reducer;