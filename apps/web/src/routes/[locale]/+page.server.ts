import type { Action, Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { CargoesTypeOptions } from '@repo/lib/pb';
import { pb, ws } from '@/server';
import { makeTextureImage } from '@/image';

const submit: Action = async ({ request, fetch, url }) => {
	const formData = await request.formData();
	const draw_duration = +(formData.get('draw_duration') as string);
	const type = formData.get('cargo_type') as CargoesTypeOptions;
	const paint = formData.get('paint') as File;

	console.log(Object.fromEntries(formData));
	const buffer = await paint.arrayBuffer();
	const texture = await makeTextureImage(buffer, type);

	const result = await pb
		.collection('cargoes')
		.create({
			draw_duration,
			type,
			paint,
			texture,
			status: 'shipping'
		})
		.catch((e) => {
			console.error(e);
			return null;
		});

	if (!result) return fail(500, { message: 'fail to upload' });

	ws.broadcast({
		data: {
			type: 'cargo',
			id: result.id,
			cargo_type: type,
			directory: `${url.origin}/api/texture/${result.id}`
		}
	});
	return result;
};

export const actions: Actions = { submit };
