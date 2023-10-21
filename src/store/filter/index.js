// Constants
const UPDATE_FILTER = "UPDATE_FILTER"

// Actions
export function updateFilter(payload) {
	return {
		type: UPDATE_FILTER,
		payload,
	}
}

const initialState = { show: false, projects: new Set() }

export default function reducer(state = initialState, action) {
	const { type, payload } = action
	switch (type) {
		case UPDATE_FILTER:
			return payload

		default:
			return state
	}
}
