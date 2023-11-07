import { Message } from "discord.js";
import { getEventDrawMessage } from "@assets/messages/messages";

export function handleDrawAnnoucement(message : Message, options: { server: string, gameName: string }) {
	message.channel.send(getEventDrawMessage({
		server: options.server,
		game: options.gameName,
	}));
}