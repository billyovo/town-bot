import { ChatInputCommandInteraction } from "discord.js";
import { scheduledJobs } from "node-schedule";
import { ReminderModel } from "~/src/lib/database/schemas/reminders";

export async function execute(interaction: ChatInputCommandInteraction) {
	const jobID = interaction.options.getString("content");
	if (!jobID) {
		await interaction.reply({ content: "No Input received", ephemeral: true });
		return;
	}

	const foundJob = scheduledJobs[jobID];

	if (!foundJob) {
		await interaction.reply("No reminder found!");
		return;
	}

	foundJob.cancel();
	await interaction.reply("Reminder Cancelled!");
	await ReminderModel.deleteOne({ _id: jobID });
}