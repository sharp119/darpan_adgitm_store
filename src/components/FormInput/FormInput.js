import React from "react"
import PropTypes from "prop-types"
import styles from "./FormInput.module.scss"

export default function FormInput({ type, isInvalid, invalidReason, children, ...props }) {
	return (
		<>
			{type === "select" ? (
				<select className={styles.formInput} {...props}>
					{children}
				</select>
			) : (
				<input className={styles.formInput} type={type} {...props} />
			)}

			{isInvalid && <p className={styles.invalidReason}>{invalidReason || "Please input a correct value."}</p>}
		</>
	)
}

FormInput.propTypes = {
	onChange: PropTypes.func,
	isInvalid: PropTypes.bool,
	invalidReason: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	type: PropTypes.string,
}
