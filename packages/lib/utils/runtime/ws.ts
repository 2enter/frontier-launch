import { sleep } from './sleep';

function makeWSClient<T>(args: { url: string; onmessage?: (e: MessageEvent<T>) => Promise<void>; onerror?: (e: Event) => Promise<void> }) {
	const { url, onmessage, onerror } = args;
	let ws = new WebSocket(url);

	ws.onopen = () => {
		console.log('ws connected');
	};
	if (onmessage) ws.onmessage = onmessage;
	if (onerror) ws.onerror = onerror;

	ws.onclose = async () => {
		await sleep(3000);
		ws = makeWSClient(args);
	};
	return ws;
}

export { makeWSClient };
