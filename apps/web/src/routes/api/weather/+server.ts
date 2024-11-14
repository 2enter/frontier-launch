import validator from 'validator';
import { json } from '@sveltejs/kit';

type WeatherInfo = {
	currentWeather: {
		precipitationIntensity: number;
	};
};

export const GET = async ({ url }) => {
	const params = url.searchParams;
	const value = params.get('value');
	if (value) return json(+value > 0 ? 1 : 0);

	const raining: 0 | 1 = await fetch('https://duckduckgo.com/weather.js?q=Taoyuan&lang=tz')
		.then((res) => res.text())
		.then((data) => {
			const parsed_string = data.replace('ddg_spice_forecast(', '').replace('});', '}');
			if (!validator.isJSON(parsed_string)) return 0;

			const parsed_data = JSON.parse(parsed_string) as WeatherInfo;

			if (parsed_data.currentWeather.precipitationIntensity !== undefined) {
				const value = parsed_data.currentWeather.precipitationIntensity;
				return value > 0 ? 1 : 0;
			} else {
				return 0;
			}
		})
		.catch((_err) => {
			// console.log(err);
			return 0;
		});

	return json(raining);
};
