import moment from 'moment';

function getCountDown() {
	const now = moment();
	const [sec, min] = [now.seconds(), now.minutes()];
	const targetMin = Math.ceil(min / 10) * 10;
	const seconds = targetMin * 60 - min * 60 - sec;
	return {
		min: Math.floor(seconds / 60) || 0,
		sec: seconds % 60 || 0
	};
}

export { getCountDown };
