import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
import { inputState, sysState } from '@/states';
function makeEnhanceHandler(args: {
	handlers: Partial<Record<ActionResult['type'], (data?: SubmitResult) => Promise<any>>>;
	confirmMessage?: string;
}): SubmitFunction {
	const { handlers, confirmMessage } = args;
	return ({ cancel }) => {
		if (!inputState.submittable || confirmMessage ? confirm(confirmMessage) : false) {
			cancel();
			return;
		}
		sysState.processing = true;
		return async ({ update, result }) => {
			await update({ reset: false });
			sysState.processing = false;
			const { type } = result;
			const handler = handlers[type];
			if (!handler) return;
			if ('data' in result) {
				const data = result.data as SubmitResult;
				await handler(data);
			} else {
				await handler();
			}
		};
	};
}

export { makeEnhanceHandler };
