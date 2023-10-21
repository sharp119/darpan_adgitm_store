import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useHistory } from "react-router"
import { Button } from ".."
import firebase from "../../firebase"
import styles from "./MiniCart.module.scss"

function MiniCart({ miniCart, cart, products }) {
	let history = useHistory()
	let [cartProducts, updateCartProducts] = useState([])

	const updateQuantity = (itemId, operation) => {
		const { uid } = firebase.auth().currentUser
		const cartRef = firebase.firestore().collection("carts").doc(uid)
		if (itemId in cart) {
			if (operation === "add") {
				cartRef.update({ [itemId]: firebase.firestore.FieldValue.increment(1) })
				return
			}
			if (operation === "sub") {
				if (cart[itemId] <= 1) {
					cartRef.update({ [itemId]: firebase.firestore.FieldValue.delete() })
					return
				}
				cartRef.update({ [itemId]: firebase.firestore.FieldValue.increment(-1) })
				return
			}
			return
		}
		if (operation === "add") {
			cartRef.update({ [itemId]: 1 })
			return
		}
	}

	useEffect(() => {
		if (!cart || !products) {
			updateCartProducts([])
			return
		}
		function getProductsDetails() {
			let newCartProducts = []
			for (const product of products) {
				if (product.id in cart) {
					const quantity = cart[product.id]
					newCartProducts.push({ ...product, quantity })
				}
			}
			updateCartProducts(newCartProducts)
		}
		getProductsDetails()
		// eslint-disable-next-line
	}, [products, cart])
	return (
		<div className={[styles.miniCart, miniCart.show ? styles.show : ""].join(" ")}>
			{cartProducts.length === 0 ? (
				<div className={styles.empty}>Your cart is empty.</div>
			) : (
				<>
					{cartProducts.map(p => (
						<div key={p.id} className={styles.item}>
							<div className={styles.top}>
								<p className={styles.name}>{p.name}</p>
							</div>
							<div className={styles.bottom}>
								<button className={styles.sub} onClick={() => updateQuantity(p.id, "sub")}></button>
								<p className={styles.quantity}>{p.quantity}</p>
								<button className={styles.add} onClick={() => updateQuantity(p.id, "add")}></button>
							</div>
						</div>
					))}
					<Button variant='black' className={styles.checkoutButton} onClick={() => history.push("/checkout")}>
						Checkout
					</Button>
				</>
			)}
		</div>
	)
}

const mapStateToProps = (state, ownProps) => ({
	...ownProps,
	miniCart: state.miniCart,
	cart: state.cart,
	products: state.products,
})

export default connect(mapStateToProps)(MiniCart)
