import sharp from 'sharp';
import { RESULT_SIZE } from '@/config';
import { SuppliesTypeOptions } from '@repo/lib/pb';

async function makeSupplyImage(paint: Buffer | ArrayBuffer, supplyType: SuppliesTypeOptions) {
	const overlay = await sharp(`./static/supplies/${supplyType}_canva.png`).resize(RESULT_SIZE, RESULT_SIZE).toBuffer();

	const fixedPaint = await sharp(paint).resize(RESULT_SIZE, RESULT_SIZE, { fit: 'cover' }).toBuffer();

	const buffer = await sharp(fixedPaint, { failOn: 'none' })
		.composite([
			{
				input: overlay,
				// gravity: 'center'
			}
		])
		.flatten({ background: '#ffffffff' })
		.toFormat('jpg')
		.toBuffer();

	const blob = new Blob([buffer]);

	return new File([blob], 'supply.jpg');
}

export { makeSupplyImage };
