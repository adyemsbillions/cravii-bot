const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: {
        headless: true,
        executablePath: '/opt/render/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    }

});

const users = {};

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

client.on('qr', (qr) => {

    qrcode.generate(qr, { small: true });

});

client.on('ready', () => {

    console.log('Cravii Bot is Ready 🚚');

});

client.on('message_create', async (message) => {

    if (message.fromMe) return;

    const chatId = message.from;

    const text = message.body.trim();

    if (!users[chatId]) {

        users[chatId] = {
            step: 'start'
        };
    }

    const user = users[chatId];



    // ================= START =================

    if (text.toLowerCase() === 'hi') {

        users[chatId] = {
            step: 'main_menu'
        };

        return message.reply(`Welcome to Cravii Logistics 🚚

1. Send Parcel
2. Receive Parcel
3. Order Food`);
    }



    // ================= MAIN MENU =================

    if (user.step === 'main_menu') {

        // SEND PARCEL
        if (text === '1') {

            user.step = 'parcel_pickup';

            return message.reply('📍 Enter Pickup Location');
        }

        // RECEIVE PARCEL
        else if (text === '2') {

            user.step = 'receive_sender_name';

            return message.reply('📦 Enter Sender Name');
        }

        // FOOD
        else if (text === '3') {

            user.step = 'food_restaurant';

            let list = '🍔 Choose Restaurant\n\n';

            restaurants.forEach((r, i) => {

                list += `${i + 1}. ${r}\n`;

            });

            return message.reply(list);
        }

        else {

            return message.reply('Reply with 1, 2 or 3');
        }
    }



    // ================= SEND PARCEL =================

    if (user.step === 'parcel_pickup') {

        user.pickup = text;

        user.step = 'parcel_receiver';

        return message.reply('👤 Enter Receiver Name');
    }

    if (user.step === 'parcel_receiver') {

        user.receiver = text;

        user.step = 'parcel_phone';

        return message.reply('📞 Enter Receiver Phone');
    }

    if (user.step === 'parcel_phone') {

        user.phone = text;

        user.step = 'parcel_delivery';

        return message.reply('📍 Enter Delivery Location');
    }

    if (user.step === 'parcel_delivery') {

        user.delivery = text;

        user.step = 'parcel_item';

        return message.reply('📦 Describe Parcel');
    }

    if (user.step === 'parcel_item') {

        user.item = text;

        user.step = 'parcel_confirm';

        return message.reply(`📦 PARCEL SUMMARY

📍 Pickup: ${user.pickup}

👤 Receiver: ${user.receiver}

📞 Phone: ${user.phone}

📦 Parcel: ${user.item}

📍 Delivery: ${user.delivery}

🚚 Delivery Fee: ₦2200

1. Proceed
2. Cancel`);
    }



    // ================= PARCEL CONFIRM =================

    if (user.step === 'parcel_confirm') {

        if (text === '1') {

            user.step = 'done';

            return message.reply(`✅ Parcel Delivery Confirmed

Your rider will contact you shortly.

Reply HI to start again.`);
        }

        else if (text === '2') {

            delete users[chatId];

            return message.reply('❌ Parcel Order Cancelled');
        }

        else {

            return message.reply('Reply with:\n1. Proceed\n2. Cancel');
        }
    }



    // ================= RECEIVE PARCEL =================

    if (user.step === 'receive_sender_name') {

        user.sender = text;

        user.step = 'receive_phone';

        return message.reply('📞 Enter Sender Phone');
    }

    if (user.step === 'receive_phone') {

        user.sender_phone = text;

        user.step = 'receive_pickup';

        return message.reply('📍 Enter Pickup Location');
    }

    if (user.step === 'receive_pickup') {

        user.pickup = text;

        user.step = 'receive_delivery';

        return message.reply('📍 Enter Delivery Location');
    }

    if (user.step === 'receive_delivery') {

        user.delivery = text;

        user.step = 'receive_confirm';

        return message.reply(`📦 RECEIVE PARCEL SUMMARY

👤 Sender: ${user.sender}

📞 Phone: ${user.sender_phone}

📍 Pickup: ${user.pickup}

📍 Delivery: ${user.delivery}

🚚 Delivery Fee: ₦2200

1. Proceed
2. Cancel`);
    }



    // ================= RECEIVE CONFIRM =================

    if (user.step === 'receive_confirm') {

        if (text === '1') {

            user.step = 'done';

            return message.reply(`✅ Parcel Pickup Confirmed

Your rider will contact you shortly.

Reply HI to start again.`);
        }

        else if (text === '2') {

            delete users[chatId];

            return message.reply('❌ Parcel Pickup Cancelled');
        }

        else {

            return message.reply('Reply with:\n1. Proceed\n2. Cancel');
        }
    }



    // ================= FOOD =================

    if (user.step === 'food_restaurant') {

        const num = parseInt(text);

        if (isNaN(num) || num < 1 || num > restaurants.length) {

            return message.reply('❌ Invalid restaurant number');
        }

        user.restaurant = restaurants[num - 1];

        user.step = 'food_order';

        return message.reply(`🍔 ${user.restaurant}

Type your order/menu`);
    }

    if (user.step === 'food_order') {

        user.order = text;

        user.step = 'food_location';

        return message.reply('📍 Enter Delivery Location');
    }

    if (user.step === 'food_location') {

        user.location = text;

        user.step = 'food_phone';

        return message.reply('📞 Enter Phone Number');
    }

    if (user.step === 'food_phone') {

        user.customer_phone = text;

        user.step = 'food_confirm';

        return message.reply(`🍔 FOOD ORDER SUMMARY

🍔 Restaurant: ${user.restaurant}

📝 Order: ${user.order}

📍 Location: ${user.location}

📞 Phone: ${user.customer_phone}

🚚 Delivery Fee: ₦1890

1. Proceed
2. Cancel`);
    }



    // ================= FOOD CONFIRM =================

    if (user.step === 'food_confirm') {

        if (text === '1') {

            user.step = 'done';

            return message.reply(`✅ Food Order Confirmed

Restaurant has received your order.

Reply HI to start again.`);
        }

        else if (text === '2') {

            delete users[chatId];

            return message.reply('❌ Food Order Cancelled');
        }

        else {

            return message.reply('Reply with:\n1. Proceed\n2. Cancel');
        }
    }



    // ================= DONE =================

    if (user.step === 'done') {

        return message.reply(`✅ Request already completed

Reply HI to start again.`);
    }

});

client.initialize();
