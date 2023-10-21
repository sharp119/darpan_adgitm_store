import styles from "./Checkout.module.scss"
import { Button, FormGroup, FormInput, FormLabel } from "../../components"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import firebase from "../../firebase"

function Checkout({ products }) {
	let [deliveryCharges, updateDeliveryCharges] = useState(0)
	let [codCharges, updateCodCharges] = useState(0)
	let [subtotal, updateSubtotal] = useState(0)
	let [isCodAvailable, updateIsCodAvailable] = useState(true)
	let [isSubmitting, udpateIsSubmitting] = useState(false)
	let [billingData, updateBillingData] = useState({
		firstName: {
			value: "",
			valid: true,
		},
		lastName: {
			value: "",
			valid: true,
		},
		email: {
			value: "",
			valid: true,
		},
		phone: {
			value: "",
			valid: true,
		},
		address1: {
			value: "",
			valid: true,
		},
		address2: {
			value: "",
			valid: true,
		},
		state: {
			value: "delhi",
			valid: true,
		},
		zip: {
			value: "",
			valid: true,
		},
		paymentMethod: {
			value: "prepaid",
			valid: true,
		},
		paymentScreenshot: {
			value: "",
			valid: true,
		},
	})
	let [showConfirmationModal, updateShowConfirmationModal] = useState(false)
	let [showConfirmedModal, updateShowConfirmedModal] = useState(false)

	function onBillingValueChange(name, value) {
		updateBillingData(billingData => {
			if (name === "paymentMethod" && value === "cod") {
				return {
					...billingData,
					[name]: { ...billingData[name], value, valid: true },
					paymentScreenshot: { value: "", valid: true },
				}
			}
			return { ...billingData, [name]: { ...billingData[name], value, valid: true } }
		})
	}

	useEffect(() => {
		let subtotal = 0
		let deliveryCharges = 0
		let codCharges = 0
		let isCodAvailable = true
		for (const product of products) {
			if (product.needsConfirmation) continue

			subtotal += product.quantity * (product.discount ? product.discountedPrice : product.price)

			isCodAvailable = isCodAvailable && !!product.isCodAvailable

			deliveryCharges = deliveryCharges + (product.deliveryCost || 0)
			codCharges = codCharges + (product.codCost || 0)
		}

		updateSubtotal(subtotal)
		updateDeliveryCharges(deliveryCharges)
		updateCodCharges(codCharges)
		updateIsCodAvailable(isCodAvailable)
	}, [products])

	function onSubmit(e) {
		e.preventDefault()
		let isInvalid = false
		let billingDataCopy = Object.assign({}, billingData)
		const requiredFields = [
			"firstName",
			"lastName",
			"email",
			"phone",
			"address1",
			"phone",
			"zip",
			"paymentMethod",
			"paymentScreenshot",
		]

		for (const requiredField of requiredFields) {
			if (!(requiredField in billingDataCopy)) {
				isInvalid = true
				billingDataCopy[requiredField] = { value: "", valid: false }
				continue
			}
			const value = billingDataCopy[requiredField]["value"].trim()

			if (requiredField === "firstName" || requiredField === "lastName") {
				if (!/[a-zA-z\s]{1,}/.test(value)) {
					isInvalid = true
					billingDataCopy[requiredField]["valid"] = false
				}
				continue
			}

			if (requiredField === "email") {
				if (
					value.length === 0 ||
					/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/.test(value)
				) {
					isInvalid = true
					billingDataCopy[requiredField]["valid"] = false
				}
				continue
			}
			if (requiredField === "phone") {
				if (!/[0-9]{10}/.test(value)) {
					isInvalid = true
					billingDataCopy[requiredField]["valid"] = false
				}
				continue
			}

			if (requiredField === "address1") {
				if (value.length < 1) {
					isInvalid = true
					billingDataCopy[requiredField]["valid"] = false
				}
				continue
			}
			if (requiredField === "zip") {
				if (!/[0-9]{6}/.test(value)) {
					isInvalid = true
					billingDataCopy[requiredField]["valid"] = false
				}
				continue
			}
			if (requiredField === "state") {
				if (!/[a-z]{1,}/.test(value)) {
					isInvalid = true
					billingDataCopy[requiredField]["valid"] = false
				}
				continue
			}

			if (requiredField === "paymentScreenshot") {
				if (
					billingDataCopy["paymentMethod"]["value"] === "prepaid" &&
					deliveryCharges + codCharges + subtotal > 0
				) {
					if (value.length === 0) {
						billingDataCopy["paymentScreenshot"]["valid"] = false
						isInvalid = true
					}
				}
			}
		}

		if (isInvalid) {
			updateBillingData(billingDataCopy)
			return
		}

		updateShowConfirmationModal(true)
	}

	async function onSubmitConfirmation() {
		udpateIsSubmitting(true)

		const createOrder = firebase.functions().httpsCallable("order-create")

		let address = {}
		const addressItems = ["firstName", "lastName", "email", "phone", "address1", "phone", "zip"]

		Object.keys(billingData).forEach(key => {
			if (!addressItems.includes(key)) {
				return
			}
			address[key] = billingData[key]["value"]
		})

		let items = []
		for (const product of products) {
			items.push({
				id: product.id,
				name: product.name,
				deliveryCost: product.deliveryCost || 0,
				codCost: product.codCost || 0,
				quantity: product.quantity,
				price: product.discount ? product.discountedPrice : product.price,
				needsConfirmation: product.needsConfirmation || false,
			})
		}

		let orderData = {
			address,
			items,
			deliveryCost: deliveryCharges,
			paymentMethod: billingData["paymentMethod"]["value"],
		}
		if (address["paymentMethod"] === "cod") {
			orderData["codCost"] = codCharges
		}

		try {
			const { data: orderId } = await createOrder(orderData)

			if (billingData["paymentMethod"]["value"] === "prepaid" && deliveryCharges + codCharges + subtotal > 0) {
				await firebase
					.storage()
					.ref(`/payments/${orderId}`)
					.put(document.querySelector("#paymentScreenshot").files[0])
			}

			await firebase.firestore().collection("carts").doc(firebase.auth().currentUser.uid).set({})
			updateShowConfirmedModal(true)
		} catch (error) {
			console.error(error)
		}

		udpateIsSubmitting(false)
	}

	useEffect(() => {
		if (!isCodAvailable && billingData["paymentMethod"]["value"] === "cod") {
			updateBillingData(billingData => ({
				...billingData,
				paymentMethod: { ...billingData["paymentMethod"], value: "prepaid" },
			}))
		}
		// eslint-disable-next-line
	}, [isCodAvailable])

	return (
		<div className={styles.checkout}>
			<div>
				<div className={styles.billingFormWrapper}>
					<form className={styles.billingForm} onSubmit={onSubmit}>
						<p className={styles.heading}>Billing Details</p>
						<div className={styles.name}>
							<FormGroup>
								<FormLabel>First Name</FormLabel>
								<FormInput
									value={billingData["firstName"]["value"]}
									onChange={e => onBillingValueChange("firstName", e.target.value)}
									isInvalid={!billingData["firstName"]["valid"]}
									invalidReason='First name is required and can only contain letters'
								/>
							</FormGroup>
							<FormGroup>
								<FormLabel>Last Name</FormLabel>
								<FormInput
									value={billingData["lastName"]["value"]}
									isInvalid={!billingData["lastName"]["valid"]}
									onChange={e => onBillingValueChange("lastName", e.target.value)}
									invalidReason='Last name is required and can only contain letters'
								/>
							</FormGroup>
						</div>
						<FormGroup>
							<FormLabel>Email</FormLabel>
							<FormInput
								value={billingData["email"]["value"]}
								isInvalid={!billingData["email"]["valid"]}
								onChange={e => onBillingValueChange("email", e.target.value)}
								invalidReason='Email is required and must be a valid email'
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>Phone</FormLabel>
							<FormInput
								type='tel'
								value={billingData["phone"]["value"]}
								isInvalid={!billingData["phone"]["valid"]}
								onChange={e => onBillingValueChange("phone", e.target.value)}
								invalidReason='Phone is required and must be a valid phone number'
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>Address Line 1</FormLabel>
							<FormInput
								value={billingData["address1"]["value"]}
								isInvalid={!billingData["address1"]["valid"]}
								onChange={e => onBillingValueChange("address1", e.target.value)}
								invalidReason='Address line 1 is required'
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>Address Line 2 (optional)</FormLabel>
							<FormInput
								value={billingData["address2"]["value"]}
								isInvalid={!billingData["address2"]["valid"]}
								onChange={e => onBillingValueChange("address2", e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>Zip</FormLabel>
							<FormInput
								maxLength={6}
								minLength={6}
								type='number'
								value={billingData["zip"]["value"]}
								isInvalid={!billingData["zip"]["valid"]}
								onChange={e => onBillingValueChange("zip", e.target.value)}
								invalidReason='Zip is required and must be 6 digits'
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>State</FormLabel>
							<FormInput
								type='select'
								value={billingData["state"]["value"]}
								isInvalid={!billingData["state"]["valid"]}
								invalidReason='State is required'
								onChange={e => onBillingValueChange("state", e.target.value)}>
								<option value='delhi'>Delhi</option>
							</FormInput>
						</FormGroup>

						<p className={styles.heading}>Payment</p>

						<FormGroup>
							<FormLabel>Method</FormLabel>
							<FormInput
								type='select'
								value={billingData["paymentMethod"]["value"]}
								isInvalid={!billingData["paymentMethod"]["valid"]}
								onChange={e => onBillingValueChange("paymentMethod", e.target.value)}>
								<option value='prepaid'>Prepaid</option>
								{isCodAvailable && <option value='cod'>COD</option>}
							</FormInput>
						</FormGroup>

						{billingData["paymentMethod"]["value"] === "prepaid" &&
							deliveryCharges + codCharges + subtotal > 0 && (
								<FormGroup>
									<FormLabel>Screenshot</FormLabel>
									<FormInput
										id='paymentScreenshot'
										isInvalid={!billingData["paymentScreenshot"]["valid"]}
										accept='image/png, image/jpg, image/jpeg'
										value={billingData["paymentScreenshot"]["value"]}
										onChange={e => onBillingValueChange("paymentScreenshot", e.target.value)}
										type='file'></FormInput>
								</FormGroup>
							)}

						<Button type='submit' variant='black' disabled={products.length === 0 || isSubmitting}>
							Checkout
						</Button>
					</form>
				</div>
			</div>
			<div className={styles.cartWrapper}>
				<p className={styles.heading}>
					<span>Your Cart</span>
					<span className={styles.count}>{products.length}</span>
				</p>
				{products.map(product => {
					return (
						<div key={product.id} className={styles.item}>
							<div className={styles.left}>
								<p className={styles.name}>{product.name}</p>
								<p className={styles.quantity}>x {product.quantity}</p>
								{product.needsConfirmation && <p className={styles.nonChargeable}>Non-chargeable</p>}
							</div>
							<div className={styles.right}>
								<p>
									₹ {product.quantity * (product.discount ? product.discountedPrice : product.price)}
								</p>
							</div>
						</div>
					)
				})}
				<div className={styles.charges}>
					<p>Delivery Charges</p>
					<p>₹ {deliveryCharges + (billingData["paymentMethod"]["value"] === "cod" ? codCharges : 0)}</p>
				</div>
				<div className={styles.charges}>
					<p>Total Charges</p>
					<p>
						₹{" "}
						{subtotal +
							deliveryCharges +
							(billingData["paymentMethod"]["value"] === "cod" ? codCharges : 0)}
					</p>
				</div>
			</div>

			{showConfirmationModal && (
				<div className={styles.confirmationModalWrapper}>
					<div className={styles.modal}>
						<div className={styles.confirmationBox}>
							<p className={styles.message}>Are you sure you want to proceed?</p>
							<div className={styles.buttons}>
								<Button variant='danger' onClick={() => updateShowConfirmationModal(false)}>
									Cancel
								</Button>
								<Button
									disabled={isSubmitting}
									variant='black'
									onClick={async () => {
										await onSubmitConfirmation()
										updateShowConfirmationModal(false)
									}}>
									Yes
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
			{showConfirmedModal && (
				<div className={styles.confirmedModalWrapper}>
					<div className={styles.modal}>
						<div className={styles.confirmationBox}>
							<p className={styles.message}>Thankyou for your order. We will contact you if needed.</p>
							<div className={styles.buttons}>
								<Button disabled={isSubmitting} onClick={() => updateShowConfirmedModal(false)}>
									Ok
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function mapStateToProps(state) {
	const { products, cart } = state

	let productsInCart = []
	if (!products || !cart) {
		return { products: productsInCart }
	}

	for (const product of products) {
		const { id } = product
		let productInCart = cart[id]

		if (!productInCart) continue

		productsInCart.push({ ...product, quantity: productInCart })
	}

	return { products: productsInCart }
}

export default connect(mapStateToProps)(Checkout)
