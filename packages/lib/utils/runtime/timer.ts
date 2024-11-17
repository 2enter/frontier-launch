import { parseTime } from '../calc';

interface Trigger {
	check: () => boolean;
	action: () => Promise<any>;
}

class Timer {
	now = 0;
	startAt: number;
	interval: NodeJS.Timer;

	constructor(args: { timeout?: number; triggers?: Trigger[] }) {
		const { timeout, triggers } = args;
		this.startAt = Date.now();
		this.interval = setInterval(async () => {
			this.now = Date.now();
			if (!triggers) return;
			for (const { check, action } of triggers) {
				if (check()) await action();
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

	get parsedTime() {
		return parseTime(this.now);
	}
}

export { Timer };
