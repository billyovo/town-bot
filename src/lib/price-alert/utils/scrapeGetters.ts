import { HTMLClient } from "../../utils/fetch/client";
import parse, { HTMLElement } from "node-html-parser";
import { Failure, Success } from "~/src/@types/utils";
import { logger } from "../../logger/logger";

export async function getHTML(url : string) : Promise<Success<HTMLElement> | Failure> {
	const html = await HTMLClient.get(url).catch(() => {
		logger.error(`Failed to fetch ${url}`);
		return { data: null, success: false, error: "Failed to fetch url" };
	});

	try {
		const root = parse(html.data);
		return { success: true, data: root };
	}
	catch (e) {
		logger.error(e);
		return { success: false, error: `Failed to parse html: ${(e as Error).message}`, data: null };
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLDScript(root : HTMLElement) : Promise<Record<string, any> | null> {
	const productInfoString = root.querySelector("script[type=\"application/ld+json\"]")?.text;
	if (!productInfoString) return null;

	try {
		return JSON.parse(productInfoString);
	}
	catch (e) {
		return null;
	}
}