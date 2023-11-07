import { Message, PermissionsBitField } from "discord.js";
import config from "@configs/config.json";
import { handleWinnerAnnouncement, setWinner } from "@utils/discord/textCommands/winner";
import { createWinnerRecord } from "@utils/database";
import { handleDrawAnnoucement } from "@utils/discord/textCommands/draw";
import { logger } from "../../logger/logger";

export async function handleTextCommand(message: Message) {
	if (!message.content.startsWith(config.prefix)) return;
	if (message.member && !message.member.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return;

	const [command, ...args] = message.content.slice(config.prefix.length).split(" ");

	if (command === "winner") {
		logger(`${message.author.username} used winner: ${args.join(" ")}`);
		const server = args[0];
		const playerName = args[1];
		const gameName = args[3] ? `${args[2]} ${args[3]}` : args[2];
		message.delete();
		await setWinner({
			server: server,
			playerName: playerName,
			gameName: gameName,
		});
		handleWinnerAnnouncement(message, {
			server: server,
			playerName: playerName,
			gameName: gameName,
		});
		return;
	}

	if (command === "draw") {
		logger(`${message.author.username} used draw: ${args.join(" ")}`);
		const server = args[0];
		const gameName = args[2] ? `${args[1]} ${args[2]}` : args[1];
		message.delete();
		await createWinnerRecord({
			UUID: "draw_result",
			playerName: "平手",
			server: server,
			gameName: gameName,
			date: new Date(),
		});
		handleDrawAnnoucement(message, {
			server: server,
			gameName: gameName,
		});
	}
}