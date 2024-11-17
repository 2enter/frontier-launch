import type { ParseEnum } from '@repo/lib/types';

import { BunWS, startHelperServer } from '@repo/lib/server';
import { CargoesTypeOptions } from '@repo/lib/pb';

import { WS_HELPER_PORT } from '$env/static/private';

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

const ws = new BunWS<WSData>({
	onopen: () => {
		console.log(`open, clients: ${ws.clients.size}`);
	},
	onmessage: (_, message) => {
		console.log(`received message: ${message}`);
	},
	onclose: (_, code, message) => {
		console.log(code, message);
	}
});

startHelperServer(ws, +WS_HELPER_PORT);

export { ws };
