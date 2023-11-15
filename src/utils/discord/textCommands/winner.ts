import { SetWinnerOptions } from "../../../@types/textCommands";
import { createWinnerRecord, getExistingNameFromUUID, getWinnerFromDB, updateWinnerNameFromUUID } from "@utils/database";
import { Message } from "discord.js";
import { getEventWinnerMessage } from "@assets/messages/messages";
import { getUUIDFromPlayerName } from "@utils/mojang";
import { logger } from "../../../logger/logger";

export async function setWinner(options: SetWinnerOptions) {
	let winner = await getWinnerFromDB(options.playerName);
	if (!winner) {
		try {
			const UUID = await getUUIDFromPlayerName(options.playerName);
			const existingRecord = await getExistingNameFromUUID(UUID as string);
			if (existingRecord) {
				await updateWinnerNameFromUUID(UUID as string, options.playerName);
			}
			winner = { UUID: UUID as string, name: options.playerName };
		}
		catch (e) {
			logger("Cannot get UUID from mojang!");
			return;
		}
	}

	await createWinnerRecord({
		UUID: winner.UUID,
		playerName: options.playerName,
		server: options.server,
		gameName: options.gameName,
		date: new Date(),
	});
}

export function handleWinnerAnnouncement(message : Message, options: { server: string, gameName: string, playerName: string }) {
	message.channel.send(getEventWinnerMessage({
		server: options.server,
		game: options.gameName,
		name: options.playerName,
	}));
}
