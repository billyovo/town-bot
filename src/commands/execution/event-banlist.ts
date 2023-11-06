import { ChatInputCommandInteraction } from "discord.js";
import { ServerNameChineseEnum } from "../../enums/servers";
import { getEventBanlist } from "../../utils/database";
import { embedColor } from "../../constants/embeds";
import { EmbedBuilder } from "discord.js";
import { WinnerRecord } from "../../@types/database";
import { eventSchedule } from "../../managers/eventScheduleManager";
export async function execute(interaction: ChatInputCommandInteraction) {
	const server = interaction.options.getString("server");
	const serverChineseName = ServerNameChineseEnum[server as keyof typeof ServerNameChineseEnum];

	const banlist = await getEventBanlist(serverChineseName);

	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle(`${serverChineseName}服 禁賽名單`);
	banlist.forEach((record : WinnerRecord) => {
		embed.addFields({ name:`${eventSchedule.list.get(record.event)?.emote} ${record.event}`, value: record.name, inline: true });
	});
	interaction.reply({
		embeds: [embed],
	});
}