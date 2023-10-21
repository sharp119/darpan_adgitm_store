import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { ProductCard, Filter } from "../../components"
import styles from "./Products.module.scss"

function Products({ products, filter }) {
	let [filteredProducts, updateFilteredProducts] = useState(null)

	// filter products to show
	useEffect(() => {
		if (!products) return
		updateFilteredProducts(null)
		let temp = []
		const selectedProjects = filter.projects // Set

		for (const product of products) {
			if (selectedProjects.size > 0 && !selectedProjects.has(product.project || "other")) {
				continue
			}
			temp.push(product)
		}

		updateFilteredProducts(temp)
	}, [filter, products])

	// change title on load
	useEffect(() => {
		document.title = "Products | Darpan"
	}, [])

	return (
		<div className={styles.products}>
			<Filter />
			{filteredProducts && (
				<div className={styles.productsWrapper}>
					{filteredProducts.map(p => (
						<ProductCard key={p.id} {...p} />
					))}
				</div>
			)}
		</div>
	)
}

const mapStateToProps = (state, ownProps) => ({
	...ownProps,
	products: state.products,
	filter: state.filter,
})

export default connect(mapStateToProps)(Products)
