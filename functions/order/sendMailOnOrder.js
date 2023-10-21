const functions = require("firebase-functions")
const admin = require("firebase-admin")
const sgMail = require("@sendgrid/mail")
const mime = require("mime-types")
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;



module.exports = functions.firestore.document("orders/{orderId}").onCreate(async (snapshot, _) => {
	if (!snapshot.exists) {
		/* This condition should never occur since this functions runs on creation so a snapshot should always exist */
		throw new Error("Order snapshot does not exists")
	}

	let templateData = {
		user: {},
		contact: [],
		items: {
			payable: [],
			needsConfirmation: [],
		},
		totalCost: 0,
		subject: "Your order on Darpan",
		deliveryCharges: 0,
	}

	const orderData = snapshot.data()

	const orderedBy = orderData.orderedBy
	const { displayName: orderedByUserName, email } = await admin.auth().getUser(orderedBy)
	templateData.user.name = orderedByUserName

	// set items details fot template data
	orderData.items.forEach(item => {
		const amount = item.price * item.quantity
		Object.assign(item, { amount })

		if (item.needsConfirmation) {
			templateData.items.needsConfirmation.push(item)
		} else {
			templateData.items.payable.push(item)
			templateData.totalCost += amount
		}
	})

	// set contact details for template data
	Object.entries(orderData.address).forEach(entry => {
		let data
		switch (entry[0]) {
			case "firstName":
				data = { name: "First Name", value: entry[1] }
				break
			case "lastName":
				data = { name: "Last Name", value: entry[1] }
				break
			case "email":
				data = { name: "Email", value: entry[1] }
				break
			case "phone":
				data = { name: "Phone Number", value: entry[1] }
				break
			case "address1":
				data = { name: "Address Line 1", value: entry[1] }
				break
			case "address2":
				data = { name: "Address Line 2", value: entry[1] }
				break
			case "state":
				data = { name: "State", value: entry[1] }
				break
			case "zip":
				data = { name: "Zip", value: entry[1] }
				break
			default:
				break
		}
		templateData.contact.push(data)
	})

	templateData.paymentMethod = orderData.paymentMethod === "cod" ? "Cash On Delivery" : "Prepaid"

	// set delivery cost and payment method
	if (orderData.paymentMethod === "cod") {
		templateData.deliveryCharges += orderData.codCost
	}
	templateData.deliveryCharges += orderData.deliveryCost

	// add cod cost to total charges
	templateData.totalCost += templateData.deliveryCharges

	const emailAttachments = []

	// if payment method is prepaid then attach payment screenshot
	if (orderData.paymentMethod === "prepaid") {
		const paymentScreenshot = admin.storage().bucket().file(`payments/${snapshot.id}`)

		if (await paymentScreenshot.exists()) {
			const paymentScreenshotMetaData = await paymentScreenshot.getMetadata()
			const screenshotExtension = mime.extension(paymentScreenshotMetaData[1].body.contentType)
			const download = await paymentScreenshot.download()
			const fileContent = download[0].toString("base64")
			const attachmentData = {
				content: fileContent,
				filename: "payment screenshot." + screenshotExtension,
				type: paymentScreenshotMetaData.type,
			}
			emailAttachments.push(attachmentData)
		}
	}

	sgMail.setApiKey(SENDGRID_API_KEY);
	const msg = {
		to: [email],
		cc: "enactusadgitm@gmail.com",
		from: "enactusadgitm@gmail.com",
		replyTo: "enactusadgitm@gmail.com",
		templateId: "d-c7ca8cf4ec1647918f8de0944ac942f0",
		dynamicTemplateData: templateData,
		attachments: emailAttachments,
	}
	await sgMail.send(msg)
	return true
})
