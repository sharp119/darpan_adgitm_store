import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { ProductCard } from "../../components"
import styles from "./NotFound.module.scss"
import arrow from "../../Assets/arrow-left.svg"
import { useHistory } from "react-router"

function NotFound({ products }) {
	let [data, updateData] = useState(null)
	let history = useHistory()

	useEffect(() => {
		if (!products) {
			updateData(null)
			return
		}
		let newData = []
		let n = Math.min(products.length, 4) // number of products to show
		while (newData.length < n) {
			const idx = parseInt(Math.random() * Math.random() * products.length)
			const potentialProductId = products[idx].id
			try {
				for (const product of newData) {
					if (product.id === potentialProductId) {
						throw new Error("already-present")
					}
				}
			} catch (error) {
				switch (error.message) {
					case "already-present":
						continue
					default:
						console.error(error)
						break
				}
			}
			newData.push(products[idx])
		}
		updateData(newData)
	}, [products])

	return (
		<div className={styles.notFound}>
			<div className={styles.content}>
				<p className={styles.oops}>OOPS!</p>
				<p>We can't seem to find the page you are looking for. 🤷‍♂️</p>
				{data && <p> But we have some products you might like 👇</p>}
			</div>
			{data && (
				<div className={styles.products}>
					{data.map(item => (
						<ProductCard key={item.id} {...item} />
					))}
				</div>
			)}
			{data && (
				<div className={styles.more} onClick={() => history.push("/products")}>
					<p>More?</p>
					<img src={arrow} alt=''></img>
				</div>
			)}
		</div>
	)
}

const mapStateToProps = (state, ownProps) => ({
	...ownProps,
	products: state.products,
})

export default connect(mapStateToProps)(NotFound)
