import { ChatInputCommandInteraction } from "discord.js";
import { ServerNameChineseEnum } from "../../enums/servers";
import { winnerCollection } from "../../managers/databaseManager";
import { EmbedBuilder } from "discord.js";
import { embedColor } from "../../constants/embeds";

export async function execute(interaction: ChatInputCommandInteraction) {
	const server :string = interaction.options.getString("server", true);
	const name : string = interaction.options.getString("name", true);

	const filter = {
		name: name,
		server: {
			$regex: ServerNameChineseEnum[server as keyof typeof ServerNameChineseEnum] || ".*",
		},
	};
	const count = winnerCollection.countDocuments(filter);
	const target_info = await winnerCollection.findOne({ name: name });
	if (!count || !target_info) {
		interaction.reply({ content: "找不到玩家 `" + name + "` 的紀錄 :(", ephemeral: true });
		return;
	}
	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle(name)
		.setDescription(server === "ALL" ? "全部伺服器" : `${ServerNameChineseEnum[server as keyof typeof ServerNameChineseEnum]}服`)
		.setThumbnail(`https://crafatar.com/avatars/${target_info.UUID}?overlay`)
		.addFields({
			name: "勝利次數",
			value: count + "次",
		});
	interaction.reply({ embeds: [embed] });
}