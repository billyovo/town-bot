import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";
import { logger } from "~/src/lib/logger/logger";

type FilterResultItem = {
	severity: string;
	filtered: boolean;
}
type FilterResult = {
	sexual: FilterResultItem;
	violence: FilterResultItem;
	hate: FilterResultItem;
	self_harm: FilterResultItem;
	profanity: FilterResultItem;
	jailbreak: FilterResultItem;
}

function getContentFilterReason(filterResult: FilterResult) : Array<string> {
	if (!filterResult) {
		return [];
	}
	const reasons = [];
	if (filterResult?.sexual?.filtered) {
		reasons.push("sexual content");
	}
	if (filterResult?.violence?.filtered) {
		reasons.push("violence");
	}
	if (filterResult?.hate?.filtered) {
		reasons.push("hate speech");
	}
	if (filterResult?.self_harm?.filtered) {
		reasons.push("self harm");
	}
	if (filterResult?.profanity?.filtered) {
		reasons.push("profanity");
	}
	if (filterResult?.jailbreak?.filtered) {
		reasons.push("jailbreak");
	}

	return reasons;
}

export async function execute(interaction: ChatInputCommandInteraction) {
	if (!process.env.DRAW_LINK || !process.env.DRAW_KEY) {
		await interaction.reply("The draw API token is not provided.");
		return;
	}

	const prompt : string = interaction.options!.getString("prompt")?.trim() ?? "";
	const size : string = interaction.options.getString("size") ?? "1024x1024";
	const style : string = interaction.options.getString("style") ?? "vivid";
	const quality : string = interaction.options.getString("quality") ?? "hd";

	const headers = {
		"Cache-Control": "no-cache, must-revalidate",
		"Content-Type": "application/json",
		"api-key": process.env.DRAW_KEY,
	};
	const body = {
		prompt: prompt,
		size: size,
		n: 1,
		quality: quality,
		style: style,
	};

	await interaction.deferReply();

	const imageRequest = await axios.post(process.env.DRAW_LINK, body, {
		headers: headers,
		params: {
			"api-version": process.env.DRAW_API_VERSION,
		},
		timeout: 120000,
	})
		.catch(async (error) => {
			const errorMsg = error.response?.data?.error?.message ?? error.response?.statusText ?? error.message ?? "An error occurred while processing the image.";
			const contentFilterReason = getContentFilterReason(error.response?.data?.error?.inner_error?.content_filter_results);
			const promptFilterReason = getContentFilterReason(error.response?.data?.error?.inner_error?.prompt_filter_results);

			const errorReason = [...contentFilterReason, ...promptFilterReason].join(", ");
			await interaction.editReply(errorMsg + (errorReason ? `\r\n\r\nReason: ${errorReason}` : ""));
		});

	if (!imageRequest) {
		logger.error("Draw: An error occurred while fetching the image.");
		return;
	}


	const imageLink : string | undefined = imageRequest.data.data?.[0]?.url;
	const revisedPrompt : string | undefined = imageRequest.data.data?.[0]?.revised_prompt;

	if (!imageLink) {
		await interaction.editReply("Image link not found.");
		logger.error("Draw: Image link not found in the response.");
		return;
	}
	const imageBufferRequest = await axios.get(imageLink, { responseType: "arraybuffer" })
		.catch(async () => {
			logger.error("Draw: An error occurred while fetching the image.");
		});

	if (!imageBufferRequest) {
		return;
	}
	await interaction.editReply({ files: [imageBufferRequest.data], content: `${prompt}\r\n\r\n-# ${revisedPrompt}` });
}
