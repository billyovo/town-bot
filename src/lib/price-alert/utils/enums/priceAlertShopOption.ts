import { ShopParseFunction } from "~/src/@types/price-alert";
import { parseAeonPrice } from "~/src/lib/price-alert/scrape/websites/aeon";
import { parseHktvmallPrice } from "~/src/lib/price-alert/scrape/websites/hktvmall";
import { parseLookfantasticPrice } from "~/src/lib/price-alert/scrape/websites/lookfantastic";
import { parseManningsPrice } from "~/src/lib/price-alert/scrape/websites/mannings";
import { parseMujiPrice } from "~/src/lib/price-alert/scrape/websites/muji";
import { parseSephoraPrice } from "~/src/lib/price-alert/scrape/websites/sephora";
import { parseWatsonsGroupPrice } from "~/src/lib/price-alert/scrape/websites/watsonsGroup";
import { parseWellcomePrice } from "~/src/lib/price-alert/scrape/websites/wellcome";

type ParseDetails = {
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
    MUJI = "MUJI",
    WELLCOME = "WELLCOME",
	LOOKFANTASTIC = "LOOKFANTASTIC",
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
	[PriceAlertShopOption.MUJI]: {
		image: "https://i.imgur.com/ykFhg6J.png",
		parseFunction: parseMujiPrice,
		emote: "<:muji:1263718540322803804>",
	},
	[PriceAlertShopOption.WELLCOME]: {
		image: "https://i.imgur.com/A5ogcsY.png",
		parseFunction: parseWellcomePrice,
		emote: "<:wellcome:1263718551424991243>",
	},
	[PriceAlertShopOption.LOOKFANTASTIC]: {
		image: "https://pbs.twimg.com/profile_images/1687076928635711488/G0CE0Q8-_400x400.jpg",
		parseFunction: parseLookfantasticPrice,
		emote: "<:lookfantastic:1263718561529069578>",
	},
} satisfies Record<PriceAlertShopOption, ParseDetails>;

export enum PriceAlertListMode {
    ALL = "all",
    DETAILED = "detailed",
}

export enum PriceAlertResult {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    PRICE_CHANGE = "PRICE_CHANGE"
}
