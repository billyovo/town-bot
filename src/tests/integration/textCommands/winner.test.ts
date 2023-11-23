import { describe, test, expect, jest } from "@jest/globals";

import { handleTextCommand } from "@commands/handler/textCommandHandler";
import { ServerNameChineseEnum } from "@enums/servers";
import events from "@configs/events.json";
import { getEventWinnerMessage } from "@assets/messages/messages";

describe("textCommandHandler", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	test("should return correct response", async () => {
		const setWinnerSpy = jest.spyOn(await import("@utils/discord/textCommands/winner"), "setWinner").mockImplementation(() => Promise.resolve());
		const message = {
			content: `!winner ${ServerNameChineseEnum.SKYBLOCK} billyovo ${events[0].title}`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			author: {
				username: "test",
			},
			channel:{
				send: jest.fn(),
			},
			delete: jest.fn(),
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(setWinnerSpy).toBeCalledWith({
			server: ServerNameChineseEnum.SKYBLOCK,
			playerName: "billyovo",
			gameName: events[0].title,
		});
		expect(message.delete).toBeCalled();
		expect(message.channel.send).toBeCalledWith(getEventWinnerMessage({
			server: ServerNameChineseEnum.SKYBLOCK,
			game: events[0].title,
			name: "billyovo",
		}));
	});

	test("Should ignore invalid command without starting symbol", async () => {
		const message = {
			content: `winner SKYBLOCK billyovo ${events[0].title}`,
			delete: jest.fn(),
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).not.toBeCalled();
	});

	test("Should ignore message without permission", async () => {
		const message = {
			content: `!winner ${ServerNameChineseEnum.SURVIVAL} billyovo ${events[0].title}`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(false),
				},
			},
			delete: jest.fn(),
			channel: {
				send: jest.fn(),
			},
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).not.toBeCalled();
		expect(message.channel.send).not.toBeCalled();
	});

	test("Should reject invalid player name", async () => {

		const setWinnerSpy = jest.spyOn(await import("@utils/discord/textCommands/winner"), "setWinner").mockImplementation(() => Promise.resolve());
		const message = {
			content: `!winner ${ServerNameChineseEnum.SKYBLOCK} BADNAME@v@ ${events[0].title}`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			delete: jest.fn(),
			channel: {
				send: jest.fn(),
			},
			author:{
				username: "test",
			},
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(setWinnerSpy).not.toBeCalled();
		expect(message.delete).toBeCalled();
		expect(message.channel.send).not.toBeCalled();
	});

	test("Should reject invalid server name", async () => {
		const setWinnerSpy = jest.spyOn(await import("@utils/discord/textCommands/winner"), "setWinner").mockImplementation(() => Promise.resolve());
		const message = {
			content: `!winner SKYBLOCK billyovo ${events[0].title}`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			author: {
				username: "test",
			},
			delete: jest.fn(),
			channel: {
				send: jest.fn(),
			},
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).toBeCalled();
		expect(setWinnerSpy).not.toBeCalled();
		expect(message.channel.send).not.toBeCalled();
	});

	test("Should reject invalid event name", async () => {
		const setWinnerSpy = jest.spyOn(await import("@utils/discord/textCommands/winner"), "setWinner").mockImplementation(() => Promise.resolve());
		const message = {
			content: `!winner ${ServerNameChineseEnum.SKYBLOCK} billyovo SomeRandomGameName`,
			member: {
				permissions: {
					has: jest.fn().mockReturnValue(true),
				},
			},
			author: {
				username: "test",
			},
			delete: jest.fn(),
			channel: {
				send: jest.fn(),
			},
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await handleTextCommand(message as any);

		expect(message.delete).toBeCalled();
		expect(setWinnerSpy).not.toBeCalled();
		expect(message.channel.send).not.toBeCalled();
	});
});