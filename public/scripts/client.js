/**
 * Called on client form submission
 * @return {Promise<void>}
 */
async function onClientSubmit() {
	// get elements
	const name = document.getElementById('name').value
	const phone = document.getElementById('phone').value
	const date = document.getElementById('date').value
	const people = document.getElementById('people').value

	const resp = await fetch("/", {
		method: 'POST',
		body: JSON.stringify({
			name,
			phone,
			date,
			people
		}),
		headers: {"Content-Type": "application/json"},
	})
	switch (resp.status) {
		case 200: {
			const str = await resp.text();
			const data = JSON.parse(str);
			const free = document.getElementById('free');
			free.textContent = data.free;
			alert('Registration successful');

			break;
		}
		case 409: {
			const str = await resp.text();
			alert(str);
			break;
		}
		default: {
			alert('Server error');
		}
	}
}

/**
 * Called on client date change, fetches occupied places with server
 */
async function onDateChange() {
	const date = document.getElementById('date').value

	const resp = await fetch(`/occupied?date=${date}`, {
		method: 'GET'
	})

	if (resp.ok) {
		const str = await resp.text();
		const data = JSON.parse(str);
		const free = document.getElementById('free');
		free.textContent = data.free;
	}
}
