/*

Fronteras en abstracto // Borders in abstract

Project: 
Andrés Senn - 2022

*/

const hash = Math.random();
const seed = hash * 10000000000;
let particles = [];
let vectors = [];
let numVort = 0;
let blinkImg = [];
let blinkImgPos = [];
let blinkRot;
let printImg;
function setup() {
	const cv = createCanvas(1600, 1600);
	cv.parent("cv");
	cv.id("__");
	cv.class("__");
	pixelDensity(1);
	randomSeed(seed);
	noiseSeed(seed);
	//
	// noLoop();
	// Background ---------------------------
	noStroke();
	let bgGradient = drawingContext.createLinearGradient(
		-200,
		-200,
		width,
		height,
	);
	bgGradient.addColorStop(0, color(50));
	bgGradient.addColorStop(1, color(0));
	drawingContext.fillStyle = bgGradient;
	blinkRot = (int(random(8)) * HALF_PI) / 2;
	push();
	translate(width / 2, height / 2);
	rotate(int(random(4)) * PI);
	translate(-width / 2, -height / 2);
	rect(0, 0, width, height);
	pop();
	// cutCanvas();
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
	for (let i = 0; i < 25; i++) {
		blinkImgPos.push(
			createVector(
				random(300, width - 300),
				random(300, height - 300),
				int(random(20, 150)),
			),
		);
	}
	// Rotate
	rotateAll();

	// Noise
	stroke(255);
	let vdist = map(numVort, 2, 6, 1200, 200);
	for (let x = 150; x < width - 150; x += width / 600) {
		for (let y = 150; y < height - 150; y += height / 600) {
			let nz = 0.004;
			let str = 255;
			// check distances to vector (attractor)
			let distances = [];
			vectors.forEach((v) => {
				let d = dist(v.x, v.y, x, y);
				distances.push(d);
			});
			let minDist = Math.min.apply(null, distances);
			nz = map(constrain(minDist, 0.0, vdist), 0, vdist, 0.00001, 0.01);
			str = map(constrain(minDist, 0.0, vdist), 0, vdist, 255, 0);
			let n = noise(x * nz, y * nz, x * 0.001);
			let dx = cos(n * TAU) * 100;
			let dy = sin(n * TAU) * 100;
			strokeWeight(2);
			if (int(y) % int(random(80, 150)) == 0) {
				strokeWeight(6);
			}
			stroke(str);
			point(x + dx, y + dy);
		}
	}

	// Rotate
	rotateAll();

	// Colors
	colores(random(height / 2, height - 200));

	// Rotate
	rotateAll();

	for (let i = 0; i < numVort; i++) {
		fill(255, 60);
		noStroke();
		circle(vectors[i].x, vectors[i].y, random(20, 100));
	}
	cutCanvas();
	// Noise
	push();
	translate(width / 2, height / 2);
	scale(0.5);
	translate(-width / 2, -height / 2);
	stroke(255);
	vdist = map(numVort, 2, 6, 1200, 200);
	for (let x = 150; x < width - 150; x += width / 300) {
		for (let y = 150; y < height - 150; y += height / 300) {
			let nz = 0.004;
			let str = 255;
			// check distances to vector (attractor)
			let distances = [];
			vectors.forEach((v) => {
				let d = dist(v.x, v.y, x, y);
				distances.push(d);
			});
			let minDist = Math.min.apply(null, distances);
			nz = map(constrain(minDist, 0.0, vdist), 0, vdist, 0.00001, 0.01);
			str = map(constrain(minDist, 0.0, vdist), 0, vdist, 255, 0);
			let n = noise(x * nz, y * nz, x * 0.001);
			let dx = cos(n * TAU) * 100;
			let dy = sin(n * TAU) * 100;
			strokeWeight(2);
			if (int(y) % int(random(80, 150)) == 0) {
				strokeWeight(6);
			}
			stroke(str);
			point(x + dx, y + dy);
		}
	}
	// Rotate
	rotateAll();
	cutCanvas();
	pop();
	printImg = get();
	//
	document.title = `Fronteras en abstracto | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cFronteras en abstracto  | Andr\u00e9s Senn | Projet: `,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
}
function draw() {
	image(printImg, 0, 0);
	push();
	translate(width / 2, height / 2);
	rotate(blinkRot);
	translate(-width / 2, -height / 2);

	for (let i = 0; i < blinkImg.length; i++) {
		if (frameCount % blinkImgPos[i].z < blinkImgPos[i].z / 2) {
			image(blinkImg[i], blinkImgPos[i].x, blinkImgPos[i].y);
		}
	}
	pop();
}
function cutCanvas() {
	let ci = 0;
	for (let x = 0; x < width; x += random(20, 100)) {
		for (
			let y = height / 2 + random(-200, 200);
			y < height;
			y += random(20, 100)
		) {
			//Cut
			let ddist = round(
				map(y, height / 2, height, 0, random(100, 200)),
				0,
			);
			let img = get(x, y, 40, random(10, 60));
			let ns = noise(x * 0.001, y * 0.001);
			let disp = map(ns, 0, 1, -ddist, ddist);
			// Shadow
			noStroke();
			fill(0, 100);
			rect(x + 5, y + disp + 5, img.width * 1.02, img.width * 1.02);
			image(img, x, y + disp);

			// Get blink images
			if (ci % 5 == 0 && ci > 200 && ci < 300) {
				if (blinkImg.length < blinkImgPos.length) {
					blinkImg.push(img);
				}
			}
			//

			noFill();
			stroke(0, 200);
			rect(x + 5, y + disp + 5, img.width * 1.02, img.width * 1.02);
			stroke(255, 10);
			line(x, y + disp, x, y + disp + 200);
			//
			ci++;
		}
	}
}
function rotateAll() {
	translate(width / 2, height / 2);
	rotate((int(random(8)) * HALF_PI) / 2);
	translate(-width / 2, -height / 2);
}
function keyReleased() {
	// if (key == "p" || key == "P") {
	// 	pause = !pause;
	// 	if (pause) {
	// 		noLoop();
	// 	} else {
	// 		loop();
	// 	}
	// }
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
	saveCanvas("fea_" + date);
}
function colores(_y) {
	fill(0);
	noStroke();
	let shadow = drawingContext.createLinearGradient(
		-width,
		_y - 50,
		-width,
		_y + 120 + 50,
	);
	shadow.addColorStop(0, color(0, 0));
	shadow.addColorStop(0.4, color(0));
	shadow.addColorStop(0.6, color(0));
	shadow.addColorStop(1, color(0, 0));
	drawingContext.fillStyle = shadow;
	//
	rect(-width, _y - 50, width * 3, 120 + 100);
	//
	for (let y = _y; y < 120 + _y; y += 8) {
		push();
		fill(random(255), random(255), random(255));
		rect(-width, y, width * 3, 8);
		pop();
	}
}
