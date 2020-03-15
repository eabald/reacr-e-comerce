import { all, call, takeLatest, put } from "redux-saga/effects";

import UserActionTypes from '../user/user.types'
import CartActionTypes from './cart.types'
import { clearCart, getDatabaseCartFailure, getDatabaseCartSucess } from "./cart.actions";
import { selectCartItems } from "./cart.selectors";
import { mergeCarts } from "./cart.utils";

export function* clearCartOnSignOut() {
  yield put(clearCart())
}

export function* getDatabaseCart() {
  try {
    const dbCart  = '' // get cart from db
    const cartItems = mergeCarts(dbCart, selectCartItems())
    yield put(getDatabaseCartSucess(cartItems))
  } catch (error) {
    put(getDatabaseCartFailure(error))
  }
}

export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut)
}

export function* onGetDatabaseCartStart() {
  yield takeLatest(CartActionTypes.GET_DATABSE_CART_START, getDatabaseCart)
}

export function* cartSagas() {
  yield all([call(onSignOutSuccess)])
}
