const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
let darkModeEnabled = false;

const isExtension = typeof browserAPI !== 'undefined' && browserAPI.storage && browserAPI.storage.local;

function updateDarkModeUI() {
	const btn = document.getElementById('dark-mode-btn');
	if (darkModeEnabled) {
		document.body.classList.add('dark-mode');
		btn.textContent = '☀️';
		btn.title = 'Switch to light mode';
	} else {
		document.body.classList.remove('dark-mode');
		btn.textContent = '🌙';
		btn.title = 'Switch to dark mode';
	}
}

function init() {
	document.getElementById('dark-mode-btn').addEventListener('click', () => {
		darkModeEnabled = !darkModeEnabled;
		if (isExtension) {
			browserAPI.storage.local.set({ darkModeEnabled });
		}
		updateDarkModeUI();
	});

	document.getElementById('save-btn').addEventListener('click', () => {
		let urlInput = document.getElementById('urlInput');
		let pointsInput = document.getElementById('pointsInput');
		let minutesInput = document.getElementById('minutesInput');
		if (!pointsInput.value.match(/^[1-9]+0*$/) || !minutesInput.value.match(/^[1-9]+0*$/)) {
			return;
		}
		if (isExtension) {
			browserAPI.storage.local.set({
				pointsURL: urlInput.value,
				pointsReward: pointsInput.value,
				minuteFrequency: minutesInput.value
			});
		}
		let notif = document.createElement("div");
		notif.className = "mikan-change-notif"
		notif.innerText = "Changes saved";
		document.documentElement.appendChild(notif);
		window.setTimeout(() => { notif.remove(); }, 1999);
	});

	let urlInput = document.getElementById('urlInput');
	let pointsInput = document.getElementById('pointsInput');
	let minutesInput = document.getElementById('minutesInput');

	if (isExtension) {
		// Load initial data including dark mode setting
		browserAPI.storage.local.get(['pointsReward', 'minuteFrequency', 'pointsURL', 'darkModeEnabled'], (result) => {
			urlInput.value = result.pointsURL;
			pointsInput.value = result.pointsReward;
			minutesInput.value = result.minuteFrequency;
			darkModeEnabled = result.darkModeEnabled === true;
			updateDarkModeUI();
		});

		// Listen for changes
		browserAPI.storage.onChanged.addListener((changes) => {
			if (changes.darkModeEnabled) {
				darkModeEnabled = changes.darkModeEnabled.newValue;
				updateDarkModeUI();
			}
		});
	}
}

init();
