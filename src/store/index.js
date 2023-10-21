import { combineReducers, createStore } from "redux"

import auth from "./auth"
import user from "./user"
import cart from "./cart"
import products from "./products"
import filter from "./filter"
import miniCart from "./miniCart"
import authBar from "./authBar"

const rootReducer = combineReducers({
	auth,
	user,
	cart,
	products,
	filter,
	miniCart,
	authBar,
})

export default createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
