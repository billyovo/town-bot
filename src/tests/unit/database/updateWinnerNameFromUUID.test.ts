import { describe, test } from "@jest/globals";
import { client, winnerCollection } from "../../../managers/databaseManager";
import testPlayerData from "../../data/players.json";
import { updateWinnerNameFromUUID } from "../../../utils/database";
import "../../../managers/databaseManager";

describe("updateWinnerNameFromUUID", () => {
	const date = new Date().toISOString().substring(0, 10);
	beforeAll(async () => {
		await winnerCollection.insertOne({
			name: "WrongName",
			UUID: testPlayerData[0].UUID,
			server: "生存",
			event: "testEvent",
			date: date,
		});

		await winnerCollection.insertOne({
			name: testPlayerData[1].name,
			UUID: testPlayerData[1].UUID,
			server: "生存",
			event: "testEvent",
			date: date,
		});
	});

	afterAll(done => {
		client.close();
		done();
	});

	test("should update the winner name correctly and does not affect other data", async () => {
		await updateWinnerNameFromUUID(testPlayerData[0].UUID, testPlayerData[0].name);
		const player = await winnerCollection.findOne({ UUID: testPlayerData[0].UUID }, { projection: { _id: 0 } });
		expect(player).toStrictEqual({
			name: testPlayerData[0].name,
			UUID: testPlayerData[0].UUID,
			server: "生存",
			event: "testEvent",
			date: date,
		});

		const player2 = await winnerCollection.findOne({ UUID: testPlayerData[1].UUID }, { projection: { _id: 0 } });
		expect(player2).toStrictEqual({
			name: testPlayerData[1].name,
			UUID: testPlayerData[1].UUID,
			server: "生存",
			event: "testEvent",
			date: date,
		});
	});

	test("should not throw error if the winner does not exist", async () => {
		await expect(updateWinnerNameFromUUID("testUUID", "testName")).resolves.not.toThrow();
	});
});