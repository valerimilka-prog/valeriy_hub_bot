const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    const userName = ctx.from.first_name || 'друг';
    
    return ctx.reply(
        `Вітаю, ${userName}! 🌿\n\nЦе Простір Глибинного Самопізнання — твоя точка збору для роботи з підсвідомістю, міфологією та внутрішніми станами.\n\nОбери інструмент, з якого хочеш почати:`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('🔮 Рунічний простір', 'runes')],
                [Markup.button.callback('🎭 Визначення архетипів', 'archetypes')],
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

bot.launch();
console.log('Бот «Простір Глибинного Самопізнання» успішно запущено!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));