import { Schema, model } from "mongoose";

type DirectMessageReminder = {
    sendTime: Date;
    message: string;
    isDM: true;
    owner: string;
    channel: null;
};

type ChannelMessageReminder = {
    sendTime: Date;
    message: string;
    isDM: false | null;
    owner: string;
    channel: string;
};

export type Reminder = DirectMessageReminder | ChannelMessageReminder;

const reminderSchema = new Schema<Reminder>({
	sendTime: Date,
	message: String,
	isDM: Boolean,
	owner: String,
	channel: String,
});

export const ReminderModel = model<Reminder>("reminders", reminderSchema);