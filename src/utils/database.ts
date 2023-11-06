import { WinnerRecord } from "../@types/database";
import { CreateWinnerOptions } from "../@types/textCommands";
import { ServerNameChineseEnum } from "../enums/servers";
import { winnerCollection } from "../managers/databaseManager";

export async function getWinnerFromDB(playerName: string) : Promise<{ UUID: string, name: string } | null> {
	const winner = await winnerCollection.findOne({ name: playerName }, { projection: { UUID: 1, name: 1 } });
	return winner as Pick<WinnerRecord, "UUID" | "name"> | null;
}

export async function updateWinnerNameFromUUID(fromUUID: string, toName: string) : Promise<void> {
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

export async function getEventBanlist(server: ServerNameChineseEnum) : Promise<WinnerRecord[]> {
	const pipeline = [{ "$match": { "server": server } }, { "$sort": { "date": -1 } }, { "$group": { "_id": { "event": "$event" }, "name": { "$first": "$name" } } }, { "$project": { "event": "$_id.event", "name": "$name" } }, { "$unset": "_id" }];

	const result = await winnerCollection.aggregate(pipeline).toArray();

	return result as WinnerRecord[];
}