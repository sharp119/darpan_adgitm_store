require("firebase-admin").initializeApp()

exports.admin = require("./admin")
exports.auth = require("./auth")
exports.order = require("./order")
