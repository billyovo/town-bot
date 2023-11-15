import { describe, expect } from "@jest/globals";
import { handleTextCommand } from "../../../commands/handler/textCommandHandler";
import { Message } from "discord.js";
import { setWinner } from "@utils/discord/textCommands/winner";
describe("winner", () => {

	test("should set a winner correctly", async () => {

		handleTextCommand({
			content: "!winner 生存 testPlayer testEvent",
			member: {
				permissions: {
					has: () => true,
				},
			},
		} as unknown as Message);

		expect(setWinner).toHaveBeenCalled();
	});
});