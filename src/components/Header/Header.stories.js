import React from "react"
import Header from "./Header"

// eslint-disable-next-line
export default {
	title: "Header",
	component: Header,
}

const template = args => <Header {...args} />

export const Default = template.bind({})
Default.args = {}
