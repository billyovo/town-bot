import { OpenAI } from "openai";
import { Message, Snowflake, TextChannel } from "discord.js";
import { client } from "~/managers/discord/discordManager";
import { delMessageTime, config } from "~/configs/chatgpt";
import { splitMessage } from "~/utils/discord/splitMessage";
import type { GetChatMessageHistory, GetGptMessage } from "~/types/chatgpt";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const getGptMessage : GetGptMessage = async (chatMessages) => {
	try {
		const parms : OpenAI.Chat.ChatCompletionCreateParams = {
			messages: chatMessages,
			model: config.model,
		};
		const response : OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(parms);
		return response;
	}
	catch (error) {
		console.log(error);
		return null;
	}
};

const sendMessage = async (content : string, channel: TextChannel, replyID?: Snowflake) => {
	const messageArray = splitMessage(content.split("\n"));
	let updatedReplyID = replyID;
	for (let i = 0; i < messageArray.length; i++) {
		const sendOptions = updatedReplyID ? { reply: { messageReference: updatedReplyID } } : {};
		const sent = await channel.send({
			content: messageArray[i],
			...sendOptions,
		});
		updatedReplyID = sent.id;
		setTimeout(() => {
			sent.delete();
		}, delMessageTime);
	}
};

const getChatMessageHistory : GetChatMessageHistory = async (message, botID, chatMessages = []) => {
	try {
		const filter = new RegExp(`^<@${botID}>`, "g");
		const filteredMessage = message.content.replace(filter, "");

		if (chatMessages.length === 0 && filteredMessage == "") return null;

		chatMessages.unshift({
			"role": message.author.id === botID ? "assistant" : "user",
			"content": filteredMessage,
		});
		if (message.reference) {
			const refeMessageId = message.reference.messageId;
			const refMessage = await message.channel.messages.fetch(refeMessageId!);
			return await getChatMessageHistory(refMessage, botID, chatMessages);
		}

		return chatMessages;
	}
	catch (error) {
		console.log(error);
		return null;
	}
};


export async function chatgpt(message : Message) {
	try {
		const botID = client.user?.id;
		if (message.author.bot) return;
		if (!message.mentions.has(botID!) || message.mentions.everyone) return;

		const messagesHistory = await getChatMessageHistory(message, botID!);
		if (!messagesHistory) return sendMessage("Hello! How can I assist you today?", message.channel as TextChannel, message.id);

		const response = await getGptMessage(messagesHistory!);
		if (!response) throw new Error("Some Error Occured, Please try again later :(");

		sendMessage(
			response.choices[0].message.content!,
			message.channel as TextChannel,
			message.id,
		);
	}
	catch (error) {
		console.log(error);
		sendMessage("Some Error Occured, Please try again later :(", message.channel as TextChannel, message.id);
	}
}