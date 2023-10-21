import React from "react"
import PropTypes from "prop-types"
import styles from "./button.module.scss"

export default function Button({ variant, children, className, ...props }) {
	return (
		<button type='button' className={[styles.button, styles[variant], className].join(" ")} {...props}>
			{children}
		</button>
	)
}

Button.prototype = {
	variant: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
}
