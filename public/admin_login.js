async function onAdminLogin() {
	const login = document.getElementById('login').value;
	const password = document.getElementById('password').value;

	const resp = await fetch('/admin/login', {
		method: 'POST',
		body: JSON.stringify({
			login,
			password,
		}),
		headers: {"Content-Type": "application/json"},
	});

	const message = document.getElementById("error")
	switch (resp.status) {
		case 401: {
			message.hidden = undefined;
			message.textContent = await resp.text();
			break;
		}
		case 500: {
			message.hidden = undefined;
			message.textContent = 'Authentication failed';
			break;
		}
		case 200: {
			document.location.href = `/admin/sky`;
			break;
		}
	}
}
