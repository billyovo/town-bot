import { describe, expect, test } from "@jest/globals";
import { getUUIDFromPlayerName } from "../utils/mojang";

describe("Test Minecraft UUID Getter", () => {
	test("Should return a UUID if valid", async () => {
		const uuid = await getUUIDFromPlayerName("billyovo");
		const uuid2 = await getUUIDFromPlayerName("jack4444");

		expect(uuid).toBe("13ef7548270b4a67a58bfe880701b11e");
		expect(uuid2).toBe("975059e9bdb54efab340f10777e7ba98");
	});

	test("Should return null if invalid", async () => {
		const uuid = await getUUIDFromPlayerName("aglaemgklaegmlasegkselkm");
		const uuid2 = await getUUIDFromPlayerName("35b8u2m95bm235u9b2mb25833b85239");

		expect(uuid).toBe(null);
		expect(uuid2).toBe(null);
	});
});