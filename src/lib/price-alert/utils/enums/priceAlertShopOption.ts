import { ShopParseFunction } from "~/src/@types/price-alert";
import { parseAeonPrice } from "~/src/lib/price-alert/scrape/websites/aeon";
import { parseHktvmallPrice } from "~/src/lib/price-alert/scrape/websites/hktvmall";
import { parseManningsPrice } from "~/src/lib/price-alert/scrape/websites/mannings";
import { parseShoplinePrice } from "~/src/lib/price-alert/scrape/websites/shopline";
import { parseSephoraPrice } from "~/src/lib/price-alert/scrape/websites/sephora";
import { parseWatsonsGroupPrice } from "~/src/lib/price-alert/scrape/websites/watsonsGroup";
import { parseWellcomePrice } from "~/src/lib/price-alert/scrape/websites/wellcome";
import { parseStylevanaPrice } from "../../scrape/websites/stylevana";

export type ParseDetails = {
    image: string;
    parseFunction: ShopParseFunction;
	emote: string;
};

export enum PriceAlertShopOption {
    HKTVMALL = "HKTVMALL",
    WATSONS = "WATSONS",
    AEONCITY = "AEONCITY",
    PNS = "PNS",
    SEPHORA = "SEPHORA",
    MANNINGS = "MANNINGS",
	SHOPLINE = "SHOPLINE",
    WELLCOME = "WELLCOME",
	STYLEVANA = "STYLEVANA",
}

export const PriceAlertShopParseDetails: Record<PriceAlertShopOption, ParseDetails> = {
	[PriceAlertShopOption.HKTVMALL]: {
		image: "https://i.imgur.com/wYnaMoS.png",
		parseFunction: parseHktvmallPrice,
		emote: "<:hktvmall:1263718464519143486>",
	},
	[PriceAlertShopOption.WATSONS]: {
		image: "https://i.imgur.com/VJ2JDG9.png",
		parseFunction: parseWatsonsGroupPrice,
		emote: "<:watsons:1263718482592268368>",
	},
	[PriceAlertShopOption.AEONCITY]: {
		image: "https://i.imgur.com/nopW4EX.png",
		parseFunction: parseAeonPrice,
		emote: "<:aeon:1263718492322922527>",
	},
	[PriceAlertShopOption.PNS]: {
		image: "https://i.imgur.com/cT0UG1S.png",
		parseFunction: parseWatsonsGroupPrice,
		emote: "<:PNS:1263718500950868019>",
	},
	[PriceAlertShopOption.SEPHORA]: {
		image: "https://pbs.twimg.com/profile_images/459373077822861312/nHUto8C6_400x400.jpeg",
		parseFunction: parseSephoraPrice,
		emote: "<:sephora:1263718515488325734>",
	},
	[PriceAlertShopOption.MANNINGS]: {
		image: "https://i.imgur.com/OnplWyK.jpg",
		parseFunction: parseManningsPrice,
		emote: "<:mannings:1263718526729060383>",
	},
	[PriceAlertShopOption.SHOPLINE]: {
		image: "https://i.imgur.com/HWQtgp9.png",
		parseFunction: parseShoplinePrice,
		emote: "<:shopline:1351507444072976384>",
	},
	[PriceAlertShopOption.WELLCOME]: {
		image: "https://i.imgur.com/A5ogcsY.png",
		parseFunction: parseWellcomePrice,
		emote: "<:wellcome:1263718551424991243>",
	},
	[PriceAlertShopOption.STYLEVANA]: {
		image: "https://i.imgur.com/CWY9dNS.png",
		parseFunction: parseStylevanaPrice,
		emote: "<:stylevana:1423928481271775303>",
	},

} satisfies Record<PriceAlertShopOption, ParseDetails>;

export enum PriceAlertListMode {
    ALL = "all",
    DETAILED = "detailed",
}

export enum PriceAlertResult {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    PRICE_DECREASE = "PRICE_DECREASE",
	PRICE_INCREASE = "PRICE_INCREASE",
}
