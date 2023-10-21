import React, { useEffect, useState } from "react"
import styles from "./Product.module.scss"
import firebase from "../../firebase"
import { Button } from "../../components"
import arrow from "../../Assets/arrow-left.svg"
import { useHistory } from "react-router"
import { connect } from "react-redux"

function Product({ match, cart, auth }) {
	let [data, updateData] = useState(null)
	let [images, updateImages] = useState(null)
	let [currentImage, updateCurrentImage] = useState(0)
	let history = useHistory()

	// onload get product data from firebase
	useEffect(() => {
		const { id } = match.params
		let productRef = firebase.firestore().collection("products").doc(id)
		const unsub = productRef.onSnapshot(
			snapshot => {
				if (!snapshot.exists) {
					updateData(false)
					return
				}
				const id = snapshot.id
				let data = snapshot.data()
				if (data.show !== true) {
					updateData(false)
					return
				}
				updateData({ id, ...data })
			},
			error => {
				updateData(false)
				const { code, message } = error
				console.log("Error in retrieving product data")
				console.log(`Code : ${code}`)
				console.log(`Message : ${message}`)
			}
		)

		return unsub
		// eslint-disable-next-line
	}, [])

	// on fetching product data start fetching images
	useEffect(() => {
		if (!data) {
			updateImages(data)
			return
		}

		async function getImages() {
			const images = await firebase.storage().ref(`Products/${data.id}`).list()
			updateImages(await Promise.all(images.items.map(async item => await item.getDownloadURL())))
		}

		getImages()
	}, [data])

	// change title
	useEffect(() => {
		if (!data) {
			document.title = "Loading"
			return
		}
		document.title = `${data.name} | Darpan`
	}, [data])

	const onClickAddToCart = () => {
		if (!data) return
		if (!auth) {
			history.push("/login")
			return
		}
		const { uid } = firebase.auth().currentUser
		const cartRef = firebase.firestore().collection("carts").doc(uid)

		const { id } = data
		if (id in cart) {
			cartRef.update({ [id]: firebase.firestore.FieldValue.increment(1) })
		} else {
			cartRef.update({ [id]: 1 })
		}
	}

	const onClickBuyNow = () => {
		onClickAddToCart()
		history.push("/checkout")
	}

	return (
		<div className={styles.product}>
			{data === false && <div>Product Not Found</div>}
			{data && (
				<>
					<div className={styles.imagesContainer}>
						<div className={styles.carousel}>
							{images &&
								images.map((link, index) => (
									<img
										src={link}
										key={index}
										alt=''
										className={(() => {
											if (currentImage === index) return styles.show
											else if (currentImage > index) return styles.left
											else if (currentImage < index) return styles.right
										})()}
									/>
								))}
						</div>
						<div className={[styles.buttons, images && images.length > 1 ? styles.show : ""].join(" ")}>
							<img
								className={styles.prev}
								src={arrow}
								alt=''
								onClick={() =>
									updateCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1)
								}></img>
							<img
								className={styles.next}
								src={arrow}
								alt=''
								onClick={() =>
									updateCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1)
								}></img>
						</div>
					</div>
					<div className={styles.content}>
						<p className={styles.back} onClick={() => history.push("/products")}>
							<img src={arrow} alt='' /> Back to Products
						</p>
						<p className={styles.name}>{data.name}</p>
						{!data.discount && <p className={styles.price}>₹{data.price}</p>}
						{data.discount && (
							<p className={styles.discount}>
								<span className={styles.old}>₹{data.price}</span>
								<span className={styles.new}>₹{data.discountedPrice}</span>
							</p>
						)}
						{data.discount && data.discountMessage && (
							<p className={styles.discountMessage}>{data.discountMessage}</p>
						)}
						{data.deliveryCost && <p className={styles.deliveryCost}>+ ₹{data.deliveryCost} Delivery</p>}
						{data.isCodAvailable && (
							<p className={styles.codCost}>
								{" "}
								+ {!data.codCost || data.codCost === 0 ? "Free Cod" : `₹${data.codCost} COD`}
							</p>
						)}
						{data.hasInventory && (
							<p className={styles.inventory}>Only {data.inventoryAmount} Left. Hurry!</p>
						)}
						{data.needsConfirmation && (
							<>
							<p className={styles.description}>+ Delivery charges apply</p>
							<p className={styles.message}>This product is not chargeable. You will be contacted regarding delivery.</p>
							</>
						)}
						{data.description && (
							<div className={styles.description}>
								{data.description.map((d, index) => {
									switch (d.type) {
										case "h":
											return (
												<p key={index} className={styles.heading}>
													{d.value}
												</p>
											)
										case "p":
											return (
												<p key={index} className={styles.para}>
													{d.value}
												</p>
											)
										case "ul":
											return (
												<ul key={index}>
													{d.value.map((li, index) => (
														<li key={index}>{li}</li>
													))}
												</ul>
											)
										case "ol":
											return (
												<ol key={index}>
													{d.value.map((li, index) => (
														<li key={index}>{li}</li>
													))}
												</ol>
											)
										default:
											return <></>
									}
								})}
							</div>
						)}
						<div className={styles.buttons}>
							<Button variant='black' className={styles.cartButton} onClick={onClickAddToCart}>
								Add to Cart
							</Button>
							<Button className={styles.cartButton} onClick={onClickBuyNow}>
								Buy Now
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

const mapStateToProps = ({ cart, auth }, ownProps) => ({
	...ownProps,
	cart,
	auth,
})

export default connect(mapStateToProps)(Product)
