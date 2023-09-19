import fs from "fs";
import { createCanvas } from "canvas";

export const createImg = (data: number[]) => {
	const canvas = createCanvas(1000, 500);
	const ctx = canvas.getContext("2d");
	const barSpacing = 10;
	const startX = 50;
	const startY = 450;
	const barWidth = (1000 - (data.length - 1) * barSpacing - 2 * startX) / data.length;

	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "blue";

	const sortedData = [...data].sort((a, b) => b - a);
	const maxData = sortedData[0];

	for (let i = 0; i < data.length; i++) {
		const x = startX + i * (barWidth + barSpacing);
		const height = (data[i] / maxData) * (500 - 70);
		const y = startY - height;
		ctx.fillRect(x, y, barWidth, height);
	}

	return canvas.toDataURL();
	// const out = fs.createWriteStream(__dirname + "/output.png");
	// const stream = canvas.createPNGStream();
	// stream.pipe(out);
	// out.on("finish", () => console.log("The PNG file was created."));
};
