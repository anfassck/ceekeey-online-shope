import { create } from "zustand";
import { persist } from "zustand/middleware";

const productStore = create(persist((set, get) => ({
  cart: [],

  // Total quantity of all items in the cart
  totalQuantity: 0,

  // Add or update product in cart
  setCart: (newItem) =>
    set((state) => {
      // Ensure quantity is a number, default to 1
      const itemWithQuantity = {
        ...newItem,
        quantity: typeof newItem.quantity === "number" ? newItem.quantity : 1,
      };

      const updatedCart = [...state.cart];
      const existingIndex = updatedCart.findIndex(
        (item) => item.id === itemWithQuantity.id
      );

      if (existingIndex !== -1) {
        // Increase quantity if item exists
        updatedCart[existingIndex].quantity += itemWithQuantity.quantity;
      } else {
        // Add new item
        updatedCart.push(itemWithQuantity);
      }

      // Update total quantity
      const totalQty = updatedCart.reduce(
        (sum, item) => sum + item.quantity, 
        0
      );

      return { cart: updatedCart, totalQuantity: totalQty };
    }),

  // Remove a specific item by id
  removeCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);

      // Update total quantity
      const totalQty = updatedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return { cart: updatedCart, totalQuantity: totalQty };
    }),

  // Alias for setCart (used in CartPage)
  addToCart: (item) => {
    get().setCart(item);
  },

  // Decrease quantity by 1, remove if reaches 0
  decreaseQty: (id) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0);
      const totalQty = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      return { cart: updatedCart, totalQuantity: totalQty };
    }),

  // Clear the entire cart
  removeAllCart: () => set({ cart: [], totalQuantity: 0 }),
}),
{
  name: "cart-storage", // Unique name for the storage
  getStorage: () => localStorage, // Use localStorage
}));

export default productStore;
