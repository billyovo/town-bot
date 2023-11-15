import { isTomorrow } from "@utils/eventScheduleGenerator/helper";
import { test, expect, describe } from "@jest/globals";

describe("isTomorrow()", () => {
	test("should be true if date is tomorrow and time is the same", () => {
		const date1 = new Date(2099, 12, 5, 12, 0, 0);
		const date2 = new Date(2099, 12, 6, 12, 0, 0);

		expect(isTomorrow(date1, date2)).toBe(true);
	});

	test("should be true if date is tomorrow but time is different", () => {
		const date1 = new Date(2099, 12, 5, 12, 0, 0);
		const date2 = new Date(2099, 12, 6, 16, 4, 9);

		expect(isTomorrow(date1, date2)).toBe(true);
	});

	test("should be false if date is not tomorrow", () => {
		const date1 = new Date(2099, 12, 5, 12, 0, 0);
		const date2 = new Date(2099, 12, 5, 16, 4, 9);

		expect(isTomorrow(date1, date2)).toBe(false);
	});

	test("should be false if date1 > date 2", () => {
		const date1 = new Date(2099, 12, 6, 12, 0, 0);
		const date2 = new Date(2099, 12, 5, 16, 4, 9);

		expect(isTomorrow(date1, date2)).toBe(false);
	});
});
