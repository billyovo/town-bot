import axios from "axios";
import { logger } from "../../logger/logger";
import { Base64String } from "discord.js";
import { HTMLClient } from "@utils/scraper/client";

export async function getImageBase64FromLink(url : string) : Promise<string | null> {
	try {
		const image = await HTMLClient.get(url, {
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