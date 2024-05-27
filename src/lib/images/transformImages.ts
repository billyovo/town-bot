import axios from "axios";
import { log } from "../logger/logger";
import { Base64String } from "discord.js";
import { HTMLClient } from "~/src/lib/utils/fetch/client";
import sharp from "sharp";


export async function getImageBase64FromLink(url : string) : Promise<string | null> {
	try {
		const image = await HTMLClient.get(url, {
			responseType: "arraybuffer",
		});

		let jpegData;

		if (["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(image.headers["content-type"])) {
			jpegData = image.data;
		}
		else {
			jpegData = await sharp(image.data).toFormat("jpeg").toBuffer();
		}

		return jpegData.toString("base64");
	}
	catch (error) {
		log(`Failed to create attachment from image URL: ${error}`);
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
		if (axios.isAxiosError(error) && error.response) {
			const imgurError = error.response.data;
			log(`Failed to create Imgur URL from image URL: ${imgurError.data.error}`);
		}
		else {
			log(`Failed to create Imgur URL from image URL: ${error}`);
		}
		return null;
	}
}