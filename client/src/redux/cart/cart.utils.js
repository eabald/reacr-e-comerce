export const addItemToCart = (cartItems, cartItemToAdd) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === cartItemToAdd.id
  )

  const quantity = cartItemToAdd.quantity ? cartItemToAdd.quantity : 1

  if (existingCartItem) {
    return cartItems.map(cartItem =>
      cartItem.id === cartItemToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + quantity }
        : cartItem
    )
  }

  return [...cartItems, { ...cartItemToAdd, quantity }]
}

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === cartItemToRemove.id
  )

  if (existingCartItem.quantity === 1) {
    return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id)
  }

  return cartItems.map(cartItem =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  )
}

export const mergeCarts = (dbCartItems, localCartItems) => dbCartItems.reduce((prev, item) => addItemToCart(prev, item), localCartItems)

export const isCartTomerge = (dbCartItems, localCartItems) => {
  const merged = [...dbCartItems, ...localCartItems]
  const stringified = merged.map(x => JSON.stringify(x))
  const noDuplicates = [...new Set(stringified)]
  return noDuplicates.length !== merged.length / 2
}
