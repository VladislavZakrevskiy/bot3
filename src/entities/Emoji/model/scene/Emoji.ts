import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import prisma from "../../../../shared/db/prisma";

export const getEmojiScene = () => {
	try {
		const question = new Scenes.BaseScene("emoji");
		question.enter((ctx) =>
			ctx.reply(
				"На какой набор стикеров вы хотите заменить обычный. Напишите подряд в порядке возрастания настроения \nНапример, 😭😔😐😀😁"
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

			const emojis = Buffer.from(ctx.message.text, "utf8").toJSON().data;
			const result = [];
			for (let i = 0; i < emojis.length; i += 4) {
				result.push(Buffer.from([emojis[i], emojis[i + 1], emojis[i + 2], emojis[3 + i]]));
			}
			ctx.reply(result.map((value) => value.toString("utf-8")).join(""));

			user.emoji_pack = result;

			await prisma.user.update({ where: { user_id: user.user_id }, data: user });
			await ctx.reply("Отлично все сохранил");
			//@ts-ignore
			return ctx.scene.leave();
		});

		return question;
	} catch (e) {
		console.log(e);
	}
};
