import { Message, PermissionsBitField } from "discord.js";
import config from "@configs/config.json";
import { setWinner } from "@utils/discord/textCommands/winner";
import { createWinnerRecord } from "@utils/database";
import { logger } from "../../logger/logger";
import { ServerNameChineseEnum } from "@enums/servers";
import { eventSchedule } from "@managers/eventScheduleManager";
import { isValidMinecraftUsername } from "@utils/mojang";
import { getEventDrawMessage, getEventWinnerMessage } from "@assets/messages/messages";

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

		if (!Object.values(ServerNameChineseEnum).includes(server as ServerNameChineseEnum)) {
			logger(`Invalid server name: ${server}`);
			return;
		}
		if (!isValidMinecraftUsername(playerName)) {
			logger(`Invalid player name: ${playerName}`);
			return;
		}
		if (!eventSchedule.list.find(event => event.title === gameName)) {
			logger(`Invalid game name: ${gameName}`);
			return;
		}

		await setWinner({
			server: server,
			playerName: playerName,
			gameName: gameName,
		});

		message.channel.send(getEventWinnerMessage({
			server: server,
			game: gameName,
			name: playerName,
		}));


		return;
	}

	if (command === "draw") {
		logger(`${message.author.username} used draw: ${args.join(" ")}`);
		const server = args[0];
		const gameName = args[2] ? `${args[1]} ${args[2]}` : args[1];

		message.delete();

		if (!Object.values(ServerNameChineseEnum).includes(server as ServerNameChineseEnum)) {
			logger(`Invalid server name: ${server}`);
			return;
		}
		if (!eventSchedule.list.find(event => event.title === gameName)) {
			logger(`Invalid game name: ${gameName}`);
			return;
		}
		await createWinnerRecord({
			UUID: "draw_result",
			playerName: "平手",
			server: server,
			gameName: gameName,
			date: new Date(),
		});

		message.channel.send(getEventDrawMessage({
			server: server,
			game: gameName,
		}));
	}
}