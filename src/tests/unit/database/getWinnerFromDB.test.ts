import { describe, test } from "@jest/globals";
import { getWinnerFromDB } from "../../../utils/database";
import { winnerCollection } from "../../../managers/databaseManager";
import testPlayerData from "../../data/players.json";


describe("getWinnerFromDB", () => {
	const date = new Date().toISOString().substring(0, 10);
	beforeAll(async () => {
		await winnerCollection.insertOne(
			{
				name: testPlayerData[0].name,
				UUID: testPlayerData[0].UUID,
				server: "生存",
				event: "testEvent",
				date: date,
			},
		);

		await winnerCollection.insertOne(
			{
				name: testPlayerData[1].name,
				UUID: testPlayerData[1].UUID,
				server: "生存",
				event: "testEvent",
				date: date,
			},
		);
	});

	test("should return a winner correctly", async () => {
		const winner = await getWinnerFromDB(testPlayerData[0].name);
		expect(winner).toStrictEqual({
			name: testPlayerData[0].name,
			UUID: testPlayerData[0].UUID,
		});
	});

	test("should return null if the winner does not exist", async () => {
		const winner = await getWinnerFromDB("testPlayer");
		expect(winner).toBeNull();
	});

});