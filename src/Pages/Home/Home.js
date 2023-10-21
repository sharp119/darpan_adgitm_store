import { useEffect } from "react"
import { useHistory } from "react-router"

export default function Home() {
	let history = useHistory()

	useEffect(() => {
		history.replace("/products")
		// eslint-disable-next-line
	}, [])

	return null
}
