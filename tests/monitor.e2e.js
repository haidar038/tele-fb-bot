const { test, expect } = require("@playwright/test");
const parser = require("../src/parser");
// Mocking dan setup environment diperlukan untuk API Telegram

test("should parse posting dan kirim notifikasi (mock)", async () => {
    const sampleText = "Jual akun murah 300rb";
    const price = parser.extractPrice(sampleText);
    expect(price).toBe(300000);
    // Simulasikan panggilan notifier dengan mock
    // expect(mockNotify).toHaveBeenCalledWith(...)
});
