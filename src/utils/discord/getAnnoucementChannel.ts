import { Client, TextChannel } from "discord.js";

export async function getAnnoucementChannel(client: Client, annoucementChannelID: string) : Promise<TextChannel> {
	const annoucementChannel : TextChannel = await client.channels.fetch(
		annoucementChannelID,
		{
			force: true,
			cache: true,
		}) as TextChannel;

	return annoucementChannel;
}