document.addEventListener('DOMContentLoaded', () => {
	const allCenter = document.getElementsByClassName('all-center')[0];
	const containers = document.getElementsByClassName('bottomable');
	for (let i = 0; i < containers.length; i++) {
		const container = containers[i];
		let inp;
		for (let ii = 0; ii < container.children.length; ii++) {
			if (container.children[ii].tagName === 'INPUT') {
				inp = container.children[ii];
				break;
			}
		}
		if (!inp) continue;

		const removed = [];
		const added = [];
		inp.addEventListener('focus', () => {
			const width  = window.innerWidth || document.documentElement.clientWidth ||
				document.body.clientWidth;
			if (width > 600) return
			added.push('bottomed');
			removed.push('col');
			if (container.classList.contains('input-field')) {
				removed.push('input-field');
			}
			added.forEach((prop) => container.classList.add(prop));
			removed.forEach((prop) => container.classList.remove(prop));
			allCenter.style.height = '100%';
		})
		inp.addEventListener('blur', () => {
			const width  = window.innerWidth || document.documentElement.clientWidth ||
				document.body.clientWidth;
			if (width > 600) return
			allCenter.style.height = 'unset';
			added.forEach((prop) => container.classList.remove(prop));
			removed.forEach((prop) => container.classList.add(prop));
		})
	}

	const footer = document.getElementsByClassName('page-footer')[0];
	footer.onclick = () => {
		const container = document.getElementById('in-footer');
		if (container.classList.contains('hide-on-small-only')) {
			container.classList.remove('hide-on-small-only');
			footer.style.opacity = '1';
		} else {
			container.classList.add('hide-on-small-only');
			footer.style.opacity = '0.5';
		}
	}

	// add form submission callback
	const form = document.getElementById('reg_form');
	form.addEventListener('submit', onClientSubmit);

	// add date select callback
	document.getElementById('date').addEventListener('change', onDateChange);

	// validate phone number
	document.getElementById("phone").addEventListener("keyup", () => {
		const field = document.getElementById("phone")
		const val = field.value;
		if(!val || !val.length) {
			return;
		}

		const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
		if(regex.test(val)) {
			field.classList.remove("invalid");
			field.classList.add("valid");
		} else {
			field.classList.remove("valid");
			field.classList.add("invalid");
		}
	});

	// init date picker
	const datepickers = document.querySelectorAll('.datepicker');
	const datepicker = M.Datepicker.init(datepickers, {
		format: 'dd.mm.yyyy',
		defaultDate: new Date(),
		setDefaultDate: true
	})[0];
	datepicker.options.onSelect = onDateChange;

	// init colapsable
	const colapsables = document.querySelectorAll('.collapsible');
	const colapsableInstance = M.Collapsible.init(colapsables)[0];
	const dropdownIcon = document.querySelectorAll('#ic_dropdown')[0];
	colapsableInstance.options.onOpenStart = () => {
		dropdownIcon.classList.add('play-rot-st');
	};
	colapsableInstance.options.onOpenEnd = () => {
		dropdownIcon.classList.remove('play-rot-st');
		dropdownIcon.classList.add('play-rot-down');
	};
	colapsableInstance.options.onCloseStart = () => {
		dropdownIcon.classList.add('play-rot-end');
	};
	colapsableInstance.options.onCloseEnd = () => {
		dropdownIcon.classList.remove('play-rot-end');
		dropdownIcon.classList.remove('play-rot-down');
	};

	let carouselInited = false;

	// init tabs
	const tabs = document.querySelectorAll('.tabs');
	M.Tabs.init(tabs, {
		fullWidth: true,
		indicators: true,
		onShow: (tab) => {
			if (tab.id === 'about' && !carouselInited) {
				// init carousel on tab active
				const carousels = document.querySelectorAll('.carousel');
				M.Carousel.init(carousels);
				carouselInited = true;
			}
		}
	});

	// set carousel viewport according to screen dimensions
	const items = document.getElementsByClassName('carousel-item')
	for (const item of items) {
		if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
			item.children[0].style.height = '100%';
			item.children[0].style.width = 'auto';
		} else {
			item.children[0].style.height = 'auto';
			item.children[0].style.width = '100%';
		}
	}
});


/**
 * Called on client form submission
 * @return {Promise<void>}
 */
async function onClientSubmit() {
	// get elements
	const name = document.getElementById('name').value
	const phone = document.getElementById('phone').value
	const datepickers = document.querySelectorAll('.datepicker');
	const datepicker = M.Datepicker.getInstance(datepickers[0])
	const date = (new Date(new Date(datepicker.date.toDateString()) + ' GMT +0')).toISOString().slice(0, 10)
	const people = document.getElementById('people').value
	const pin = document.getElementById('pin').value

	const resp = await fetch("/", {
		method: 'POST',
		body: JSON.stringify({
			name,
			phone,
			date,
			people,
			pin
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
	const datepickers = document.querySelectorAll('.datepicker');
	const datepicker = M.Datepicker.getInstance(datepickers[0])
	const date = (new Date(new Date(datepicker.date.toDateString()) + ' GMT +0')).toISOString().slice(0, 10)

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
