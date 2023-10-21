import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/functions"
import "firebase/auth"

const firebaseConfig = {
	apiKey: "AIzaSyC1B3VtIXClfXclYSGAB_aU4ECImXCFG7E",
	projectId: "test-e1c07",
	storageBucket: "test-e1c07.appspot.com",
	messagingSenderId: "182234685125",
	appId: "1:182234685125:web:ad5cd2118351f109ea9aac",
	authDomain: "test-e1c07.firebaseapp.com",
}

firebase.initializeApp(firebaseConfig)

// if (process.env.NODE_ENV === "development") {
// 	firebase.auth().useEmulator("http://localhost:9099")
// 	firebase.firestore().useEmulator("localhost", 8080)
// 	firebase.functions().useEmulator("localhost", 5001)
// }

export default firebase
