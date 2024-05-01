import { Schema, model } from "mongoose";

export interface Reminder {
    sendTime: Date;
    message: string;
    isDM: boolean;
    owner: string;
    channel: string | null;
}

const reminderSchema = new Schema<Reminder>({
	sendTime: Date,
	message: String,
	isDM: Boolean,
	owner: String,
	channel: String,
});

export const ReminderModel = model<Reminder>("reminders", reminderSchema);