import { CreateWinnerOptions } from "../../../@types/textCommands";
import { winnerCollection } from "../../../managers/databaseManager";

export async function getWinnerFromDB(playerName: string) : Promise<{ UUID: string, name: string } | null> {
	const winner = await winnerCollection.findOne({ name: playerName }, { projection: { UUID: 1, name: 1 } });
	return winner as { UUID: string, name: string } | null;
}

export async function updateWinnerNameFromUUID(fromUUID: string, toName: string) {
	await winnerCollection.updateOne({ UUID: fromUUID }, { $set: { name: toName } });
}

export async function createWinnerRecord(options: CreateWinnerOptions) : Promise<void> {
	await winnerCollection.insertOne({
		name: options.playerName,
		UUID: options.UUID,
		server: options.server,
		event: options.gameName,
		date: options.date.toISOString().substring(0, 10),
	});
}