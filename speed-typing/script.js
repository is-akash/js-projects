const $quoteDisplay = document.getElementById('quoteDisplay');
const $loadParagraphBtn = document.getElementById('loadParagraph');
const $quoteInput = document.getElementById('quoteInput');
const $timerElement = document.getElementById('timer');

const fetchRandomWord = async () => {
	try {
		const response = await fetch(config.randomWordApiUrl, {
			headers: {
				'x-api-key': config.apiKey,
			},
		});

		if (!response.ok) throw new Error('Failed to fetch random word.');

		const data = await response.json();
		return data.word[0];
	} catch (error) {
		console.error('Error while fetching random word: ', error);
		return null;
	}
};

const fetchHistoricalEvent = async () => {
	try {
		const randomWord = await fetchRandomWord();
		if (!randomWord) {
			console.error('No random word available.');
			return null;
		}
		console.log('Fetched random word:', randomWord);

		const response = await fetch(`${config.historicalEventApiUrl}${randomWord}`, {
			headers: {
				'x-api-key': config.apiKey,
			},
		});

		if (!response.ok) throw new Error('Failed to fetch historical event.');

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error while fetching the historical event: ', error);
		return null;
	}
};

const fetchParagraph = async (retries = 3) => {
	$quoteDisplay.innerText = 'Loading new paragraph...';
	if (retries <= 0) {
		console.error('Max retries reached. Stopping attempts.');
		$quoteDisplay.classList.add('error');
		$quoteDisplay.innerText = 'Failed to fetch, please try again!!';
		return;
	}

	const HistoricalEvents = await fetchHistoricalEvent();

	if (!HistoricalEvents || HistoricalEvents.length === 0) {
		console.error('No historical events found. Retrying ...');
		await fetchParagraph(retries - 1);
		return;
	} else {
		console.log('Fetched Historical Events:', HistoricalEvents);
		$quoteDisplay.classList.remove('error');
		setQuoteDisplay(HistoricalEvents[0].event);
		$quoteInput.value = null;
	}
};

const setQuoteDisplay = (paragraph) => {
	$quoteDisplay.innerText = '';
	paragraph.split('').forEach((character) => {
		const characterSpan = document.createElement('span');
		characterSpan.innerText = character;
		$quoteDisplay.appendChild(characterSpan);
	});
};

let startTime;
const startTimer = () => {
	$timerElement.innerText = 0;
	startTime = new Date();
	setInterval(() => {
		$timerElement.innerText = getTimerTime();
	}, 1000);
};

const getTimerTime = () => {
	return Math.floor((new Date() - startTime) / 1000);
};

$loadParagraphBtn.addEventListener('click', fetchParagraph);
$quoteInput.addEventListener('focus', () => {
	const arrayParagraph = $quoteDisplay.querySelectorAll('span');
	if (arrayParagraph.length > 0) {
		startTimer();
	}
});

$quoteInput.addEventListener('input', () => {
	let correct = true;
	const arrayParagraph = $quoteDisplay.querySelectorAll('span');
	if (arrayParagraph.length > 0) {
		const arrayValue = $quoteInput.value.split('');
		arrayParagraph.forEach((characterSpan, i) => {
			const character = arrayValue[i];
			if (character == null) {
				characterSpan.classList.remove('correct');
				characterSpan.classList.remove('incorrect');
				correct = false;
			} else if (character === characterSpan.innerText) {
				characterSpan.classList.add('correct');
				characterSpan.classList.remove('incorrect');
			} else {
				characterSpan.classList.add('incorrect');
				characterSpan.classList.remove('correct');
				correct = false;
			}
		});
		if (correct) fetchParagraph();
	}
});
