import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function execute(interaction: ChatInputCommandInteraction) {
	const prompt = interaction.options.get("prompt")!.value;
	const size = interaction.options.get("size")?.value ?? "1024x1024";

	const headers = {
		"Cache-Control": "no-cache, must-revalidate",
		"Content-Type": "application/json",
		"api-key": process.env.DRAW_KEY,
	};
	const body = {
		"caption": prompt,
		"resolution": size,
	};

	const client = axios.create({
		validateStatus: function(status) {
			return status < 500;
		},
	});

	await interaction.deferReply();

	const jobID = await client.post(`${process.env.DRAW_LINK}${process.env.DRAW_API_VERSION}`, body, { headers: headers });
	// out of quota!
	if (jobID.status >= 300) return await interaction.editReply({ content: `${jobID.data.message ?? jobID.data.error?.message}` });

	// wait for the job to be finished before polling
	await sleep(2000);
	const polling = setInterval(async () => {
		try {
			const url = await client.get(`${process.env.DRAW_LINK}/operations/${jobID.data.id}${process.env.DRAW_API_VERSION}`, { headers: headers });
			if (url.status === 429) throw new Error(url.data?.message ?? "Too many requests, please try again later");
			if (url.status >= 300) throw new Error(url.data?.message ?? "Something went wrong, please try again later");

			switch (url.data.status) {
				case "Running":{
					await interaction.editReply({ content: "Drawing your image..." });
					break;
				}
				case "NotStarted":{
					await interaction.editReply({ content: "Starting to draw your image..." });
					break;
				}
				case "Failed":{
					throw new Error(url.data.error.message);
				}
				case "Succeeded":{
					clearInterval(polling);
					const image = await client.get(url.data.result.contentUrl, { responseType: "arraybuffer" });
					if (image.status >= 300) throw new Error("Something is wrong when getting the image :(");
					await interaction.editReply({ files: [image.data], content: `${prompt}` });
					break;
				}
			}
		}
		catch (error) {
			if (error instanceof Error) {
				clearInterval(polling);
				await interaction.editReply(error.message);
			}
		}
	}, 1500);
}