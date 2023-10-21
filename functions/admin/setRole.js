const functions = require("firebase-functions")
const admin = require("firebase-admin")

const validRoles = new Set("admin")

exports.setRole = functions.https.onRequest(async (request, response) => {
	try {
		const { email, role } = request.query
		if (!email || !role) {
			let missingFields = []
			if (!email) missingFields.push("email")
			if (!role) missingFields.push("role")
			return response.status(500).send({ error: { missingFields: missingFields } })
		}

		if (!validRoles.has(role)) {
			return response.status(500).send({ error: "Provided role is not valid" })
		}

		const { uid, customClaims } = await admin.auth().getUserByEmail(email)
		await admin.auth().setCustomUserClaims(uid, { ...customClaims, role })

		response.send(`User ${email} now has a role of ${role}`)
	} catch (error) {
		response.status(500).send(error)
	}
})
