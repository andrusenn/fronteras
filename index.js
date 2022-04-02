/*

Fronteras // Borders

Project: 
Andrés Senn - 2022

*/

const hash = Math.random();
const seed = hash * 10000000000;
let particles = [];
let vectors = [];
let numVort = 0;
function setup() {
	const cv = createCanvas(1280, 1280);
	cv.parent("cv");
	cv.id("__");
	cv.class("__");
	pixelDensity(1);
	randomSeed(seed);
	noiseSeed(seed);
	//
	noLoop();
	// Background ---------------------------
	noStroke();
	let bgGradient = drawingContext.createLinearGradient(-200, -200, width, height);
	bgGradient.addColorStop(0, color(50));
	bgGradient.addColorStop(1, color(0));
	drawingContext.fillStyle = bgGradient;
	push();
	translate(width / 2, height / 2);
	rotate((int(random(4)) * PI));
	translate(-width / 2, -height / 2);
	rect(0, 0, width, height);
	pop();
	// background(0);
	numVort = int(random(2, 6));
	for (let i = 0; i < numVort; i++) {
		const v = createVector(
			random(-100, width + 100),
			random(-100, height + 100),
		);
		vectors.push(v);
	}
	push();
	translate(width / 2, height / 2);
	rotate((int(random(8)) * HALF_PI) / 2);
	translate(-width / 2, -height / 2);
	stroke(255);
	let vdist = map(numVort, 2, 6, 1200, 200);
	strokeWeight(2);
	let ii = 0;
	for (let x = 150; x < width - 150; x += width / 500) {
		for (let y = 150; y < height - 150; y += height / 500) {
			let nz = 0.004;
			let str = 255;
			// check distances to vector (attractor)
			let distances = [];
			vectors.forEach((v) => {
				let d = dist(v.x, v.y, x, y);
				distances.push(d);
			});
			let minDist = Math.min.apply(null, distances);
			nz = map(constrain(minDist, 0.0, vdist), 0, vdist, 0.0001, 0.01);
			str = map(constrain(minDist, 0.0, vdist), 0, vdist, 255, 0);
			let n = noise(x * nz, y * nz, x * 0.001);
			let dx = cos(n * TAU) * 100;
			let dy = sin(n * TAU) * 100;
			stroke(str);
			point(x + dx, y + dy);
		}
	}
	colores(random(height / 2, height - 200));

	for (let i = 0; i < numVort; i++) {
		fill(255, 60);
		noStroke();
		circle(vectors[i].x, vectors[i].y, random(20, 100));
	}
	for (let x = 0; x < width; x += random(20, 100)) {
		for (let y = height / 2; y < height; y += random(20, 100)) {
			//Cut
			let ddist = round(
				map(y, height / 2, height, 0, random(100, 200)),
				0,
			);
			let img = get(x, y, 50, 50);
			let ns = noise(x * 0.001, y * 0.001);
			let disp = map(ns, 0, 1, -ddist, ddist);
			// Shadow
			noStroke();
			fill(0, 100);
			rect(x + 5, y + disp + 5, img.width * 1.02, img.width * 1.02);
			image(img, x, y + disp);
			noFill();
			stroke(255, 10);
			line(x, y + disp, x, y + disp + 200);
			//

			ii++;
		}
	}
	pop();
	//
	document.title = ` | Andr\u00e9s Senn | 2022`;
	console.log(
		`%c  | Andr\u00e9s Senn | Projet: `,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
}
function draw() {}

function keyReleased() {
	if (key == "p" || key == "P") {
		pause = !pause;
		if (pause) {
			noLoop();
		} else {
			loop();
		}
	}
	if (key == "s" || key == "S") {
		grabImage();
	}
}
function grabImage() {
	let date =
		year() +
		"" +
		month() +
		"" +
		day() +
		"" +
		hour() +
		"" +
		minute() +
		"" +
		second() +
		"" +
		".png";
	console.log(
		`%c SAVING ${
			String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
		}`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
	saveCanvas("intersticio_" + date);
}
function colores(_y) {
	for (let y = _y; y < 100 + _y; y += 5) {
		push();
		fill(random(255), random(255), random(255));
		rect(0, y, width, 5);
		pop();
	}
}
