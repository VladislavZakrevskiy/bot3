import { getBot } from "../../../../shared/lib/bot/createBot";
import prisma from "../../../../shared/db/prisma";

export const configureStartCommand = () => {
	const bot = getBot();

	bot.command("start", async (ctx) => {
		const username = ctx.from.first_name + (ctx.from.last_name || "");
		const candidate = await prisma.user.findUnique({
			where: { user_id: ctx.from.id },
		});
		await ctx.reply(`Здравствуйте, ${username}`);

		if (!candidate) {
			await prisma.user.create({
				data: {
					username,
					user_id: ctx.from.id,
				},
			});

			await ctx.reply(
				`Впервые вас вижу, давайте познакомимся, я ваш персональный дневник настроений в телеграмме! Можете звать меня как вам удобно, но мне нравится, когда меня зовут пить! Я буду вам помогать следить за вашим эмоциональным состоянием из месяца в месяца! Я еще в бете, так что ждиет новые функции, если хотите узнать планы моего создателя на меня можете нажать команду /roadmap. Для того, чтобы поставить оценку этому дню (их может быть несколько), нажмите команду /set_mood`
			);
		}
	});
};
