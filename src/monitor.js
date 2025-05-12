require("dotenv").config();
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const parser = require("./parser");
const notifier = require("./notifier");

const config = require("../config.json");
// Kredensial dari environment
const FB_EMAIL = process.env.FB_EMAIL;
const FB_PASSWORD = process.env.FB_PASSWORD;

// File untuk menyimpan timestamp terakhir per grup
const stateFile = path.resolve(__dirname, "../.last_timestamps.json");
let lastTimestamps = {};
if (fs.existsSync(stateFile)) {
    lastTimestamps = JSON.parse(fs.readFileSync(stateFile));
}

async function checkGroups() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Login Facebook
    await page.goto("https://www.facebook.com/login");
    await page.type("#email", FB_EMAIL);
    await page.type("#pass", FB_PASSWORD);
    await page.click("[name=login]");
    await page.waitForNavigation();

    // Loop tiap grup
    for (const groupUrl of config.facebook.groups) {
        await page.goto(groupUrl);
        await page.waitForSelector("[role=feed]");
        const posts = await page.$$("[role=feed] > div");
        for (const post of posts) {
            const timestamp = await post.$eval("abbr", (el) => el.getAttribute("data-utime"));
            if (!timestamp) continue;
            if (lastTimestamps[groupUrl] && timestamp <= lastTimestamps[groupUrl]) continue;

            const text = await post.$eval('[data-ad-preview="message"]', (el) => el.innerText).catch(() => "");
            if (parser.hasKeyword(text, config.keywords)) {
                const price = parser.extractPrice(text);
                if (price !== null && parser.inRange(price, config.priceRange)) {
                    await notifier.sendNotification({ groupUrl, text, price, timestamp });
                }
            }

            lastTimestamps[groupUrl] = timestamp;
        }
    }

    fs.writeFileSync(stateFile, JSON.stringify(lastTimestamps, null, 2));
    await browser.close();
}

// Jadwalkan cron sehingga berjalan maksimal 1x sehari (misal pukul 01:00)
cron.schedule("0 1 * * *", () => {
    console.log(`${new Date().toISOString()} - Running daily checkGroups`);
    checkGroups().catch(console.error);
});

// Jalankan awal sekali
checkGroups().catch(console.error);
