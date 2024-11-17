import type { ParseEnum } from '@repo/lib/types';
import { type CargoesResponse, CargoesTypeOptions } from '@repo/lib/pb';

class InputState {
	cargoType = $state<ParseEnum<CargoesTypeOptions> | null>(null);
	drawDuration = $state(0);

	result = $state<CargoesResponse | null>(null);

	readonly submittable = $derived(this.cargoType && this.drawDuration);
}

const inputState = new InputState();

export { inputState };
