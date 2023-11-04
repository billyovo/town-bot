import { Message, PermissionsBitField } from "discord.js";
import config from "../../configs/config.json";
import { handleWinnerAnnouncement, setWinner } from "../../utils/discord/textCommands/winner";

export async function handleTextCommand(message: Message) {
	if (!message.content.startsWith(config.prefix)) return;
	if (message.member && !message.member.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;

	const [command, ...args] = message.content.slice(config.prefix.length).split(" ");

	if (command === "winner") {
		const server = args[0];
		const playerName = args[1];
		const gameName = args[3] ? `${args[2]} ${args[3]}` : args[2];
		message.delete();
		await setWinner({
			server: server,
			playerName: playerName,
			gameName: gameName,
		});
		await handleWinnerAnnouncement(message, {
			server: server,
			playerName: playerName,
			gameName: gameName,
		});
		return;
	}


}