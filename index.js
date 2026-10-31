const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// Створюємо простий вебсервер для підтримки роботи 24/7
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = '8046369329';

// === СЛОВНИК АРХЕТИПІВ ===
const archetypesData = {
  ART: { name: "Артеміда", slavic: "Молода Войовниця / Морана", norse: "Скаді", core: "Архетип незалежної жінки яка знає чого хоче і рухається прямо до мети без оглядки на чужу думку." },
  ATH: { name: "Афіна", slavic: "Мудра Волхвиня / Жриця-Захисниця", norse: "Норни", core: "Архетип жінки-стратега яка мислить логічно і ефективно." },
  HES: { name: "Гестія", slavic: "Берегиня / Жриця Священного Вогню", norse: "-", core: "Архетип жінки яка живе зсередини назовні, її внутрішній центр є джерелом спокою." },
  HER: { name: "Гера", slavic: "Лада-Цариця / Богиня Шлюбного Союзу", norse: "Фрігг", core: "Архетип жінки для якої союз є центральним сенсом існування." },
  DEM: { name: "Деметра", slavic: "Мати Сира Земля / Мокоша", norse: "Нертус", core: "Архетип матері яка дає безумовно. Все навколо неї росте." },
  PER: { name: "Персефона", slavic: "Дівиця між Яв і Нав", norse: "Хель", core: "Архетип жінки яка трансформується через страждання, провідник між світами." },
  APH: { name: "Афродіта", slavic: "Лада — Жива Творча Сила", norse: "Фрейя", core: "Алхімічна Богиня кохання і краси. Всі з ким вона взаємодіє — трансформуються." },
  ZEV: { name: "Зевс", slavic: "Перун", norse: "Тор / Одін", core: "Архетип природженого лідера який мислить стратегічно і потребує контролю." },
  POS: { name: "Посейдон", slavic: "Дух Вод / Темний Велес", norse: "Ньйорд", core: "Архетип чоловіка з потужним емоційним ядром. Коли спокійний — дає простір, коли бушує — руйнує." },
  AID: { name: "Аїд", slavic: "Велес-Нав", norse: "Хель", core: "Архетип інтроверта що живе у своєму внутрішньому світі, розуміє темряву." },
  APL: { name: "Аполлон", slavic: "Дажбог / Хорс", norse: "Бальдр", core: "Архетип раціонального перфекціоніста. Все має бути правильним і досконалим." },
  HERMES: { name: "Гермес", slavic: "Велес-Слово", norse: "Локі", core: "Архетип посередника між світами. Швидкий, дотепний, знаходить мову з будь-ким." },
  ARS: { name: "Арес", slavic: "Ярило / Перун-Воїн", norse: "Тюр", core: "Архетип воїна в польових умовах — тіло, інстинкт, пристрасть." },
  HEF: { name: "Гефест", slavic: "Сварог / Сварожич", norse: "-", core: "Архетип майстра який перетворює власний біль на мистецтво." },
  DIO: { name: "Діоніс", slavic: "Купайло / Містичний Ярило", norse: "-", core: "Живе через відчуття і злиття з іншими, шукає досвіди екстазу." }
};

// === ГОЛОВНЕ МЕНЮ ТА КЛАВІАТУРА ===
bot.start(async (ctx) => {
    const userName = ctx.from.first_name || 'друг';
    const bannerUrl = 'https://i.ibb.co/3s6k5pM/yggdrasil-banner.jpg'; 

    const welcomeText = 
    `Вітаю, ${userName}! 🌿\n\n` +
    `Це **Простір Глибинного Самопізнання**.\n\n` +
    `Твоя точка збору для роботи з підсвідомістю, міфологією та внутрішніми станами.\n` +
    `Обери інструмент на панелі внизу:`;

    await ctx.replyWithPhoto(bannerUrl, {
        caption: welcomeText,
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                [
                  { text: '🎭 Архетипи', web_app: { url: 'https://archetypes-app-4.vercel.app/' } },
                  { text: '🌙 Сонник', web_app: { url: 'https://dreams-app-gold.vercel.app/' } }
                ],
                [ { text: '🧠 Кишеньковий психолог (Тінь)' } ],
                [ { text: '💬 Зв’язатися з автором' } ]
            ],
            resize_keyboard: true,
            is_persistent: true
        }
    });
});

// Обробка текстових кнопок з нижньої клавіатури
bot.hears('🧠 Кишеньковий психолог (Тінь)', (ctx) => {
    ctx.reply('Щоб розпочати роботу з Тінню, переходь до окремого бота WeSync:', 
        Markup.inlineKeyboard([Markup.button.url('Перейти до Психолога', 'https://t.me/wesync_ua_bot')])
    );
});

bot.hears('💬 Зв’язатися з автором', (ctx) => {
    ctx.reply('Напиши мені сюди для замовлення особистих розборів або консультацій:', 
        Markup.inlineKeyboard([Markup.button.url('Написати автору', 'https://t.me/runes_valeriy')])
    );
});

// === ПЕРЕХОПЛЕННЯ ДАНИХ З АНКЕТИ АРХЕТИПІВ ===
bot.on('web_app_data', async (ctx) => {
  try {
    const rawData = ctx.message.web_app_data.data;
    const data = JSON.parse(rawData);
    
    if(data.type === 'dream_result') return;

    const archKey = data.archKey || 'ART';
    const archInfo = archetypesData[archKey] || { name: "Невідомий", slavic: "-", norse: "-", core: "-" };

    const userMessage = `🎭 **Твій провідний архетип: ${archInfo.name}**\n` +
                        `🏛 *Відповідники:* ${archInfo.slavic} | ${archInfo.norse}\n\n` +
                        `📖 **Суть:**\n${archInfo.core}\n\n` +
                        `✨ *Це лише базовий результат.* Хочеш дізнатися про свої тіньові сторони, ресурси та розбір Аніми/Анімуса?\n\n` +
                        `💳 **Вартість повного PDF-розбору:** вільний донат (від 100 грн).\n\n` +
                        `👇 Після донату тисни «Замовити повний розбір» та надішли скріншот оплати!`;

    await ctx.reply(userMessage, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('📩 Замовити повний розбір', 'https://t.me/runes_valeriy')],
        [Markup.button.url('☕ Підтримати автора', 'https://donatello.to/dity_dazhbozhi')]
      ])
    });

    const adminMessage = `📥 **НОВИЙ РЕЗУЛЬТАТ!**\n` +
                         `👤 Клієнт: ${data.clientName || 'Не вказано'}\n` +
                         `🔑 Архетип: ${archInfo.name} (${archKey})\n\n` +
                         `🔐 **ШИФР:**\n<code>${data.code}</code>`;
      
    if ( ADMIN_ID ) {
      await bot.telegram.sendMessage(ADMIN_ID, adminMessage, { parse_mode: 'HTML' });
    }

  } catch (e) {
    console.error('Помилка обробки Web App даних:', e);
  }
});

bot.launch();
console.log('Бот успішно запущено!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
