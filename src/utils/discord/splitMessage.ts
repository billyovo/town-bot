const messageLengthLimit = 2000;
export const splitMessage = (messages: string[], isNewLineRetained: boolean = false): string[] => {
	const list : string[] = [""];
	let current = 0;

	for (const message of messages) {
		if ((list[current].length + message.length) > messageLengthLimit) {
			current++;
			list[current] = "";
		}
		list[current] += message + (isNewLineRetained ? "\n" : "");
	}

	return list;
};
