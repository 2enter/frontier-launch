import type { ParseEnum } from '@repo/lib/types';

import { BunWS, startHelperServer } from '@repo/lib/server';
import { SuppliesTypeOptions } from '@repo/lib/pb';

import { WS_HELPER_PORT } from '$env/static/private';

type WSData = {
	message?: string;
	data?:
		| {
				type: 'supply';
				supply_type: ParseEnum<SuppliesTypeOptions>;
				id: string;
				directory: string;
		  }
		| {
				type: 'launch';
				supply_amount: number;
		  }
		| {
				type: 'weather';
				raining: boolean;
		  }
		| {};
};

const ws = new BunWS<WSData>({
	onopen: () => {
		console.log(`open, clients: ${ws.clients.size}`);
	},
	onmessage: (ws, message) => {
		console.log(`received message: ${message}`);
	},
	onclose: (ws, code, message) => {
		console.log(code, message);
	}
});

startHelperServer(ws, +WS_HELPER_PORT);

export { ws };
