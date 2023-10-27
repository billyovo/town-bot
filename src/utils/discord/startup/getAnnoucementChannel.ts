import { TextChannel } from "discord.js";
import { DiscordClient } from "../../../@types/discord";

export async function getAnnoucementChannel(client: DiscordClient, annoucementChannelID: string) : Promise<TextChannel> {
	const annoucementChannel : TextChannel = await client.channels.fetch(
		annoucementChannelID,
		{
			force: true,
			cache: true,
		}) as TextChannel;

	return annoucementChannel;
}