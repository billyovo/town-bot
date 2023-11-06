export function logger(message : string) {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ${message}`);
}

