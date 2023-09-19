import { getBot } from "../../../../shared/lib/bot/createBot";
import prisma from "../../../../shared/db/prisma";

export const configureRoadmapCommand = () => {
	const bot = getBot();

	bot.command("roadmap", async (ctx) => {
		await ctx.reply(
			`
Планы:
• <b>Сделать нормальное графическое отображение дней и настроения за день, в качестве графика на картинка, которая скидыватся</b>
• <b>Добавить валидацию на дату в поиске дня</b>
• <b>Увеличить количество тем до неораниченного</b>
• <b>Добавить сортировка и фильтрацию</b>
• <b>Добавить взаимодейтсвие с темами</b>
`,
			{ parse_mode: "HTML" }
		);
	});
};
