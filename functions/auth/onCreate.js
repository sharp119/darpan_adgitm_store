const functions = require("firebase-functions")
const admin = require("firebase-admin")

exports.onCreate = functions.auth.user().onCreate(user => {
	return new Promise(async (resolve, reject) => {
		const { uid, displayName, email } = user

		// create a cart document for user
		try {
			await admin.firestore().collection("carts").doc(uid).create({})
		} catch (error) {
			reject(error)
		}

		if (!displayName) {
			const newName = email.split("@")[0]
			try {
				user = await admin.auth().updateUser(uid, { displayName: newName })
			} catch (error) {
				reject(error)
			}
		}

		resolve(user)
	})
})
