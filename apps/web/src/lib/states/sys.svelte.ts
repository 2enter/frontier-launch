import type { Locale } from '@/localizations';
import { setContext, getContext } from 'svelte';
import { DEFAULT_LOCALE, localizations } from '@/localizations';

class SysState {
	processing = $state(false);
	errorMessage = $state<string | null>(null);
	pageNum = $state<PageNum>(0);
	dialog = $state<HTMLDialogElement>();
	bg = $derived.by(() => {
		switch (this.pageNum) {
			case 0:
			case 3:
				return '/ui/layouts/paper.webp';
			default:
				return '/ui/layouts/factory_bg.webp';
		}
	});

	locale = $state<Locale>(DEFAULT_LOCALE);

	readonly localization = $derived(localizations[this.locale]);

	popError = (message: string) => {
		this.errorMessage = message;
		if (!this.dialog) return;
		this.dialog.showModal();
	};

	closeError = () => {
		this.errorMessage = null;
		if (!this.dialog) return;
		this.dialog.close();
	};

	navigate = (step?: any) => {
		if (typeof step !== 'number') {
			step = 1;
		}

		let result = this.pageNum + step;

		if (result < 0 || result > 6) {
			console.error('invalid page navigation');
			return;
		}

		this.pageNum = result as PageNum;
	};

	routeTo = (num: PageNum) => {
		this.pageNum = num;
	};
}

const SYS_STATE_CTX = 'SYS_STATE';

function setSysState() {
	return setContext(SYS_STATE_CTX, new SysState());
}

function getSysState() {
	return getContext<ReturnType<typeof setSysState>>(SYS_STATE_CTX);
}

export { setSysState, getSysState };
