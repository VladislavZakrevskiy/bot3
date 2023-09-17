import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import prisma from "../../../../shared/db/prisma";
import { encode_utf8 } from "../../../../shared/lib/logic/utf8/enDecode";

export const getEmojiScene = () => {
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

		user.emoji_pack = ctx.message.text.split("").map((emoji) => encode_utf8(emoji));
		await prisma.user.update({ where: { user_id: user.user_id }, data: user });
		await ctx.reply("Отлично все сохранил");
		//@ts-ignore
		return ctx.scene.leave();
	});

	return question;
};
