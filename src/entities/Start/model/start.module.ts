import { configureRoadmapCommand } from "./command/roadmap";
import { configureStartCommand } from "./command/start";

export const startModule = () => {
	configureStartCommand();
	configureRoadmapCommand();
};
