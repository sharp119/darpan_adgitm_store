// Constants
const UPDATE_PRODUCTS = "UPDATE_PRODUCTS"

// Actions
export function updateProducts(productsData) {
	return {
		type: UPDATE_PRODUCTS,
		payload: productsData,
	}
}

const initialState = null

export default function reducer(state = initialState, action) {
	const { type, payload } = action
	switch (type) {
		case UPDATE_PRODUCTS:
			return payload
            
		default:
			return state
	}
}
