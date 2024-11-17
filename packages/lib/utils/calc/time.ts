function parseTime(time = Date.now()) {
	const date = new Date(time);
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		date: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds()
	};
}

export { parseTime };
