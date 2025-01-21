import type { Locale } from '@/localizations';

import { redirect } from '@sveltejs/kit';
import { DEFAULT_LOCALE, LOCALES, localizations } from '@/localizations';

export const load = async ({ setHeaders, params }) => {
	const locale = params.locale as Locale;
	if (!LOCALES.includes(locale)) {
		redirect(308, `/${DEFAULT_LOCALE}`);
	}
	const localization = localizations[locale];
	// setHeaders({
	// 	// 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate, s-maxage=0, private',
	// 	'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
	// 	Pragma: 'no-cache',
	// 	Expires: '0'
	// });
	return { locale, localization };
};

export const ssr = false;
