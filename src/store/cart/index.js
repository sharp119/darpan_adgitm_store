// Constants
const UPDATE_CART = "UPDATE_CART"

// Actions
export function updateCart(cartData) {
	return {
		type: UPDATE_CART,
		payload: cartData,
	}
}

const initialState = null

export default function reducer(state = initialState, action) {
	const { type, payload } = action
	switch (type) {
		case UPDATE_CART:
			return payload

		default:
			return state
	}
}
