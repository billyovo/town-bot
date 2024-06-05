import { Message, MessageFlags, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { client } from "~/src/managers/discordManager";


const pattern = /(https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/\d+)/;
const fixEmoji = "🔨";
const reverseEmoji = "🔄";
const fixedTwitterUrl = "vxtwitter.com";

function fixTwitterMessage(message: string): string {
	return message.replace("twitter.com", fixedTwitterUrl).replace("x.com", fixedTwitterUrl);
}
function reverseTwitterMessage(message: string): string {
	return message.replace(fixedTwitterUrl, "x.com");
}

function isTwitterUrl(message: string): boolean {
	return pattern.test(message);
}

async function sendMessage(content: string, message: Message) {
	content = `Messaged by <@${message.author.id}> \n${content}`;
	const sent = await message.channel.send({ content: content, flags: MessageFlags.SuppressNotifications });
	sent.react(reverseEmoji);
	return sent;
}

async function editMessage(message: Message, newContent: string) {
	return message.edit(newContent);
}

function isFixedTwitterUrl(message: string): boolean {
	return message.includes(fixedTwitterUrl);
}

// when the message is created it will check if the messsage include the twitter url(x.com or twitter.com) and send an emoji
export async function twitterMessageCreateHandler(message: Message) {
	if (!isTwitterUrl(message.content)) return;
	message.react(fixEmoji);
}

// when a user reacted to the message, if the message is by a user it will send the new fixed message directly,
// if the message is by the bot it will check if the message is fixed or not and then send the unfixed message or fixed message
export async function twitterMessageReactHandler(messageReaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
	const botID = client.user?.id;
	if (user.id === botID) return;
	if (!isTwitterUrl(messageReaction.message.content || "") && !isFixedTwitterUrl(messageReaction.message.content || "")) return;

	if (messageReaction.message.author?.id !== botID) {
		await sendMessage(fixTwitterMessage(messageReaction.message.content || ""), messageReaction.message as Message);
		await messageReaction.message.delete();
		return;
	}

	const isFixed = isFixedTwitterUrl(messageReaction.message.content || "");
	if (isFixed) {
		const sent = await editMessage(messageReaction.message as Message, reverseTwitterMessage(messageReaction.message.content || ""));
		await sent.reactions.removeAll();
		await sent.react(fixEmoji);
	}
	else {
		const sent = await editMessage(messageReaction.message as Message, fixTwitterMessage(messageReaction.message.content || ""));
		await sent.reactions.removeAll();
		await sent.react(reverseEmoji);
	}
}
