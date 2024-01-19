import axios from "axios";
import { logger } from "../../logger/logger";
import { Base64String } from "discord.js";

export async function getImageBase64FromLink(url : string) : Promise<string | null> {
	try {
		const image = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
			},
			responseType: "arraybuffer",
		});
		return image.data.toString("base64");

	}
	catch (error) {
		logger(`Failed to create attachment from image URL: ${error}`);
		return null;
	}

}

export async function createImgurURLFromBase64(data : Base64String): Promise<string | null> {
	if (!data) return null;
	try {
		const imgurResponse = await axios.post("https://api.imgur.com/3/image", data, {
			headers: {
				"Authorization":  `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
			},
		});
		return imgurResponse.data?.data?.link || null;

	}
	catch (error) {
		logger(`Failed to create Imgur URL from image URL: ${error}`);
		return null;
	}
}