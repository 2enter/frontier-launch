// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { CargoesResponse, CargoesTypeOptions } from '@repo/lib/pb';
import type { ParseEnum } from '@repo/lib/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type PageNum = 0 | 1 | 2 | 3;
	type SubmitResult = CargoesResponse;
	type WSData = {
		message?: string;
		data?:
			| {
					type: 'cargo';
					cargo_type: ParseEnum<CargoesTypeOptions>;
					id: string;
					directory: string;
			  }
			| {
					type: 'launch';
					cargo_amount: number;
			  }
			| {
					type: 'weather';
					raining: boolean;
			  };
	};
}

export {};
