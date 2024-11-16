import type { ParseEnum } from '@repo/lib/types';
import { SuppliesTypeOptions } from '@repo/lib/pb';

class InputState {
	supplyType = $state<ParseEnum<SuppliesTypeOptions> | null>(null);

	readonly submittable = $derived(!!this.supplyType);
}

const inputState = new InputState();

export { inputState };
