import validator from 'validator';

export const load = async ({ params }) => {
	const { num } = params;
	let result = 0;
	if (validator.isInt(num)) {
		return { num: result };
	}
	return {
		num: +result
	};
};
