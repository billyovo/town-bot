import { ChatInputCommandInteraction } from "discord.js";
import { parse } from "tldts";
export async function execute(interaction: ChatInputCommandInteraction) {
	const link = interaction.options.getString("link")!;

	const { domain } = parse(link);
	if (!(domain === "x.com" || domain === "twitter.com" || domain === "t.co")) {
		return await interaction.reply({ content: "This is not a twitter link!", ephemeral: true });
	}

	const fixedLink = link.replace(domain, "vxtwitter.com");
	const tweetUser = link.split("/")[3];

	await interaction.reply({ content: `[Twitter | ${tweetUser}](${fixedLink})` });

}