const functions = require("firebase-functions")
const admin = require("firebase-admin")

module.exports = functions.https.onCall((order, context) => {
	if (!context.auth) {
		return {
			success: false,
			errors: [{ code: "auth/unathorized", message: "Unathorized user are not allowed to order" }],
		}
	}

	try {
		// reduce inventory for items that have inventory
		order.items.map(async item => {
			const product = await admin.firestore().collection("products").doc(item.id).get()
			const data = product.data()
			if (data.needsConfirmation) return
			if (!data.hasInventory) return

			const quantityOrdered = item.quantity
			if (quantityOrdered === data.inventoryAmount) {
				product.ref.update({ inventoryAmount: 0, outOfStock: true })
			} else {
				product.ref.update({ inventoryAmount: data.inventoryAmount - quantityOrdered })
			}
		})
	} catch (error) {
		return { success: false, errors: [error] }
	}

	return admin
		.firestore()
		.collection("orders")
		.add({
			...order,
			orderedBy: context.auth.uid,
			orderedAt: Date.now(),
		}).then(res => res.id)
})
