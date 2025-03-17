import { ChatInputCommandInteraction } from "discord.js";

export function splitMessage(text : string, { maxLength = 2000, char = "\n", prepend = "", append = "" } = {}) {
	if (text.length <= maxLength) return [text];
	const splitText = text.split(char);
	if (splitText.some(chunk => chunk.length > maxLength)) throw new RangeError("SPLIT_MAX_LEN");
	const messages = [];
	let msg = "";
	for (const chunk of splitText) {
		if (msg && (msg + char + chunk + append).length > maxLength) {
			messages.push(msg + append);
			msg = prepend;
		}
		msg += (msg && msg !== prepend ? char : "") + chunk;
	}
	return messages.concat(msg).filter(m => m);
}

export async function sendSplitMessage(interaction : ChatInputCommandInteraction, messages : string[]) {
	if (!(messages.length > 1)) return;
	for (let i = 1; i < messages.length; i++) {
		await interaction.followUp({
			content: messages[i] + "\r\n",
		});
	}
}