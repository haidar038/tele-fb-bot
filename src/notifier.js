// notifier.js
const { Telegraf } = require("telegraf");
const config = require("../config.json");

// Ambil token bot Telegram dari env atau config
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || config.telegram.botToken;
const CHAT_ID = config.telegram.chatId;
const bot = new Telegraf(BOT_TOKEN);

async function sendNotification({ groupUrl, text, price, timestamp }) {
    const date = new Date(parseInt(timestamp, 10) * 1000).toLocaleString();
    const msg =
        `💬 <b>Posting Baru</b>
` +
        `<b>Grup:</b> ${groupUrl}
` +
        `<b>Harga:</b> Rp${price.toLocaleString()}
` +
        `<b>Waktu:</b> ${date}
` +
        `<b>Isi:</b> ${text.slice(0, 200)}...`;
    await bot.telegram.sendMessage(CHAT_ID, msg, { parse_mode: "HTML" });
}

module.exports = { sendNotification };
