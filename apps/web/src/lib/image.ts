import sharp from 'sharp';
import { RESULT_SIZE } from '@/config';
import { CargoesTypeOptions } from '@repo/lib/pb';

async function makeTextureImage(paint: Buffer | ArrayBuffer, cargoType: CargoesTypeOptions) {
	const overlay = await sharp(`./static/cargoes/${cargoType}_canva.png`).resize(RESULT_SIZE, RESULT_SIZE).toBuffer();
	const fixedPaint = await sharp(paint).resize(RESULT_SIZE, RESULT_SIZE, { fit: 'cover' }).toBuffer();

	const buffer = await sharp(fixedPaint, { failOn: 'none' })
		.composite([
			{
				input: overlay
				// gravity: 'center'
			}
		])
		.flatten({ background: '#ffffffff' })
		.toFormat('jpg')
		.toBuffer();

	const blob = new Blob([buffer]);

	return new File([blob], 'cargo_texture.jpg');
}

export { makeTextureImage };
