export function sanitizeURL(url: string) {
	let parsed;
	try {
		parsed = new URL(url);
	}
	catch (e) {
		return null;
	}
	if (!parsed?.origin || !parsed?.pathname) return null;

	return `${parsed.origin}${ (!parsed.origin.endsWith("/") && !parsed.pathname.startsWith("/")) ? "/" : ""}${parsed.pathname}`;
}