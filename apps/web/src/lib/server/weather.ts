import validator from 'validator';

type WeatherInfo = {
	currentWeather: {
		precipitationIntensity: number;
	};
};

async function getRaining() {
	return fetch('https://duckduckgo.com/weather.js?q=Taoyuan&lang=tz')
		.then((res) => res.text())
		.then((data) => {
			const parsedString = data.replace('ddg_spice_forecast(', '').replace('});', '}');
			if (!validator.isJSON(parsedString)) return false;

			const parsedData = JSON.parse(parsedString) as WeatherInfo;

			if (parsedData.currentWeather.precipitationIntensity !== undefined) {
				return parsedData.currentWeather.precipitationIntensity > 0;
			} else {
				return false;
			}
		})
		.catch((err) => {
			console.error(err);
			return false;
		});
}

export { getRaining };
