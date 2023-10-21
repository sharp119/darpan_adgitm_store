import React from "react"
import PropTypes from "prop-types"
import styles from "./FormLabel.module.scss"

export default function FormLabel({ children, ...props }) {
	return (
		<label className={styles.formLabel} {...props}>
			{children}
		</label>
	)
}

FormLabel.propTypes = {
	children: PropTypes.any,
}
