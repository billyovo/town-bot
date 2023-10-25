import { isToday } from "../utils/eventScheduler/helper";
import { test, expect, describe } from "@jest/globals";

describe("isToday()", () => {
	test("should be true if time and date is the same", () => {
		const date1 = new Date(2099, 12, 5, 16, 0, 0);
		const date2 = new Date(2099, 12, 5, 16, 0, 0);

		expect(isToday(date1, date2)).toBe(true);
	});

	test("should be true if date is the same but time is different", () => {
		const date1 = new Date(2099, 12, 5, 12, 0, 0);
		const date2 = new Date(2099, 12, 5, 16, 4, 9);

		expect(isToday(date1, date2)).toBe(true);
	});
	test("should be false if date is different but time is the same", () => {
		const date1 = new Date(2099, 12, 5, 16, 0, 0);
		const date2 = new Date(2099, 12, 6, 16, 0, 0);

		expect(isToday(date1, date2)).toBe(false);
	});

	test("should be false if date and time is different", () => {
		const date1 = new Date(2099, 12, 5, 16, 0, 0);
		const date2 = new Date(2099, 12, 6, 16, 4, 9);

		expect(isToday(date1, date2)).toBe(false);
	});

	test("should be false if date1 > date2", () => {
		const date1 = new Date(2099, 12, 6, 16, 0, 0);
		const date2 = new Date(2099, 12, 5, 16, 0, 0);

		expect(isToday(date1, date2)).toBe(false);
	});
});
