import { sleep } from './sleep';
import * as validator from 'validator';

function makeWSClient<T>(args: { url: string; onmessage?: (data: T) => Promise<void>; onerror?: (e: Event) => Promise<void> }) {
	const { url, onmessage, onerror } = args;
	let ws = new WebSocket(url);

	ws.onopen = () => {
		console.log('ws connected');
	};
	if (onmessage) {
		ws.onmessage = async (e) => {
			if (validator.isJSON(e.data)) {
				await onmessage(JSON.parse(e.data));
			} else {
				console.log(`receiving not JSON message: ${e.data}`);
			}
		};
	}
	if (onerror) ws.onerror = onerror;

	ws.onclose = async () => {
		await sleep(3000);
		ws = makeWSClient(args);
	};
	return ws;
}

export { makeWSClient };
