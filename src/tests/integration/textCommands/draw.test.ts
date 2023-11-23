import { describe, test, expect, jest } from "@jest/globals";
import events from "@configs/events.json";
import config from "@configs/config.json";
import { handleTextCommand } from "@commands/handler/textCommandHandler";
import { getEventDrawMessage } from "@assets/messages/messages";
import { ServerNameChineseEnum } from "@enums/servers";


describe("Draw Text Command", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should return correct response", async () => {
		const createWinnerRecordSpy = jest.spyOn(await import("@utils/database"), "createWinnerRecord").mockImplementation(() => Promise.resolve());

		const message = {
			content: `${config.prefix}draw ${ServerNameChineseEnum.SKYBLOCK} ${events[0].title}`,
			author:{
				username: "test",
			},
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			channel:{
				send: jest.fn(),
			},
			delete: jest.fn(),
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).toBeCalled();
		expect(message.channel.send).toBeCalledWith(getEventDrawMessage({
			game: events[0].title,
			server: ServerNameChineseEnum.SKYBLOCK,
		}));
		expect(createWinnerRecordSpy).toBeCalledWith({
			server: ServerNameChineseEnum.SKYBLOCK,
			gameName: events[0].title,
			playerName: "平手",
			UUID: "draw_result",
			date: expect.any(Date),
		});
	});

	test("Should ignore invalid command without starting symbol", async () => {
		const message = {
			content: `draw SKYBLOCK ${events[0].title}`,
			author:{
				username: "test",
			},
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			channel:{
				send: jest.fn(),
			},
			delete: jest.fn(),
		};
		const createWinnerRecordSpy = jest.spyOn(await import("@utils/database"), "createWinnerRecord").mockImplementation(() => Promise.resolve());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).not.toBeCalled();
		expect(createWinnerRecordSpy).not.toBeCalled();
		expect(message.channel.send).not.toBeCalled();
	});

	test("Should ignore message without permission", async () => {
		const message = {
			content: `${config.prefix}draw SKYBLOCK ${events[0].title}`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(false),
				},
			},
			author:{
				username: "test",
			},
			delete: jest.fn(),
			channel:{
				send: jest.fn(),
			},
		};

		const createWinnerRecordSpy = jest.spyOn(await import("@utils/database"), "createWinnerRecord").mockImplementation(() => Promise.resolve());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).not.toBeCalled();
		expect(message.channel.send).not.toBeCalled();
		expect(createWinnerRecordSpy).not.toBeCalled();

	});

	test("Should ignore message with invalid server name", async () => {
		const message = {
			content: `${config.prefix}draw INVALID_SERVER_NAME ${events[0].title}`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			author:{
				username: "test",
			},
			channel:{
				send: jest.fn(),
			},
			delete: jest.fn(),
		};

		const createWinnerRecordSpy = jest.spyOn(await import("@utils/database"), "createWinnerRecord").mockImplementation(() => Promise.resolve());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).toBeCalled();
		expect(createWinnerRecordSpy).not.toBeCalled();
	});

	test("Should ignore message with invalid event name", async () => {
		const message = {
			content: `${config.prefix}draw SKYBLOCK INVALID_GAME_NAME`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			author:{
				username: "test",
			},
			channel:{
				send: jest.fn(),
			},
			delete: jest.fn(),
		};

		const createWinnerRecordSpy = jest.spyOn(await import("@utils/database"), "createWinnerRecord").mockImplementation(() => Promise.resolve());
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).toBeCalled();
		expect(createWinnerRecordSpy).not.toBeCalled();
	});

});