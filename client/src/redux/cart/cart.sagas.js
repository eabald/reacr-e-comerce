import { all, call, takeLatest, put, select } from "redux-saga/effects";

import UserActionTypes from '../user/user.types'
import CartActionTypes from './cart.types'
import { clearCart, getDatabaseCartFailure, getDatabaseCartSucess, updateDatabaseCartFailure, updateDatabaseCartSucess } from "./cart.actions";
import { selectCartItems } from "./cart.selectors";
import { selectCurrentUser } from "../user/user.selectors";
import { mergeCarts, isCartTomerge } from "./cart.utils";
import { getUserCartRef, updateUserCartRef } from "../../firebase/firebase.utils";

export function* clearCartOnSignOut() {
  yield put(clearCart())
}

export function* getDatabaseCart() {
  try {
    const user = yield select(selectCurrentUser)
    const dbCart  = yield getUserCartRef(user.id)
    const localCartItems = yield select(selectCartItems)
    const cartItems = isCartTomerge(dbCart, localCartItems) ? mergeCarts(dbCart, localCartItems) : localCartItems
    yield put(getDatabaseCartSucess(cartItems))
    yield udateDatabaseCart()
  } catch (error) {
    yield put(getDatabaseCartFailure(error))
  }
}

export function* udateDatabaseCart() {
  try {
    let user = yield select(selectCurrentUser)
    if (!user) return
    const localCartItems = yield select(selectCartItems)
    yield updateUserCartRef(user.id, localCartItems);
    yield put(updateDatabaseCartSucess(localCartItems))
  } catch (error) {
    yield put(updateDatabaseCartFailure(error))
  }
}

export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut)
}

export function* onGetDatabaseCartStart() {
  yield takeLatest(CartActionTypes.GET_DATABSE_CART_START, getDatabaseCart)
}

export function* onUpdateDatabaseCartStart() {
  yield takeLatest(CartActionTypes.UPDATE_DATABASE_CART_START, udateDatabaseCart)
}

export function* onCartChange() {
  yield takeLatest(
    [
      CartActionTypes.ADD_ITEM,
      CartActionTypes.REMOVE_ITEM,
      CartActionTypes.CLEAR_ITEM_FROM_CART
    ],
    udateDatabaseCart
  )
}

export function* cartSagas() {
  yield all([
    call(onSignOutSuccess),
    call(onGetDatabaseCartStart),
    call(onCartChange)
  ])
}
