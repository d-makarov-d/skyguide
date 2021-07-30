document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('date').addEventListener('change', onDateChange);
});

function onDateChange() {
	const date = document.getElementById('date').value;
	document.location.href = `/admin/sky?date=${date}`
}
