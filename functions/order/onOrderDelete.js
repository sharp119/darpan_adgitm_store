const functions = require("firebase-functions")
const admin = require("firebase-admin")

exports.exports = functions.firestore.document("orders/{orderId}").onDelete(async (snapshot, _) => {
	const orderId = snapshot.id
	const orderData = snapshot.data()

	// if order is not a preapid then just exit
	if (orderData.paymentMethod !== "prepaid") {
		return true
	}

	const paymentScreenshot = admin.storage().bucket().file(`payments/${orderId}`)

	if (!(await paymentScreenshot.exists())) {
		return true
	}

	return paymentScreenshot.delete()
})
