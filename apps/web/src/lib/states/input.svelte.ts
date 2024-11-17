import type { ParseEnum } from '@repo/lib/types';
import { CargoesTypeOptions } from '@repo/lib/pb';

class InputState {
	cargoType = $state<ParseEnum<CargoesTypeOptions> | null>(null);
	drawDuration = $state(1);

	readonly submittable = $derived(this.cargoType && this.drawDuration);
}

const inputState = new InputState();

export { inputState };
