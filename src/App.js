import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import firebase from "./firebase"
import { Products, Login, Register, Product, Home, NotFound, Checkout } from "./Pages"
import { AuthBar, Header, MiniCart } from "./components"
import { connect } from "react-redux"
import "./App.scss"
import { updateAuth } from "./store/auth"
import { updateUser } from "./store/user"
import { updateCart } from "./store/cart"
import { updateProducts } from "./store/products"

function App({ dispatch, auth, history }) {
	// watch auth changes
	useEffect(() => {
		function onUserData(user) {
			dispatch(updateAuth(user ? true : false))
		}

		function onError(error) {
			const { code, message } = error
			console.log("Error in auth")
			console.log(`Code : ${code}`)
			console.log(`Message : ${message}`)
			dispatch(updateAuth(false))
		}
		const res = firebase.auth().onAuthStateChanged(onUserData, onError)
		return res
		// eslint-disable-next-line
	}, [])

	// get user data
	useEffect(() => {
		let unsubscribe
		if (!auth) {
			dispatch(updateUser(false))
			if (unsubscribe) unsubscribe()
			return
		}

		function onUserData(snapshot) {
			if (!snapshot || !snapshot.exists) {
				dispatch(updateUser(false))
				return
			}

			const data = snapshot.data()
			dispatch(updateUser(data))
		}

		function onError(error) {
			const { code, message } = error
			console.log("Error in user snapshot")
			console.log("Code : ", code)
			console.log("Message : ", message)
		}

		const { uid } = firebase.auth().currentUser
		unsubscribe = firebase.firestore().collection("users").doc(uid).onSnapshot(onUserData, onError)

		return unsubscribe
		// eslint-disable-next-line
	}, [auth])

	// get cart data
	useEffect(() => {
		let unsubscribe
		if (!auth) {
			dispatch(updateCart(false))
			if (unsubscribe) unsubscribe()
			return
		}
		function onCartData(snapshot) {
			if (!snapshot || !snapshot.exists) {
				dispatch(updateCart(false))
				return
			}

			const data = snapshot.data()
			dispatch(updateCart(data))
		}

		function onError(error) {
			const { code, message } = error
			console.log("Error in cart snapshot")
			console.log("Code : ", code)
			console.log("Message : ", message)
		}

		const { uid } = firebase.auth().currentUser
		unsubscribe = firebase.firestore().collection("carts").doc(uid).onSnapshot(onCartData, onError)

		return unsubscribe
		// eslint-disable-next-line
	}, [auth])

	// get products data
	useEffect(() => {
		function onProductsData(snapshot) {
			if (!snapshot) {
				dispatch(updateProducts(false))
				return
			}

			let products = []
			snapshot.docs.forEach(s => {
				let product = { id: s.id, ...s.data() }

				if (product.outOfStock) return
				if (product.hasInventory && product.inventoryAmount && product.inventoryAmount === 0) return
				products.push(product)
			})

			dispatch(updateProducts(products))
		}

		function onError(error) {
			const { code, message } = error
			console.log("Error in cart snapshot")
			console.log("Code : ", code)
			console.log("Message : ", message)
		}
		let unsubscribe = firebase
			.firestore()
			.collection("products")
			.where("show", "==", true)
			.onSnapshot(onProductsData, onError)
		return unsubscribe
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<Router>
				<Header />
				<Switch>
					<Route path='/login' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/products/:id' component={Product} />
					<Route path='/products' component={Products} />
					<Route path='/checkout' component={Checkout} />
					<Route path='/' component={Home} />
					<Route component={NotFound} />
				</Switch>
				<AuthBar />
				<MiniCart />
			</Router>
		</>
	)
}

const mapStateToProps = (state, ownProps) => ({
	...ownProps,
	auth: state.auth,
})

export default connect(mapStateToProps)(App)
