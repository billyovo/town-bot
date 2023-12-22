import { OpenAI } from "openai";
import { Message, Snowflake } from "discord.js";
import { client } from "@managers/discord/discordManager";

const delMessageTime = 60 * 60 * 1000;

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const getGptMessage = async (chatMessages: OpenAI.Chat.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.ChatCompletion| null> => {
	try {

		const parms : OpenAI.Chat.ChatCompletionCreateParams = {
			messages: chatMessages,
			model: "gpt-3.5-turbo",
		};

		const response : OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(parms);
		return response;
	}
	catch (error) {
		console.log(error);
		return null;
	}
};


const sendMessage = (message : Message, content : string) => {
	message.channel.send({
		content: content,
		reply: {
			messageReference: message,
		},
	}).then((msg) => {
		setTimeout(() => {
			msg.delete();
		}, delMessageTime);
	});
};

const getChatMessages = async (message : Message, botID : Snowflake, chatMessages : OpenAI.Chat.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.ChatCompletionMessageParam[] | null> => {
	try {
		const filter = new RegExp(`^<@${botID}>+([^]*)`);
		const originalMessage = message.content.match(filter);
		const filteredMessage = originalMessage ? originalMessage[1] : message.content;

		if (chatMessages.length === 0 && filteredMessage == "") {
			return null;
		}

		if (message.author.id === botID) {
			chatMessages.unshift({ "role": "assistant", "content": filteredMessage });
		}
		else {
			chatMessages.unshift({ "role": "user", "content": filteredMessage });
		}

		if (message.reference) {
			const refeMessageId = message.reference.messageId;
			const refMessage = await message.channel.messages.fetch(refeMessageId!);
			return await getChatMessages(refMessage, botID, chatMessages);
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
		if (message.mentions.has(botID!) && !message.mentions.everyone) {
			const chatMessages : OpenAI.Chat.ChatCompletionMessageParam[] = [];

			const messages = await getChatMessages(message, botID!, chatMessages);

			if (!messages) {
				sendMessage(message, "Hello! How can I assist you today?");
			}
			else {
				const response = await getGptMessage(messages!);
				if (!response) {
					sendMessage(message, "Some Error Occured, Please try again later :(");
				}
				else {
					sendMessage(message, response.choices[0].message.content!);
				}
			}
		}
	}
	catch (error) {
		console.log(error);
		sendMessage(message, "Some Error Occured, Please try again later :(");
	}
}