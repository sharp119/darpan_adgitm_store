import { action } from "@storybook/addon-actions"
import React from "react"

import Button from "./Button"

// eslint-disable-next-line
export default {
	title: "Button",
	component: Button,
}

const Template = args => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
	onClick: action("button clicked"),
	children: "button",
}

export const Primary = Template.bind({})
Primary.args = {
	...Default.args,
	variant: "primary",
	children: "Primary Button",
}

export const Black = Template.bind({})
Black.args = {
	...Default.args,
	variant: "black",
	children: "I'm a black button",
}

export const Disabled = Template.bind({})
Disabled.args = {
	...Default.args,
	disabled: true,
	children: "I am disabled",
}
