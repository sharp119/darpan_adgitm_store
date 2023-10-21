import React from "react"
import styles from "./FormGroup.module.scss"
export default function FromGroup({ children, ...props }) {
	return (
		<div className={styles.formGroup} {...props}>
			{children}
		</div>
	)
}
