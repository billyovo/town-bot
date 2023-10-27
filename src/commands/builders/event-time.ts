import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import events from "../../configs/events.json";
import { EventData } from "../../@types/eventSchedule";


const eventChoices = events.map((event : EventData) => {
	return {
		name: event.title,
		value: event.id,
	};
});
export const command = new SlashCommandBuilder()
	.setName("event-time")
	.setNameLocalizations({ "zh-TW": "活動時間" })
	.setDescription("Get time of a specific event")
	.setDescriptionLocalizations({ "zh-TW": "取得指定活動的下一次舉行時間" })
	.addStringOption((option: SlashCommandStringOption) =>
		option.setName("event")
			.setDescription("Event name to check")
			.setDescriptionLocalizations({ "zh-TW": "要查詢的活動名稱" })
			.setRequired(true)
			.addChoices(...eventChoices),
	);

