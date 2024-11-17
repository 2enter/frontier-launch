import type { ParseEnum } from '@repo/lib/types';
import { SuppliesTypeOptions } from '@repo/lib/pb';

class InputState {
	supplyType = $state<ParseEnum<SuppliesTypeOptions> | null>(null);
	draw_duration = $state(1);

	readonly submittable = $derived(this.supplyType && this.draw_duration);
}

const inputState = new InputState();

export { inputState };
