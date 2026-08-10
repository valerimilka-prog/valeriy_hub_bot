const { Telegraf, Markup } = require('telegraf');
const http = require('http');

const BOT_TOKEN = process.env.BOT_TOKEN || 'ТВОЇ_ТОКЕН_ВІД_BOTFATHER';
const ADMIN_CHAT_ID = 'УСТАВ_СВІЙ_АДМІН_CHAT_ID_ЯКЩО_ТРЕБА'; // сюди летять повні звіти для тебе

const bot = new Telegraf(BOT_TOKEN);

// Словник усіх 15 архетипів (дані, які ти надіслав)
const archetypesData = {
  ART: { name: "Артеміда", slavic: "Молода Войовниця / Морана", norse: "Скаді", core: "Архетип незалежної жінки яка знає чого хоче і рухається прямо до мети без оглядки на чужу думку." },
  ATH: { name: "Афіна", slavic: "Мудра Волхвиня / Жриця-Захисниця", norse: "Норни (асоціація)", core: "Архетип жінки-стратега яка мислить логічно і ефективно в середовищі де цінують компетентність." },
  HES: { name: "Гестія", slavic: "Берегиня / Жриця Священного Вогню", norse: "Немає точного", core: "Архетип жінки яка живе зсередини назовні, її внутрішній центр є джерелом спокою." },
  HER: { name: "Гера", slavic: "Лада-Цариця / Богиня Шлюбного Союзу", norse: "Фрігг", core: "Архетип жінки для якої союз є центральним сенсом існування, несе себе з гідністю." },
  DEM: { name: "Деметра", slavic: "Мати Сира Земля / Мокоша", norse: "Нертус", core: "Архетип матері яка дає безумовно — дітям, учням, підопічним. Все навколо неї росте." },
  PER: { name: "Персефона", slavic: "Дівиця між Яв і Нав / Провідниця", norse: "Хель", core: "Архетип жінки яка трансформується через страждання, провідник між видимим і прихованим." },
  APH: { name: "Афродіта", slavic: "Лада — Жива Творча Сила", norse: "Фрейя", core: "Алхімічна Богиня кохання і краси. Всі з ким вона взаємодіє — трансформуються." },
  
  ZEV: { name: "Зевс", slavic: "Перун — Верховний Бог", norse: "Тор / Одін", core: "Архетип природженого лідера який мислить стратегічно і потребує контролю над ситуацією." },
  POS: { name: "Посейдон", slavic: "Дух Вод / Темний Велес", norse: "Ньйорд", core: "Архетип чоловіка з потужним емоційним ядром. Коли спокійний — дає простір, коли бушує — руйнує." },
  AID: { name: "Аїд", slavic: "Велес-Нав — Мудрець Темряви", norse: "Хель", core: "Архетип інтроверта що живе у своєму внутрішньому світі, розуміє темряву і несвідоме." },
  APL: { name: "Аполлон", slavic: "Дажбог / Хорс — Сонячний Розум", norse: "Бальдр", core: "Архетип раціонального перфекціоніста. Все має бути правильним, красивим і досконалим." },
  HER: { name: "Гермес", slavic: "Велес-Слово — Господар Меж", norse: "Локі", core: "Архетип посередника між світами. Швидкий, дотепний, знаходить мову з будь-кем." },
  ARS: { name: "Арес", slavic: "Ярило / Перун-Воїн", norse: "Тюр", core: "Архетип воїна в польових умовах — тіло, інстинкт, пристрасть, справжність емоцій." },
  HEF: { name: "Гефест", slavic: "Сварог / Сварожич — Майстер", norse: "Немає точного", core: "Архетип майстра який перетворює власний біль на мистецтво, відданий своїй справі." },
  DIO: { name: "Діоніс", slavic: "Купайло / Містичний Ярило", norse: "Немає точного", core: "Живе через відчуття і злиття з іншими, шукає досвіди екстазу та відродження." }
};

// Головне меню бота
bot.start((ctx) => {
  const userName = ctx.from.first_name || 'друг';
  const welcomeText = `Вітаю, ${userName}!\n\n🌿 Це **Простір Глибинного Самопізнання**. Твоя точка збору для роботи з підсвідомістю, міфологією та внутрішніми станами.\n\nОбери інструмент, з якого хочеш почати:`;

  return ctx.reply(welcomeText, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('🎭 Визначення архетипів', 'https://dream-archetypes-up-1.vercel.app/')],
      [Markup.button.url('🌙 Сонник', 'https://dreams-app-gold.vercel.app/')],
      [Markup.button.url('🧠 Кишеньковий психолог', 'https://t.me/wesync_ua_bot')],
      [Markup.button.url('💬 Зв’язатися з автором', 'https://t.me/runes_valeriy')]
    ])
  });
});

// ПЕРЕХОПЛЕННЯ ДАНИХ З АНКЕТИ (ФУНКЦІЯ FREEMIUM)
bot.on('web_app_data', async (ctx) => {
  try {
    const rawData = ctx.webAppData.data();
    const data = JSON.parse(rawData);
    
    // data містить: clientName, gender, code (шифр), archKey (наприклад, "ART")
    const archKey = data.archKey || 'ART';
    const archInfo = archetypesData[archKey] || { name: "Невідомий архетип", slavic: "-", norse: "-", core: "Опис формується..." };

    // 1. Відправляємо клієнту безкоштовний Freemium-результат у чат
    const userMessage = `🎭 **Твій провідний архетип: ${archInfo.name}**\n` +
                        `🏛 *Відповідники:* ${archInfo.slavic} | ${archInfo.norse}\n\n` +
                        `📖 **Суть:**\n${archInfo.core}\n\n` +
                        `✨ *Це лише базовий результат.* Хочеш дізнатися про свої тіньові сторони, глибокі ресурси та отримати повноцінний індивідуальний розбір?\n\n` +
                        `👇 Тисни нижче, щоб звернутися до автора за повною версією!`;

    await ctx.reply(userMessage, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('📩 Замовити повний розбір у автора', 'https://t.me/runes_valeriy')]
      ])
    });

    // 2. Тихо пересилаємо тобі (або в адмін-чат) зашифрований код для генерації PDF
    const adminText = `📥 **Новий результат тесту!**\n` +
                      `👤 Ім'я: ${data.clientName || 'Не вказано'}\n` +
                      `🚻 Стать: ${data.gender || '-'}\n` +
                      `🔑 Архетип-ключ: ${archKey}\n\n` +
                      `🔐 **Шифр для калькулятора:**\n<code>${data.code}</code>`;

    // Якщо ти вкажеш свій чат-ід адміністратора, шифр летітиме тобі в особисті
    if (ADMIN_CHAT_ID && ADMIN_CHAT_ID !== 'УСТАВ_СВІЙ_АДМІН_CHAT_ID_ЯКЩО_ТРЕБА') {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID, adminText, { parse_mode: 'HTML' });
    }

  } catch (e) {
    console.error('Помилка обробки Web App даних:', e);
    await ctx.reply('Сталася помилка при обробці твоїх результатів. Будь ласка, звернися до автора: @runes_valeriy');
  }
});

// Міні-вебсервер для Render, щоб бот працював 24/7 без засинання
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web server is listening on port ${PORT}`);
});

bot.launch().then(() => {
  console.log('Бот «Простір Глибинного Самопізнання» успішно запущено!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
