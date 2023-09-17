import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import prisma from "../../../../shared/db/prisma";

export const getThemeScene = () => {
	const question = new Scenes.BaseScene("theme");
	question.enter((ctx) =>
		ctx.reply(
			"Какие вы хотите добавить темы? Напишите до 5 тем через запятую \nНапример, 'досуг, учеба, работа'"
		)
	);
	question.on(message("text"), async (ctx) => {
		const user = await prisma.user.findUnique({ where: { user_id: ctx.from.id } });
		if (!user) {
			ctx.reply(
				"Возникла какая-то ошибка. Простите, я не могу сохранить заметку, попробуйте позже"
			);

			//@ts-ignore
			return ctx.scene.leave();
		}

		user.themes = ctx.message.text.split(",").map((theme) => theme.trim());
		await prisma.user.update({ where: { user_id: user.user_id }, data: user });
		await ctx.reply("Отлично все сохранил");
		//@ts-ignore
		return ctx.scene.leave();
	});

	return question;
};
