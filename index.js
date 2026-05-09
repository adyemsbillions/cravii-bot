const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({

    authStrategy: new LocalAuth({
        dataPath: './session'
    }),

    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    }

});

const users = {};

/* ---------------- RESTAURANTS ---------------- */

const restaurants = [
    "Man Must Wack",
    "Suzzy Restaurant - UNIMAID",
    "Mboy",
    "Lizzy Restaurant UNIMAID",
    "Umar Lawan",
    "GPDFS FUSION",
    "The EVIL Cuisine",
    "ChopUp",
    "Stellas Kitchen",
    "Dmark Restaurant",
    "Chummy Ventures",
    "High Level Restaurant",
    "Qibdeeyas Bakery",
    "Affdalu’s Bakery",
    "Home Chef",
    "SHAGALI EATERY UNIMAID",
    "Cravins",
    "AMALA WESTENED FOOD",
    "Chill Express",
    "Betel Food Hub",
    "AL-HANA Restaurant",
    "Down Town",
    "Lizzy Restaurant",
    "Suzzy Restaurant",
    "Shakha Juicy Restaurant",
    "Pogueslandia Eatery",
    "Bintas Empire",
    "Zaimah Fresh",
    "Hebron Foods",
    "Savory Haven",
    "Destie Pastries",
    "LM Bakery and Restaurant",
    "Cravii Foods (Custom Orders Only)",
    "Pogueslandia Grab N GO",
    "Favour Restaurant",
    "Becky",
    "Laficas Feeds (Farm)",
    "Savor Station"
];

/* ---------------- QR ---------------- */

const fs = require('fs');

client.on('qr', (qr) => {
    console.log('QR RECEIVED, saving as image...');

    const { createCanvas } = require('canvas');
    const QRCode = require('qrcode');

    QRCode.toFile('qr.png', qr, {
        width: 500
    });

    console.log('Check qr.png file and scan it');
});

/* ---------------- READY ---------------- */

client.on('ready', () => {
    console.log('Cravii Bot is Ready 🚚');
});

/* ---------------- MESSAGE HANDLER ---------------- */

client.on('message_create', async (message) => {

    if (message.fromMe) return;

    const chatId = message.from;
    const text = message.body.trim();

    if (!users[chatId]) {
        users[chatId] = { step: 'start' };
    }

    const user = users[chatId];

    /* ---------------- START ---------------- */

    if (text.toLowerCase() === 'hi') {

        user.step = 'main_menu';

        return message.reply(`Welcome to Cravii Logistics 🚚

1. Send Parcel
2. Receive Parcel
3. Order Food`);
    }

    /* ---------------- MENU ---------------- */

    if (user.step === 'main_menu') {

        if (text === '1') {
            user.step = 'parcel_pickup';
            return message.reply('📍 Enter Pickup Location');
        }

        if (text === '2') {
            user.step = 'receive_sender_name';
            return message.reply('📦 Enter Sender Name');
        }

        if (text === '3') {

            user.step = 'food_restaurant';

            let list = "🍔 Choose Restaurant\n\n";

            restaurants.forEach((r, i) => {
                list += `${i + 1}. ${r}\n`;
            });

            return message.reply(list);
        }

        return message.reply('Reply 1, 2 or 3');
    }

    /* ---------------- FOOD FLOW ---------------- */

    if (user.step === 'food_restaurant') {

        const num = parseInt(text);

        if (isNaN(num) || num < 1 || num > restaurants.length) {
            return message.reply("Invalid selection");
        }

        user.restaurant = restaurants[num - 1];
        user.step = 'food_order';

        return message.reply(`🍔 ${user.restaurant}\nType your order`);
    }

    if (user.step === 'food_order') {
        user.order = text;
        user.step = 'food_location';

        return message.reply('📍 Delivery location');
    }

    if (user.step === 'food_location') {
        user.location = text;
        user.step = 'food_phone';

        return message.reply('📞 Phone number');
    }

    if (user.step === 'food_phone') {

        user.phone = text;
        user.step = 'food_confirm';

        return message.reply(`🍔 SUMMARY

Restaurant: ${user.restaurant}
Order: ${user.order}
Location: ${user.location}
Phone: ${user.phone}

Fee: ₦1890

1. Proceed
2. Cancel`);
    }

    if (user.step === 'food_confirm') {

        if (text === '1') {
            user.step = 'done';
            return message.reply("✅ Order confirmed");
        }

        if (text === '2') {
            delete users[chatId];
            return message.reply("❌ Cancelled");
        }
    }

});

client.initialize();
