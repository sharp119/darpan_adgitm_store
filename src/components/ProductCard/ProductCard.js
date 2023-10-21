import React, { useEffect, useState } from "react"
import styles from "./ProductCard.module.scss"
import firebase from "../../firebase"
import PropTypes from "prop-types"
import { useHistory } from "react-router"

// https://drive.google.com/uc?export=view&id=id

export default function ProductCard({ name, price, project, id, hasInventory, inventoryAmount, outOfStock, ...props }) {
	let [imageUrl, updateImageUrl] = useState(null)
	let [isOutOfStock, setIsOutOfStock] = useState(false)
	let history = useHistory()

	useEffect(() => {
		if (hasInventory && inventoryAmount === 0) {
			setIsOutOfStock(true)
		} else if (outOfStock) {
			setIsOutOfStock(true)
		} else {
			setIsOutOfStock(false)
		}
	}, [hasInventory, inventoryAmount, outOfStock])

	useEffect(() => {
		async function getImage() {
			try {
				const res = await firebase.storage().ref(`Products/${id}/`).list()
				if (res.items.length === 0) {
					updateImageUrl(false)
					return
				}
				const firstItem = await res.items[0].getDownloadURL()
				updateImageUrl(firstItem)
			} catch (error) {
				console.error(error)
				updateImageUrl(false)
			}
		}
		getImage()
		// eslint-disable-next-line
	}, [])
	return (
		<div
			className={[styles.productCard, isOutOfStock ? styles.outOfStock : ""].join(" ")}
			onClick={() => history.push(`/products/${id}`)}>
			<div className={styles.imageContainer}>
				{imageUrl ? <img src={imageUrl} alt='product' /> : <div className={styles.noImage} />}
				<div className={styles.outOfStockText}>out of stock </div>
			</div>
			{/* <Button variant='black' style={{ borderRadius: 0 }}>
				Add to Cart
			</Button> */}
			<div className={styles.contentContainer}>
				<p className={styles.projectName}>{project}</p>
				<p className={styles.productName}>{name}</p>
				<p className={styles.productPrice}>₹{price}</p>
			</div>
		</div>
	)
}

ProductCard.prototype = {
	name: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	project: PropTypes.string,
	id: PropTypes.string.isRequired,
	hasInventory: PropTypes.bool,
	inventoryAmount: PropTypes.number,
	outOfStock: PropTypes.bool,
}
