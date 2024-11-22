import type { ActionResult, SubmitFunction } from '@sveltejs/kit';

function makeEnhanceHandler(args: {
	handlers: Partial<Record<ActionResult['type'], (data?: SubmitResult) => Promise<any>>>;
	files?: { name: string; file: File }[];
	onstart?: () => void;
	onfinish?: () => void;
	validate?: () => any;
	confirmMessage?: string;
}): SubmitFunction {
	const { handlers, files, confirmMessage, validate, onstart, onfinish } = args;
	return async ({ cancel, formData }) => {
		if (!(validate?.() ?? true) || confirmMessage ? confirm(confirmMessage) : false) {
			cancel();
			return;
		}
		onstart?.();

		if (files) {
			for (const { name, file } of files) {
				formData.append(name, file);
			}
		}
		return async ({ update, result }) => {
			await update({ reset: false });
			onfinish?.();

			const handler = handlers[result.type];
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
