const functions = require("firebase-functions")
const admin = require("firebase-admin")

exports.onDelete = functions.auth.user().onDelete((user, context) => {
	return new Promise(async (resolve, reject) => {
		const { uid } = user
		try {
			await admin.firestore().collection("carts").doc(uid).delete()
		} catch (error) {
			reject(error)
		}
		resolve(user)
	})
})
