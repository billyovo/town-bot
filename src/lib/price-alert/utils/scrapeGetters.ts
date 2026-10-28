import { HTMLClient } from "../../utils/fetch/client";
import parse, { HTMLElement } from "node-html-parser";
import { Failure, Success } from "~/src/@types/utils";
import { logger } from "../../logger/logger";

export async function getHTML(url: string): Promise<Success<HTMLElement> | Failure> {
	let html;
	try {
		html = await HTMLClient.get(url);
	} catch (error) {
		const status = (error as { response?: { status?: number } }).response?.status;
		logger.error(`Failed to fetch ${url}${status ? ` (HTTP ${status})` : ""}`);
		return {
			data: null,
			success: false,
			error:
				status === 403 ? "Blocked by the site (HTTP 403)" : `Failed to fetch url${status ? ` (HTTP ${status})` : ""}`,
		};
	}

	try {
		const root = parse(html.data);
		return { success: true, data: root };
	} catch (e) {
		logger.error(e);
		return { success: false, error: `Failed to parse html: ${(e as Error).message}`, data: null };
	}
}

export async function getLDScript(root: HTMLElement): Promise<Record<string, any> | null> {
	const allAvailableProductInfoString = root.querySelectorAll('script[type="application/ld+json"]');
	if (!allAvailableProductInfoString) return null;

	for (const scriptContent of allAvailableProductInfoString) {
		try {
			const jsonData = JSON.parse(scriptContent?.text || "");
			if (jsonData["@type"] === "Product") {
				return jsonData;
			}
		} catch {
			continue;
		}
	}
	return null;
}
