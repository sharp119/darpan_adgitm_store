// Constants
const TOGGLE_MINI_CART = "TOGGLE_MINI_CART"

// Actions
export function toggleMiniCart() {
	return {
		type: TOGGLE_MINI_CART,
	}
}

const initialState = { show: false }

export default function reducer(state = initialState, action) {
	const { type } = action
	switch (type) {
		case TOGGLE_MINI_CART:
			return { ...state, show: !state.show }

		default:
			return state
	}
}
