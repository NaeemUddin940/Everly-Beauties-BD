"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VariationState {
  currentImage: string;
  currentPrice: string;
  currentRegularPrice: string;
  currentSalePrice: string;
}

const initialState: VariationState = {
  currentImage: "",
  currentPrice: "",
  currentRegularPrice: "",
  currentSalePrice: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setVariation: (
      state,
      action: PayloadAction<{
        image: string;
        price: string;
        regular_price: string;
        sale_price: string;
      }>
    ) => {
      state.currentImage = action.payload.image;
      state.currentPrice = action.payload.price;
      state.currentRegularPrice = action.payload.regular_price;
      state.currentSalePrice = action.payload.sale_price;
    },
    resetVariation: (
      state,
      action: PayloadAction<{
        images: { src: string }[];
        price: string;
        regular_price: string;
        sale_price: string;
      }>
    ) => {
      state.currentImage = action.payload.images[0]?.src || "";
      state.currentPrice = action.payload.price;
      state.currentRegularPrice = action.payload.regular_price;
      state.currentSalePrice = action.payload.sale_price;
    },
  },
});

export const { setVariation, resetVariation } = productSlice.actions;
export default productSlice.reducer;
