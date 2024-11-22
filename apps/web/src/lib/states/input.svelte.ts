import type { ParseEnum } from '@repo/lib/types';
import { type CargoesResponse, CargoesTypeOptions } from '@repo/lib/pb';

class InputState {
	cargoType = $state<ParseEnum<CargoesTypeOptions> | null>(null);
	drawDuration = $state(0);

	result = $state<CargoesResponse | null>(null);

	readonly submittable = $derived(this.cargoType && this.drawDuration);

	reset = () => {
		this.cargoType = null;
		this.drawDuration = 0;
		this.result = null;
	};
}

const inputState = new InputState();

export { inputState };
