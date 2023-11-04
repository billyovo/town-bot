import axios from "axios";
import { SetWinnerOptions } from "../../../@types/textCommands";
import { createWinnerRecord, getWinnerFromDB, updateWinnerNameFromUUID } from "./database";
import { Message } from "discord.js";
import { getEventDrawMessage, getEventWinnerMessage } from "../../../assets/messages/messages";

export async function getUUIDFromPlayerName(name : string) : Promise<string | null> {
	return axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
		.then((res) => res.data.id)
		.catch(() => null);
}

export async function setWinner(options: SetWinnerOptions) {
	let winner = await getWinnerFromDB(options.playerName);
	if (!winner) {
		try {
			const UUID = await getUUIDFromPlayerName(options.playerName);
			winner = { UUID: UUID as string, name: options.playerName };
		}
		catch (e) {
			console.log("Cannot get UUID from mojang!");
			return;
		}
	}

	if (winner.name !== options.playerName) {
		await updateWinnerNameFromUUID(winner.UUID, options.playerName);
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

export function handleDrawAnnoucement(message : Message, options: { server: string, gameName: string }) {
	message.channel.send(getEventDrawMessage({
		server: options.server,
		game: options.gameName,
	}));
}