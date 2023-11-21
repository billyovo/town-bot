import { describe, jest } from "@jest/globals";
import { setWinner } from "../../../utils/discord/textCommands/winner";
import testPlayerData from "../../data/players.json";
import { client, winnerCollection } from "@managers/databaseManager";
import path from "path";


describe("setWinner", () => {
	afterEach(async () => {
		jest.clearAllMocks();
		await winnerCollection.deleteMany({});
	});

	afterAll(done => {
		client.close();
		done();
	});

	// when the player is not in the database
	test("should insert a new winner correctly", async () => {
		const dbImport = await import(path.resolve(__dirname, "../../../utils/database"));
		const mojangImport = await import(path.resolve(__dirname, "../../../utils/mojang"));

		const getWinnerFromDB = jest.spyOn(dbImport, "getWinnerFromDB").mockImplementation(() => Promise.resolve(null));
		const createWinnerRecord = jest.spyOn(dbImport, "createWinnerRecord").mockImplementation(() => Promise.resolve());
		const updateWinnerNameFromUUID = jest.spyOn(dbImport, "updateWinnerNameFromUUID");
		const getExistingNameFromUUID = jest.spyOn(dbImport, "getExistingNameFromUUID").mockImplementation(() => Promise.resolve(null));

		const getUUIDFromPlayerName = jest.spyOn(mojangImport, "getUUIDFromPlayerName").mockImplementation(() => Promise.resolve(testPlayerData[0].UUID));

		await setWinner({
			server: "生存",
			playerName: testPlayerData[0].name,
			gameName: "testEvent",
		});

		expect(getWinnerFromDB).toHaveBeenCalledWith(testPlayerData[0].name);
		expect(getExistingNameFromUUID).toHaveBeenCalledWith(testPlayerData[0].UUID);
		expect(getUUIDFromPlayerName).toHaveBeenCalledWith(testPlayerData[0].name);
		expect(createWinnerRecord).toHaveBeenCalledWith({
			UUID: testPlayerData[0].UUID,
			playerName: testPlayerData[0].name,
			server: "生存",
			gameName: "testEvent",
			date: expect.any(Date),
		});
		expect(updateWinnerNameFromUUID).not.toHaveBeenCalled();
	});

	// when the player is in the database, but the name is different
	test("should update the winner name correctly", async () => {
		const dbImport = await import(path.resolve(__dirname, "../../../utils/database"));
		const mojangImport = await import(path.resolve(__dirname, "../../../utils/mojang"));

		const getWinnerFromDB = jest.spyOn(dbImport, "getWinnerFromDB").mockImplementation(() => Promise.resolve(null));
		const createWinnerRecord = jest.spyOn(dbImport, "createWinnerRecord").mockImplementation(() => Promise.resolve());
		const updateWinnerNameFromUUID = jest.spyOn(dbImport, "updateWinnerNameFromUUID").mockImplementation(() => Promise.resolve());
		const getExistingNameFromUUID = jest.spyOn(dbImport, "getExistingNameFromUUID").mockImplementation(() => Promise.resolve(testPlayerData[0].name));
		const getUUIDFromPlayerName = jest.spyOn(mojangImport, "getUUIDFromPlayerName").mockImplementation(() => Promise.resolve(testPlayerData[0].UUID));

		await setWinner({
			server: "生存",
			playerName: testPlayerData[0].name,
			gameName: "testEvent",
		});
		expect(getWinnerFromDB).toHaveBeenCalledWith(testPlayerData[0].name);
		expect(getUUIDFromPlayerName).toHaveBeenCalledWith(testPlayerData[0].name);
		expect(getExistingNameFromUUID).toHaveBeenCalledWith(testPlayerData[0].UUID);
		expect(createWinnerRecord).toHaveBeenCalledWith({
			UUID: testPlayerData[0].UUID,
			playerName: testPlayerData[0].name,
			server: "生存",
			gameName: "testEvent",
			date: expect.any(Date),
		});
		expect(updateWinnerNameFromUUID).toHaveBeenCalledWith(testPlayerData[0].UUID, testPlayerData[0].name);
	});

	test("should use existing uuid from database if exist", async () => {
		const dbImport = await import(path.resolve(__dirname, "../../../utils/database"));
		const mojangImport = await import(path.resolve(__dirname, "../../../utils/mojang"));

		const getWinnerFromDB = jest.spyOn(dbImport, "getWinnerFromDB").mockImplementation(() => Promise.resolve({
			UUID: testPlayerData[0].UUID,
			name: testPlayerData[0].name,
		}));
		const createWinnerRecord = jest.spyOn(dbImport, "createWinnerRecord").mockImplementation(() => Promise.resolve());
		const updateWinnerNameFromUUID = jest.spyOn(dbImport, "updateWinnerNameFromUUID").mockImplementation(() => Promise.resolve());
		const getExistingNameFromUUID = jest.spyOn(dbImport, "getExistingNameFromUUID").mockImplementation(() => Promise.resolve(null));
		const getUUIDFromPlayerName = jest.spyOn(mojangImport, "getUUIDFromPlayerName").mockImplementation(() => Promise.resolve(testPlayerData[0].UUID));

		await setWinner({
			server: "生存",
			playerName: testPlayerData[0].name,
			gameName: "testEvent",
		});

		expect(getWinnerFromDB).toHaveBeenCalledWith(testPlayerData[0].name);
		expect(getExistingNameFromUUID).not.toHaveBeenCalled();
		expect(getUUIDFromPlayerName).not.toHaveBeenCalled();
		expect(createWinnerRecord).toHaveBeenCalledWith({
			UUID: testPlayerData[0].UUID,
			playerName: testPlayerData[0].name,
			server: "生存",
			gameName: "testEvent",
			date: expect.any(Date),
		});
		expect(updateWinnerNameFromUUID).not.toHaveBeenCalled();
	});
});