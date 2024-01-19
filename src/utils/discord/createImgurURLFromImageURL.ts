import axios from "axios";
import { logger } from "../../logger/logger";
import { Base64String } from "discord.js";

export async function createImgurURLFromImageURL(url : string) : Promise<string | null> {
	let imgurURL;
	try {
		if (url) {
			const image = await axios.get(url, {
				headers: {
					"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
				},
				responseType: "arraybuffer",
			});
			imgurURL = await createImgurURL(image.data.toString("base64"));
		}
	}
	catch (error) {
		logger(`Failed to create attachment from image URL: ${error}`);
	}

	return imgurURL || null;
}

export async function createImgurURL(data : Base64String): Promise<string | null> {
	let ImgurResponse;
	try {
		if (data) {
			ImgurResponse = await axios.post("https://api.imgur.com/3/image",
				`${data}`
				, {
					headers: {
						"Authorization":  `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
					},
				});
		}
	}
	catch (error) {
		logger(`Failed to create Imgur URL from image URL: ${error}`);
	}

	return ImgurResponse?.data?.data?.link || null;
}