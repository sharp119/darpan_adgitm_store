import React from "react"
import ProductCard from "./ProductCard"

// eslint-disable-next-line
export default {
	title: "Product Card",
	component: ProductCard,
}

const Template = args => <ProductCard {...args} />

export const Default = Template.bind({})
Default.args = { name: "Product", project: "project", price: 99 }

export const OutOfStock = Template.bind({})
OutOfStock.args = { ...Default.args, outOfStock: true, hasInventory: true, inventoryAmount: 0 }
