import { WizardScene } from "telegraf/typings/scenes";
import prisma from "../../../../shared/db/prisma";
import { getActionString } from "../../../../shared/helpers/getActionString";
import { getBot } from "../../../../shared/lib/bot/createBot";
import { MapperKeys, createKeyboards } from "../../../../shared/lib/telegrafHelpers/createKeyboard";
import { Context, Markup, Scenes } from "telegraf";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";
import { setTheme } from "../scene/Scene";

export const sendMood =
	(moodNumber: MapperKeys) => async (ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>>) => {
		const message = await ctx.reply("Загрузка... 🕐🕐🕐");

		// const currentDay = new Date().getUTCDate();
		let candidateDate = await prisma.day.findFirst({
			where: { date: new Date().toLocaleDateString() },
		});

		if (!candidateDate) {
			candidateDate = await prisma.day.create({
				data: {
					date: new Date().toLocaleDateString(),
					User: { connect: { user_id: ctx.from?.id } },
				},
			});
		}

		await prisma.note.create({
			data: {
				mood: moodNumber,
				time: new Date().toLocaleTimeString(),
				themes: [],
				Day: { connect: { day_id: candidateDate.day_id } },
			},
		});

		ctx.telegram.editMessageText(
			ctx.chat?.id,
			message.message_id,
			undefined,
			"Ваши данные сохранены ✅"
		);

		ctx.editMessageText("Как прошел ваш день? Выберите опцию", {
			reply_markup: {
				inline_keyboard: [
					[
						{ text: "Заметки", callback_data: "notes" },
						{ text: "Темы", callback_data: "theme" },
					],
				],
			},
		});
	};

export const moodActions = () => {
	const bot = getBot();

	bot.action(getActionString(MapperKeys.ONE, "emoji"), sendMood(MapperKeys.ONE));
	bot.action(getActionString(MapperKeys.TWO, "emoji"), sendMood(MapperKeys.TWO));
	bot.action(getActionString(MapperKeys.THREE, "emoji"), sendMood(MapperKeys.THREE));
	bot.action(getActionString(MapperKeys.FOUR, "emoji"), sendMood(MapperKeys.FOUR));
	bot.action(getActionString(MapperKeys.FIVE, "emoji"), sendMood(MapperKeys.FIVE));
	//@ts-ignore
	bot.action("notes", (ctx) => ctx.scene.enter("notes"));
	bot.action("theme", setTheme);
};
