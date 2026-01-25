import { ChatInputCommandInteraction, LabelBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, SeparatorBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { DateTime } from "luxon";

export async function execute(interaction: ChatInputCommandInteraction) {
	const fromTimezone: string | null = interaction.options.getString("from_timezone") ?? null;
	const toTimezone: string | null = interaction.options.getString("to_timezone") ?? null;

	if (!fromTimezone) return interaction.reply({ content: "Please provide a from timezone", flags: MessageFlags.Ephemeral });
	if (!toTimezone) return interaction.reply({ content: "Please provide a to timezone", flags: MessageFlags.Ephemeral });

	const fromTimeZoneObj = DateTime.now().setZone(fromTimezone);
	const toTimeZoneObj = DateTime.now().setZone(toTimezone);

	if (!fromTimeZoneObj) return interaction.reply({ content: "Invalid from timezone received", flags: MessageFlags.Ephemeral });
	if (!toTimeZoneObj) return interaction.reply({ content: "Invalid to timezone received", flags: MessageFlags.Ephemeral });

	const modal = buildModal(`${fromTimezone} (${fromTimeZoneObj.toFormat("ZZ")})`, `${toTimezone} (${toTimeZoneObj.toFormat("ZZ")})`, interaction.id);
	await interaction.showModal(modal);
	const filter = (i: ModalSubmitInteraction) => (i.user.id === interaction.user.id) && (i.customId === `time_convert_modal|${interaction.id}`);
	const collected = await interaction.awaitModalSubmit({ filter, time: 5 * 60 * 1000 }).catch(() => null);

	if (!collected) {
		return;
	}

	const hoursInput = collected.fields.getTextInputValue(`hours_input|${interaction.id}`);
	const minutesInput = collected.fields.getTextInputValue(`minutes_input|${interaction.id}`);
	const daysInput = collected.fields.getTextInputValue(`day_input|${interaction.id}`);
	const monthsInput = collected.fields.getTextInputValue(`month_input|${interaction.id}`);
	const hours = parseInt(hoursInput) || 0;
	const minutes = parseInt(minutesInput) || 0;
	const days = parseInt(daysInput) || 0;
	const months = parseInt(monthsInput) || 0;
	const fromDateTime = DateTime.now().setZone(fromTimezone).set({ hour: hours, minute: minutes, day: days, month: months });
	const toDateTime = fromDateTime.setZone(toTimezone);

	const displays: (TextDisplayBuilder | SeparatorBuilder)[] = [
		new TextDisplayBuilder().setContent(`**${fromTimezone} (${fromDateTime.toFormat("ZZ")})**\n${fromDateTime.toFormat("yyyy-MM-dd HH:mm")}`),
		new SeparatorBuilder(),
		new TextDisplayBuilder().setContent(`**${toTimezone} (${toDateTime.toFormat("ZZ")})**\n${toDateTime.toFormat("yyyy-MM-dd HH:mm")}`),
	];

	await collected.reply({
		components: [...displays],
		flags: MessageFlags.IsComponentsV2,
	});
}

function buildModal(fromTimezone: string, toTimezone: string, id : string) : ModalBuilder {
	const hourInput = new TextInputBuilder()
		.setCustomId(`hours_input|${id}`)
		.setPlaceholder("14")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(2)
		.setValue(DateTime.now().toFormat("H"));
	const hourLabel = new LabelBuilder()
		.setLabel("Hour (H)")
		.setTextInputComponent(hourInput);
	const minuteInput = new TextInputBuilder()
		.setCustomId(`minutes_input|${id}`)
		.setPlaceholder("30")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(2)
		.setValue(DateTime.now().toFormat("m"));
	const minuteLabel = new LabelBuilder()
		.setLabel("Minute (m)")
		.setTextInputComponent(minuteInput);
	const dayInput = new TextInputBuilder()
		.setCustomId(`day_input|${id}`)
		.setPlaceholder("25")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(2)
		.setValue(DateTime.now().toFormat("d"));
	const dayLabel = new LabelBuilder()
		.setLabel("Day (d)")
		.setTextInputComponent(dayInput);
	const monthInput = new TextInputBuilder()
		.setCustomId(`month_input|${id}`)
		.setPlaceholder("12")
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(2)
		.setValue(DateTime.now().toFormat("M"));

	const monthLabel = new LabelBuilder()
		.setLabel("Month (M)")
		.setTextInputComponent(monthInput);
	const description = new TextDisplayBuilder()
		.setContent(`Convert time from **${fromTimezone}** to **${toTimezone}**`);
	const modal = new ModalBuilder()
		.setCustomId(`time_convert_modal|${id}`)
		.setTitle("Time Conversion")
		.addTextDisplayComponents(description)
		.addLabelComponents(hourLabel, minuteLabel)
		.addLabelComponents(monthLabel, dayLabel);

	return modal;
}