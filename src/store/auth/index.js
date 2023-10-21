// Constants
const UPDATE_AUTH = "UPDATE_AUTH"

// Actions
export function updateAuth(isAuthenticated) {
	return {
		type: UPDATE_AUTH,
		payload: isAuthenticated,
	}
}

const initialState = null

export default function reducer(state = initialState, action) {
	const { type, payload } = action
	switch (type) {
		case UPDATE_AUTH:
			return payload

		default:
			return state
	}
}
