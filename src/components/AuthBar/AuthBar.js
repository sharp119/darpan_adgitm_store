import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Button } from "../../components"
import styles from "./AuthBar.module.scss"
import firebase from "../../firebase"
import { useHistory } from "react-router"

function AuthBar({ authBar, auth }) {
	let [data, updateData] = useState(null)
	let history = useHistory()

	useEffect(() => {
		let unsub = firebase.auth().onAuthStateChanged(
			user => {
				if (!user) {
					updateData(false)
					return
				}

				const name = user.displayName
				const email = user.email
				updateData({ name, email })
			},
			error => {
				updateData(false)
				const { code, message } = error
				console.log("Error while watching auth")
				console.log("Code : ", code)
				console.log("Message : ", message)
			}
		)
		return unsub
	}, [auth])

	const onSingOutClick = async () => await firebase.auth().signOut()

	return (
		<div className={[styles.authBar, authBar.show ? styles.show : ""].join(" ")}>
			{data && (
				<div className={styles.authenticated}>
					<p className={styles.hi}>Hi, {data.name || data.email}</p>
					<Button disabled={true}>Update Profile</Button>
					<Button variant='danger' onClick={onSingOutClick}>
						Sign Out
					</Button>
				</div>
			)}
			{!data && (
				<div className={styles.notAuthenticated}>
					<p className={styles.hi}>You are not logged in.</p>
					<Button variant='white' onClick={() => history.push("/login")}>
						Login
					</Button>
					<p>If you don't have an account.</p>
					<Button variant='black' onClick={() => history.push("/register")}>
						Regsiter
					</Button>
				</div>
			)}
		</div>
	)
}

const mapStateToProps = ({ authBar, auth }, ownProps) => ({
	...ownProps,
	authBar,
	auth,
})

export default connect(mapStateToProps)(AuthBar)
