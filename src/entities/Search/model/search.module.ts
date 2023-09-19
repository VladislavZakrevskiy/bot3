import { configureSearchDayCommand } from "./command/searchDay";
import { configureSearchMonthCommand } from "./command/searchMonth";

export const searchModule = () => {
	configureSearchDayCommand();
	configureSearchMonthCommand();
};
