interface Trigger {
	check: () => boolean;
	action: () => Promise<any>;
}

class Timer {
	now = 0;
	startAt: number;
	interval: NodeJS.Timer;

	constructor(args: { timeout?: number; triggers: Trigger[] }) {
		const { timeout, triggers } = args;
		this.startAt = Date.now();
		this.interval = setInterval(async () => {
			this.now = Date.now();
			for (const trigger of triggers) {
				if (trigger.check()) {
					await trigger.action();
				}
			}
		}, timeout ?? 1000);
	}

	stop() {
		if (!this.interval) return;
		clearInterval(this.interval);
	}

	reset() {
		this.startAt = Date.now();
	}

	get duration() {
		return this.now - this.startAt;
	}
}

export { Timer };
