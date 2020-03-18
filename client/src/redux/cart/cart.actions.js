import CartActionTypes from './cart.types'

export const toggleCartHidden = () => ({
  type: CartActionTypes.TOGGLE_CART_HIDDEN
})

export const addItem = item => ({
  type: CartActionTypes.ADD_ITEM,
  payload: item
})

export const removeItem = item => ({
  type: CartActionTypes.REMOVE_ITEM,
  payload: item
})

export const clearItemFromCart = item => ({
  type: CartActionTypes.CLEAR_ITEM_FROM_CART,
  payload: item
})

export const clearCart = () => ({
  type: CartActionTypes.CLEAR_CART,
})

export const getDatabaseCartStart = () => ({
  type: CartActionTypes.GET_DATABSE_CART_START
})

export const getDatabaseCartSucess = cartItems => ({
  type: CartActionTypes.GET_DATABSE_CART_SUCCESS,
  payload: cartItems
})

export const getDatabaseCartFailure = error => ({
  type: CartActionTypes.GET_DATABSE_CART_FAILURE,
  payload: error
})

export const updateDatabaseCartSucess = cartItems => ({
  type: CartActionTypes.UPDATE_DATABASE_CART_SUCCESS,
  payload: cartItems
})

export const updateDatabaseCartFailure = error => ({
  type: CartActionTypes.UPDATE_DATABASE_CART_FAILURE,
  payload: error
})
