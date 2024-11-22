import sharp from 'sharp';
import { RESULT_SIZE } from '@/config';
import { CargoesTypeOptions } from '@repo/lib/pb';

type SharpInput =
	| Buffer
	| ArrayBuffer
	| Uint8Array
	| Uint8ClampedArray
	| Int8Array
	| Uint16Array
	| Int16Array
	| Uint32Array
	| Int32Array
	| Float32Array
	| Float64Array
	| string;

async function makeTextureImage(paint: SharpInput, cargoType: CargoesTypeOptions) {
	const overlay = await sharp(`./static/cargoes/${cargoType}_canva.png`).resize(RESULT_SIZE, RESULT_SIZE).toBuffer();
	const fixedPaint = await sharp(paint).resize(RESULT_SIZE, RESULT_SIZE, { fit: 'cover' }).toBuffer();

	const buffer = await sharp(fixedPaint, { failOn: 'none' })
		.composite([
			{
				input: overlay
				// gravity: 'center'
			}
		])
		.flatten({ background: '#ffdec1' })
		.toFormat('jpg')
		.toBuffer();

	const blob = new Blob([buffer]);

	return new File([blob], 'cargo_texture.jpg');
}

export { makeTextureImage };
