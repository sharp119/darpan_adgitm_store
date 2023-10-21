// Constants
const TOOGLE_AUTH_BAR = "TOOGLE_AUTH_BAR"

// Actions
export function toggleAuthBar() {
	return {
		type: TOOGLE_AUTH_BAR,
	}
}

const initialState = { show: false }

export default function reducer(state = initialState, action) {
	const { type } = action
	switch (type) {
		case TOOGLE_AUTH_BAR:
			return { ...state, show: !state.show }

		default:
			return state
	}
}
