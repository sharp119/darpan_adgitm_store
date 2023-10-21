// Constants
const UPDATE_USER = "UPDATE_USER"

// Actions
export function updateUser(userData) {
	return {
		type: UPDATE_USER,
		payload: userData,
	}
}

const initialState = null

export default function reducer(state = initialState, action) {
	const { type, payload } = action
	switch (type) {
		case UPDATE_USER:
			return payload

		default:
			return state
	}
}
