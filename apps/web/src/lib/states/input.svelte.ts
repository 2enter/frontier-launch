import type { ParseEnum } from '@repo/lib/types';
import type { CargoesResponse } from '@repo/lib/pb';

import { getContext, setContext } from 'svelte';
import { CargoesTypeOptions } from '@repo/lib/pb';

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

const INPUT_STATE_CTX = 'INPUT_STATE';

function setInputState() {
	return setContext(INPUT_STATE_CTX, new InputState());
}

function getInputState() {
	return getContext<ReturnType<typeof setInputState>>(INPUT_STATE_CTX);
}

export { setInputState, getInputState };
