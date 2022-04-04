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
	const cv = createCanvas(1280, 1280);
	cv.parent("cv");
	cv.id("__");
	cv.class("__");
	pixelDensity(1);
	randomSeed(seed);
	noiseSeed(seed);

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
	push();
	translate(width / 2, height / 2);
	rotate(int(random(4)) * PI);
	translate(-width / 2, -height / 2);
	rect(0, 0, width, height);
	pop();

	// Blink rotation
	blinkRot = (int(random(8)) * HALF_PI) / 2;

	// Number of vortices
	numVort = int(random(2, 6));
	for (let i = 0; i < numVort; i++) {
		const v = createVector(
			random(-100, width + 100),
			random(-100, height + 100),
		);
		vectors.push(v);
	}
	push();

	// Blink positions and frequency
	for (let i = 0; i < 25; i++) {
		blinkImgPos.push(
			createVector(
				random(300, width - 300),
				random(300, height - 300),
				// Blink frequency
				int(random(20, 150)),
			),
		);
	}

	// Rotate result
	rotateAll();

	// Noise
	stroke(255);
	let vdist = map(numVort, 2, 6, width * 2, 200);
	for (let x = width * 0.2; x < width - width * 0.2; x += width / 400) {
		for (
			let y = height * 0.2;
			y < height - height * 0.2;
			y += height / 400
		) {
			let nz = 0.001;
			let str = 255;
			// check distances to vector (attractor)
			let distances = [];
			vectors.forEach((v) => {
				let d = dist(v.x, v.y, x, y);
				distances.push(d);
			});
			let minDist = Math.min.apply(null, distances);
			nz = map(constrain(minDist, 0.0, vdist), 0, vdist, 0.0001, 0.008);
			str = 255; //map(constrain(minDist, 0.0, vdist), 0, vdist, 255, 0);
			let n = noise(x * nz, y * nz, x * 0.001);
			let dx = cos(n * TAU) * 100;
			let dy = sin(n * TAU) * 100;
			strokeWeight(2);
			if (int(y) % int(random(80, 150)) == 0) {
				strokeWeight(3);
			}
			stroke(str);
			point(x + dx, y + dy);
		}
	}

	// Rotate result
	rotateAll();

	// Color stripes
	colores(random(height / 2, height - 200), random(5, 20), random(20, 150));

	// Rotate result
	rotateAll();

	// Draw Vortices positions
	for (let i = 0; i < numVort; i++) {
		fill(255, 60);
		noStroke();
		circle(vectors[i].x, vectors[i].y, random(20, 100));
	}

	// Cut
	cutCanvas();

	// Get blink images
	for (let i = 0; i < blinkImgPos.length; i++) {
		let img = get(
			random(width),
			random(height),
			random(5, 20),
			random(5, 20),
		);
		blinkImg.push(img);
	}
	// Cut scaled
	push();
	translate(width / 2, height / 2);
	scale(0.5);
	translate(-width / 2, -height / 2);
	rotateAll();
	cutCanvas();
	pop();
	push();
	translate(width / 2, height / 2);
	scale(0.25);
	translate(-width / 2, 0);
	rotateAll();
	cutCanvas();
	pop();

	// Slice
	push();
	// Inner shadow
	let ixp = width / 2 - (width * 0.2) / 2;
	let iyp = 0;
	let iw = width * 0.2;
	let ih = height;
	let imgposy = random(-800, 800);
	fill(0);
	let ishadow = drawingContext.createLinearGradient(ixp, iyp, ixp + iw, iyp);
	ishadow.addColorStop(0, color(0, 200));
	ishadow.addColorStop(0.1, color(0, 0));
	ishadow.addColorStop(0.9, color(0, 0));
	ishadow.addColorStop(1, color(0, 200));
	drawingContext.fillStyle = ishadow;
	let imgb = get(ixp, iyp, iw, ih);
	translate(width / 2, height / 2);
	scale(0.6);
	translate(-width / 2, -height / 2);
	image(imgb, ixp, iyp + imgposy);
	rect(ixp, iyp - height, iw, ih + height * 2);
	pop();

	// Get result
	printImg = get();

	// Console
	document.title = `Fronteras en abstracto | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cFronteras en abstracto | Andr\u00e9s Senn | Projet: `,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
}
function draw() {
	// Show result
	image(printImg, 0, 0);

	// Blink images
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
	for (let x = 200; x < width - 200; x += random(20, 100)) {
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
			let img = get(x, y, 30, random(10, 60));
			let ns = noise(x * 0.001, y * 0.001);
			let disp = map(ns, 0, 1, -ddist, ddist);
			// Shadow
			noStroke();
			fill(0, 100);
			rect(x + 5, y + disp + 5, img.width * 1.02, img.width * 1.02);
			image(img, x, y + disp);

			// noFill();
			// stroke(0, 200);
			// rect(x + 5, y + disp + 5, img.width * 1.02, img.width * 1.02);
			stroke(255, 10);
			line(x, y + disp, x, y + disp + 200);
		}
	}
}
function rotateAll() {
	translate(width / 2, height / 2);
	rotate((int(random(8)) * HALF_PI) / 2);
	translate(-width / 2, -height / 2);
}
function keyReleased() {
	switch (key) {
		case "1":
			pixelDensity(1);
			break;
		case "2":
			pixelDensity(2);
			break;
		case "4":
			pixelDensity(3);
			break;
		case "8":
			pixelDensity(4);
			break;
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
	saveCanvas("fea_" + date);
}
function colores(_y, _h = 20, _sh = 200) {
	fill(0);
	noStroke();
	// Sahdow
	let shadow = drawingContext.createLinearGradient(
		-width,
		_y - 50,
		-width,
		_y + _sh + 50,
	);
	shadow.addColorStop(0, color(0, 0));
	shadow.addColorStop(0.5, color(0));
	shadow.addColorStop(1, color(0, 0));
	drawingContext.fillStyle = shadow;
	rect(-width, _y - 50, width * 3, _sh + 100);

	// Stripes
	for (let y = _y; y < _sh + _y; y += _h) {
		push();
		fill(0);
		let rectFill = drawingContext.createLinearGradient(0, y, width, y);
		rectFill.addColorStop(0, color(0, 0));
		rectFill.addColorStop(
			0.2,
			color(random(255), random(255), random(255)),
		);
		rectFill.addColorStop(
			0.8,
			color(random(255), random(255), random(255)),
		);
		rectFill.addColorStop(1, color(0, 0));
		drawingContext.fillStyle = rectFill;

		rect(-width, y, width * 3, _h);
		pop();
	}
}
