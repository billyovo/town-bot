import { describe, test, expect } from "@jest/globals";
import { createWinnerRecord } from "../../../utils/database";
import testPlayerData from "../../data/players.json";
import { winnerCollection } from "../../../managers/databaseManager";
describe("createWinnerRecord", () => {
	const date = new Date().toISOString().substring(0, 10);

	test("should create a winner record correctly", async () => {
		await createWinnerRecord({
			playerName: testPlayerData[1].name,
			UUID: testPlayerData[1].UUID,
			server: "生存",
			gameName: "testEvent",
			date: new Date(),
		});

		const player = await winnerCollection.findOne({ UUID: testPlayerData[1].UUID }, { projection: { _id: 0 } });

		expect(player).toStrictEqual({
			name: testPlayerData[1].name,
			UUID: testPlayerData[1].UUID,
			server: "生存",
			event: "testEvent",
			// date is string in db!
			date: date,
		});
	});
});