import { describe, jest } from "@jest/globals";
import { setWinner } from "../../../utils/discord/textCommands/winner";
import testPlayerData from "../../data/players.json";

describe("setWinner", () => {
	afterEach(async () => {
		jest.clearAllMocks();
	});

	// when the player is not in the database
	test("should insert a new winner correctly", async () => {
		const getWinnerFromDB = jest.spyOn(await import("../../../utils/database"), "getWinnerFromDB");
		const createWinnerRecord = jest.spyOn(await import("../../../utils/database"), "createWinnerRecord");
		const updateWinnerNameFromUUID = jest.spyOn(await import("../../../utils/database"), "updateWinnerNameFromUUID");
		const getExistingNameFromUUID = jest.spyOn(await import("../../../utils/database"), "getExistingNameFromUUID");

		const getUUIDFromPlayerName = jest.spyOn(await import("../../../utils/mojang"), "getUUIDFromPlayerName").mockImplementation(() => Promise.resolve(testPlayerData[0].UUID));

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
		const getWinnerFromDB = jest.spyOn(await import("../../../utils/database"), "getWinnerFromDB").mockImplementation(() => Promise.resolve(null));
		const createWinnerRecord = jest.spyOn(await import("../../../utils/database"), "createWinnerRecord");
		const updateWinnerNameFromUUID = jest.spyOn(await import("../../../utils/database"), "updateWinnerNameFromUUID");
		const getExistingNameFromUUID = jest.spyOn(await import("../../../utils/database"), "getExistingNameFromUUID").mockImplementation(() => Promise.resolve(testPlayerData[0].name));
		const getUUIDFromPlayerName = jest.spyOn(await import("../../../utils/mojang"), "getUUIDFromPlayerName").mockImplementation(() => Promise.resolve(testPlayerData[0].UUID));

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
		const getWinnerFromDB = jest.spyOn(await import("../../../utils/database"), "getWinnerFromDB").mockImplementation(() => Promise.resolve({
			UUID: testPlayerData[0].UUID,
			name: testPlayerData[0].name,
		}));
		const createWinnerRecord = jest.spyOn(await import("../../../utils/database"), "createWinnerRecord");
		const updateWinnerNameFromUUID = jest.spyOn(await import("../../../utils/database"), "updateWinnerNameFromUUID").mockImplementation(() => Promise.resolve());
		const getExistingNameFromUUID = jest.spyOn(await import("../../../utils/database"), "getExistingNameFromUUID");
		const getUUIDFromPlayerName = jest.spyOn(await import("../../../utils/mojang"), "getUUIDFromPlayerName");

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