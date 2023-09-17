import { Markup } from "telegraf";

export enum MapperKeys {
	ONE = "ONE",
	TWO = "TWO",
	THREE = "THREE",
	FOUR = "FOUR",
	FIVE = "FIVE",
}

export const createMap = (values: string[], actionType: string) => {
	const keyboardButtons: Record<string, string> = {};
	const mapperKeys = Object.values(MapperKeys);
	values.forEach((value, i) => {
		keyboardButtons[mapperKeys[i] + "-" + actionType] = value;
	});

	return keyboardButtons;
};

export const createKeyboards = (options: string[], actionType: string) => {
	const keyboardOptions = createMap(options, actionType);
	const keyboards: ReturnType<typeof Markup.button.callback>[] = [];
	Object.entries(keyboardOptions).forEach(([key, value]) => {
		keyboards.push(Markup.button.callback(value, key));
	});
	return keyboards;
};
