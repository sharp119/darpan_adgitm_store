import React from "react"

import FormLabel from "./FormLabel"

// eslint-disable-next-line
export default {
	title: "Form/Form Label",
	component: FormLabel,
}

const Template = args => <FormLabel {...args} />

export const Default = Template.bind({})
Default.args = { children: "label" }

export const Email = Template.bind({})
Email.args = { ...Default.args, children: "Email" }
