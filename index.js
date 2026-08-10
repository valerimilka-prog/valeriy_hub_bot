const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// Створюємо простий вебсервер, щоб Render бачив відкритий порт і не вимикав сервіс
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});

// Підключаємо бота через змінну середовища з Render або токен
const bot = new Telegraf(process.env.BOT_TOKEN);

// Словник твоїх 15 архетипів (описи, які ти надав)
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
  HERMES: { name: "Гермес", slavic: "Велес-Слово — Господар Меж", norse: "Локі", core: "Архетип посередника між світами. Швидкий, дотепний, знаходить мову з будь-кем." },
  ARS: { name: "Арес", slavic: "Ярило / Перун-Воїн", norse: "Тюр", core: "Архетип воїна в польових умовах — тіло, інстинкт, пристрасть, справжність емоцій." },
  HEF: { name: "Гефест", slavic: "Сварог / Сварожич — Майстер", norse: "Немає точного", core: "Архетип майстра який перетворює власний біль на мистецтво, відданий своїй справі." },
  DIO: { name: "Діоніс", slavic: "Купайло / Містичний Ярило", norse: "Немає точного", core: "Живе через відчуття і злиття з іншими, шукає досвіди екстазу та відродження." }
};

bot.start((ctx) => {
    const userName = ctx.from.first_name || 'друг';
    
    return ctx.reply(
        `Вітаю, ${userName}! 🌿\n\nЦе Простір Глибинного Самопізнання — твоя точка збору для роботи з підсвідомістю, міфологією та внутрішніми станами.\n\nОбери інструмент, з якого хочеш почати:`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🔮 Рунічний простір', 'runes')],
                [Markup.button.url('🎭 Визначення архетипів', 'archetypes-app-1.vercel.app')],
                [Markup.button.url('🧠 Кишеньковий психолог (Тінь)', 'https://t.me/wesync_ua_bot')],
                [Markup.button.url('🌙 Сонник (Тлумачення снів)', 'https://dreams-app-gold.vercel.app/')],
                [Markup.button.url('💬 Зв’язатися з автором', 'https://t.me/runes_valeriy')]
            ])
        }
    );
});

const voices_actions = {
    runes: '🔮 Рунічний простір\nТут ти зможеш зануритись у вивчення енергій та рун. Скоро тут з\'явиться інтерактив!',
    archetypes: '🎭 Визначення архетипів\nДослідження твоєї структури особистості через психологію та міфологію.'
};

for (const [key, text] of Object.entries(voices_actions)) {
    bot.action(key, async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.reply(text);
    });
}

// Прийом даних від анкети (Freemium-видача)
bot.on('web_app_data', async (ctx) => {
  try {
    const rawData = ctx.webAppData.data();
    const data = JSON.parse(rawData);
    
    const archKey = data.archKey || 'ART';
    const archInfo = archetypesData[archKey] || { name: "Архетип", slavic: "-", norse: "-", core: "Опис..." };

    const userMessage = `🎭 **Твій провідний архетип: ${archInfo.name}**\n` +
                        `🏛 *Відповідники:* ${archInfo.slavic} | ${archInfo.norse}\n\n` +
                        `📖 **Суть:**\n${archInfo.core}\n\n` +
                        `✨ *Це базовий результат.* Хочеш отримати повний PDF-розбір із тіньовими сторонами?\n\n` +
                        `👇 Звернися до автора!`;

    await ctx.reply(userMessage, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.url('📩 Замовити повний розбір у автора', 'https://t.me/runes_valeriy')]
      ])
    });
  } catch (e) {
    console.error('Помилка обробки Web App даних:', e);
  }
});

bot.launch();
console.log('Бот «Простір Глибинного Самопізнання» успішно запущено!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
