import React, { useEffect, useState } from "react"
import { Button, FormGroup, FormInput, FormLabel } from "../../components"
import { Icon } from "@iconify/react"
import googleIcon from "@iconify-icons/mdi/google"
import firebase from "../../firebase"

import styles from "./Register.module.scss"
import { connect } from "react-redux"
import { useHistory } from "react-router"

function Register({ auth }) {
	let [isEmailInvalid, UpdateIsEmailInvalid] = useState(false)
	let [emailInvalidReason, updateEmailInvalidReason] = useState(null)
	let [isPasswordlInvalid, UpdateIsPasswordlInvalid] = useState(false)
	let [passwordInvalidReason, updatePasswordlInvalidReason] = useState(null)
	let [isSubmitting, updateIsSubmitting] = useState(false)
	let history = useHistory()

	useEffect(() => {
		if (auth === true) {
			history.replace("/products")
		}
		// eslint-disable-next-line
	}, [auth])

	async function registerWitEmailPassword(event) {
		event.preventDefault()

		// get form values
		const email = document.querySelector("form#loginForm input#email").value
		const password = document.querySelector("form#loginForm input#password").value

		updateIsSubmitting(true)
		try {
			const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
			console.log(res)
		} catch (error) {
			const { code } = error
			switch (code) {
				case "auth/email-already-in-use":
					UpdateIsEmailInvalid(true)
					updateEmailInvalidReason("Email is already in use.")
					break
				case "auth/invalid-email":
					UpdateIsEmailInvalid(true)
					updateEmailInvalidReason("Please enter a correct email.")
					break
				case "auth/wrong-password":
					UpdateIsPasswordlInvalid(true)
					updatePasswordlInvalidReason("The password is invalid or you do not have a password")
					break
				case "auth/weak-password":
					UpdateIsPasswordlInvalid(true)
					updatePasswordlInvalidReason("The password must be atleast 6 characters long")
					break
				default:
					break
			}
		}
		updateIsSubmitting(false)
	}

	function onValueChange(event) {
		const { id } = event.target
		if (id === "password" && isPasswordlInvalid) {
			UpdateIsPasswordlInvalid(false)
			updatePasswordlInvalidReason(null)
			return
		}
		if (id === "email" && isEmailInvalid) {
			UpdateIsEmailInvalid(false)
			updateEmailInvalidReason(null)
		}
	}

	async function registerWithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider()

		updateIsSubmitting(true)
		try {
			await firebase.auth().signInWithRedirect(provider)
		} catch (error) {
			const { code, message } = error
			console.log("Code : ", code)
			console.log("Message : ", message)
		}
		updateIsSubmitting(false)
	}

	useEffect(() => {
		async function getRedirectResult() {
			try {
				await firebase.auth().getRedirectResult()
			} catch (error) {
				const { code, message } = error
				console.log("Error in Redirect result")
				console.log("Code : ", code)
				console.log("Message : ", message)
			}
		}
		updateIsSubmitting(true)
		getRedirectResult()
		updateIsSubmitting(false)
	}, [])

	// change title on load
	useEffect(() => {
		document.title = "Login | Daran"
	}, [])

	// change title on load
	useEffect(() => {
		document.title = "Regsiter | Daran"
	}, [])

	return (
		<div className={styles.register}>
			<form className={styles.registerForm} id='loginForm'>
				<h1>Register</h1>
				<FormGroup>
					<FormLabel>Email</FormLabel>
					<FormInput
						id='email'
						isInvalid={isEmailInvalid}
						invalidReason={emailInvalidReason}
						onChange={onValueChange}
						placeholder='you@example.com'
						type='email'
						disabled={isSubmitting}
						required></FormInput>
				</FormGroup>
				<FormGroup>
					<FormLabel>Password</FormLabel>
					<FormInput
						id='password'
						isInvalid={isPasswordlInvalid}
						invalidReason={passwordInvalidReason}
						placeholder='shhhh!'
						onChange={onValueChange}
						disabled={isSubmitting}
						type='password'></FormInput>
				</FormGroup>
				<Button
					variant='black'
					type='submit'
					disabled={isSubmitting}
					style={{ width: "100%" }}
					onClick={registerWitEmailPassword}>
					Next
				</Button>

				<h3>OR</h3>
				<Button disabled={isSubmitting} className={styles.googleButton} onClick={registerWithGoogle}>
					<Icon icon={googleIcon} /> Register with Google
				</Button>
				<p className={styles.alreadyAccount}>
					Already have an account? <a href='/login'>Login Now</a>
				</p>
			</form>
		</div>
	)
}

const mapStateToProps = state => ({
	auth: state.auth,
})

export default connect(mapStateToProps)(Register)
