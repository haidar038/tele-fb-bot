const { extractPrice, hasKeyword, inRange } = require("../src/parser");

describe("Parser Module", () => {
    test("should detect keyword case-insensitively", () => {
        expect(hasKeyword("Jual akun COC murah", ["coc"])).toBe(true);
        expect(hasKeyword("no match here", ["coc"])).toBe(false);
    });

    test("should extract price with unit", () => {
        expect(extractPrice("Harga 1.5jt")).toBe(1500000);
        expect(extractPrice("Rp 200.000")).toBe(200000);
    });

    test("should return null if no price", () => {
        expect(extractPrice("Tidak ada harga")).toBeNull();
    });

    test("should validate price range", () => {
        const range = { min: 100000, max: 500000 };
        expect(inRange(150000, range)).toBe(true);
        expect(inRange(600000, range)).toBe(false);
    });
});
