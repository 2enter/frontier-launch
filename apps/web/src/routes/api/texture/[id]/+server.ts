import { PBFile } from '@repo/lib/pb';
import { pb } from '@/server';

export const GET = async ({ params }) => {
	const { id } = params;
	const file = new PBFile({ pb, collection: 'cargoes', field: 'texture', id });
	const buffer = await file.getBuffer();
	return new Response(buffer);
};
