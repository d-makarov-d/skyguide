/**
 * Called on client form submission
 * @return {Promise<void>}
 */
async function onClientSubmit() {
	// get elements
	const name = document.getElementById('name').value
	const phone = document.getElementById('phone').value
	const date = document.getElementById('date').value

	const resp = await fetch("/reg", {
		method: 'POST',
		body: JSON.stringify({
			name,
			phone,
			date
		}),
		headers: {"Content-Type": "application/json"},
	})
	console.log(resp)
}
