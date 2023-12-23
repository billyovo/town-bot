import { OpenAI } from "openai";
import { Message, Snowflake } from "discord.js";
import { client } from "@managers/discord/discordManager";
import { config } from "@configs/chatgpt";


const delMessageTime = config.delMessageTimeHours * 60 * 60 * 1000;

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const getGptMessage = async (chatMessages: OpenAI.Chat.ChatCompletionMessageParam[]): Promise<OpenAI.Chat.ChatCompletion| null> => {
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

const splitRespondMessage = (RespondMessage : string): string[] => {
	const splitMessage = RespondMessage.split("\n");
	const messageArray : string[] = [];
	let message = "";
	for (let i = 0; i < splitMessage.length; i++) {
		if (message.length + splitMessage[i].length > 2000) {
			messageArray.push(message);
			message = "";
		}
		message += splitMessage[i] + "\n";
	}
	messageArray.push(message);
	return messageArray;
};


const sendMessage = async (message : Message, content : string) => {
	const limit = 2000;
	console.log(content.length);
	if (content.length < limit) {
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
	}
	else {

		const messageArray = splitRespondMessage(content);
		console.log(messageArray);
		let messageId = message.id;
		for (let i = 0; i < messageArray.length; i++) {
			const sent = await message.channel.send({
				content: messageArray[i],
				reply: {
					messageReference: messageId,
				},
			});

			messageId = sent.id;

			setTimeout(() => {
				sent.delete();
			}, delMessageTime);
		}
	}
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