import { describe, beforeAll } from "@jest/globals";
import { client, winnerCollection } from "../../../managers/databaseManager";
import testPlayerData from "../../data/players.json";
import { getEventBanlist } from "../../../utils/database";
import { ServerNameChineseEnum } from "../../../enums/servers";
import { WinnerRecord } from "../../../@types/database";
describe("getEventBanlist", () => {
	afterAll(done => {
		client.close();
		done();
	});

	beforeAll(async () => {
		await winnerCollection.deleteMany({});
		await winnerCollection.insertMany([
			{
				name: testPlayerData[0].name,
				UUID: testPlayerData[0].UUID,
				server: "生存",
				event: "testEvent",
				date: "2023-11-01",
			},
			{
				name: testPlayerData[1].name,
				UUID: testPlayerData[1].UUID,
				server: "生存",
				event: "testEvent",
				date: "2023-10-30",
			},
			{
				name: testPlayerData[2].name,
				UUID: testPlayerData[2].UUID,
				server: "生存",
				event: "testEvent2",
				date: "2023-11-01",
			},
			{
				name: testPlayerData[3].name,
				UUID: testPlayerData[3].UUID,
				server: "生存",
				event: "testEvent2",
				date: "2023-11-02",
			},
			{
				name: testPlayerData[4].name,
				UUID: testPlayerData[4].UUID,
				server: "生存",
				event: "testEvent3",
				date: "2023-11-03",
			},
		]);
	});

	// out of scope problems:
	// 1. empty database
	// 2. same date same event

	test("should return the latest winner of each event", async () => {
		const list : WinnerRecord[] = await getEventBanlist(ServerNameChineseEnum.SURVIVAL);
		const sortedList = list.sort((a, b) => (a.name > b.name) ? 1 : -1);

		expect(sortedList).toEqual([
			{
				name: testPlayerData[0].name,
				event: "testEvent",
			},
			{
				name: testPlayerData[3].name,
				event: "testEvent2",
			},
			{
				name: testPlayerData[4].name,
				event: "testEvent3",
			},
		].sort((a, b) => (a.name > b.name) ? 1 : -1));
	});
});