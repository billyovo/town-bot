import { HTMLClient } from "~/utils/scraper/client";
import { AttachmentBuilder } from "discord.js";
import { logger } from "~/logger/logger";

// sometimes image url is protected by token, we want to fetch the image and create an attachment from it so that we can access the image.

export async function createAttachmentFromImageURL(url : string) : Promise<AttachmentBuilder | null> {
	let productAttachment : AttachmentBuilder | null = null;
	try {
		if (url) {
			const image = await HTMLClient.get(url, { responseType: "arraybuffer" });
			productAttachment = new AttachmentBuilder(image.data, { name: "productImage.png" });
		}
	}
	catch (error) {
		logger(`Failed to create attachment from image URL: ${error}`);
	}

	return productAttachment;
}