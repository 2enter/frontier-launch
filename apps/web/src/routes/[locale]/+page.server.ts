import type { Action, Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { SuppliesTypeOptions } from '@repo/lib/pb';
import { pb } from '@/server';
import { makeSupplyImage } from '@/image';

const submit: Action = async ({ request, fetch }) => {
	const formData = await request.formData();
	const draw_duration = +(formData.get('draw_duration') as string);
	const type = formData.get('supply_type') as SuppliesTypeOptions;
	const rawPaint = formData.get('paint') as string;

	const blob = await fetch(rawPaint).then((data) => data.blob());
	const buffer = await fetch(rawPaint).then((data) => data.arrayBuffer());

	const paint = new File([blob], 'paint.png');
	const supply = await makeSupplyImage(buffer, type);

	// return fail(500, { message: 'failed' });

	const result = await pb
		.collection('supplies')
		.create({
			draw_duration,
			type,
			paint,
			supply,
			status: 'shipping'
		})
		.catch((e) => {
			console.error(e);
			return fail(500, { message: 'fail' });
		});

	return result;
};

export const actions: Actions = { submit };
