import React from "react"
import { action } from "@storybook/addon-actions"
import FormInput from "./FormInput"

// eslint-disable-next-line
export default {
	title: "Form/Form Input",
	component: FormInput,
}

const Template = args => <FormInput {...args} />

export const Default = Template.bind({})
Default.args = {
	placeholder: "placeholder",
	onChange: action("value change"),
}

export const Email = Template.bind({})
Email.args = {
	...Default.args,
	placeholder: "you@example.com",
}
export const Invalid = Template.bind({})
Invalid.args = {
	...Default.args,
	defaultValue: "some invalid value",
	isInvalid: true,
	invalidReason: "reason why current value is not acceptable.",
}
