const messageLengthLimit = 2000;
export const splitMessage = (messages: string[]): string[] => {
	const list : string[] = [""];
	let current = 0;

	for (const message of messages) {
		if ((list[current].length + message.length) > messageLengthLimit) {
			current++;
			list[current] = "";
		}
		list[current] += message;
	}

	return list;
};