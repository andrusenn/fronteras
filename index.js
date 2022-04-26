/*

Fronteras en abstracto // Borders in abstract

Andrés Senn - April / 2022 - fxhash.xyz/u/andrusenn

*/
let overlay;
let loaded = false;
const rand = fxrand();
const seed = rand * 10000000000;
let particles = [];
let vectors = [];
let numVort = 0;
let blinkImg = [];
let blinkImgPos = [];
let blinkRot;
let printImg;
let rotAni, rotAniFeature, disAni;
let imgposyvel;
let cv;
let conectedColors = 0;
function setup() {
	overlay = document.querySelector(".overlay");
	cv = createCanvas(1080, 1440);
	cv.parent("cv");
	cv.id("fea");
	cv.class("fea");

	pixelDensity(2);
	randomSeed(seed);
	noiseSeed(seed);
	noLoop();

	// Background ---------------------------
	background(0, 0, 0, 0);
	noStroke();
	let bgGradient = drawingContext.createLinearGradient(
		0,
		random(height),
		width,
		random(height),
	);
	let dawn = random(0, 255);
	let oposite = random(0, 20);

	console.log(dawn);
	// Rare?
	if (dawn > 240) {
		oposite = random(200, 255);
	}
	bgGradient.addColorStop(0, color(oposite));
	bgGradient.addColorStop(1, color(dawn));
	drawingContext.fillStyle = bgGradient;
	push();
	translate(width / 2, height / 2);
	rotate(int(random(4)) * PI);
	translate(-width / 2, -height / 2);
	rect(0, 0, width, height, 10);
	pop();

	noCursor();

	// Init rot Ani
	disAni = floor(random(800 / 200) + 1) * 200 - 400;
	let idxRotAni = int(random(16));
	rotAni = (idxRotAni * HALF_PI) / 2;
	rotAniFeature = ["S", "SW", "W", "NW", "N", "NE", "E", "SE"];

	// Blink rotation
	blinkRot = (int(random(8)) * HALF_PI) / 2;

	// Ani vel
	imgposyvel = -random(0.001, 0.004);

	// Number of vortices
	numVort = int(random(2, 6));
	for (let i = 0; i < numVort; i++) {
		const v = createVector(
			random(-100, width + 100),
			random(-100, height + 100),
		);
		vectors.push(v);
	}

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
	bgNoise(vectors);

	// Rotate result
	rotateAll();

	// Color stripes
	conectedColors = colorStripes(
		random(height / 2, height - 200),
		random(5, 10),
		random(50, 200),
	);

	// Rotate result
	rotateAll();

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

	// Rotate
	push();
	rotateAll();
	pop();

	// Slice -----------------------------------
	// 1
	slice();
	if (random(1) > 0.5) {
		// 2
		slice();
	}

	// Get result ------------------------------
	printImg = get();

	// Features --------------------------------
	window.$fxhashFeatures = {
		Abstraction: int(rand * 100) + "%",
		"Border direction": rotAniFeature[idxRotAni % 8],
		"Border stability": int(map(imgposyvel, -0.001, -0.004, 1, 100)) + "%",
		Dawn: int(map(dawn, 0, 255, 0, 100)) + "%",
		"Connected border points": conectedColors,
	};

	// Console
	document.title = `Fronteras en abstracto | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cFronteras en abstracto | Andr\u00e9s Senn | Projet: https://github.com/andrusenn/fronteras`,
		"background:#333;border-radius:10px;background-size:15%;color:#eee;padding:10px;font-size:15px;text-align:center;",
	);
}
function draw() {
	// Show result -------------------------
	image(printImg, 0, 0);

	// Blink images ------------------------
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

	// Ani Slice ---------------------------
	push();

	translate(width / 2, height / 2);
	rotate(rotAni);
	translate(-width / 2, -height / 2);
	translate(disAni, 0);
	noStroke();
	let ixp = width / 2 - (width * 0.2) / 2;
	let iyp = 0;
	let iw = width * 0.2;
	let ih = height;
	let imgposy = sin(frameCount * imgposyvel) * 50;
	fill(0);
	let imgb = get(ixp, iyp, iw, ih);
	// shadow
	let oshadow = drawingContext.createLinearGradient(
		ixp,
		iyp - 20 + imgposy,
		ixp,
		iyp + imgb.height + 40 + imgposy,
	);
	oshadow.addColorStop(0, color(0, 0));
	oshadow.addColorStop(0.01, color(0, 100));
	oshadow.addColorStop(0.5, color(0));
	oshadow.addColorStop(0.99, color(0, 100));
	oshadow.addColorStop(1, color(0, 0));
	drawingContext.fillStyle = oshadow;
	rect(ixp, iyp - 20 + imgposy, imgb.width, imgb.height + 40);
	// ------
	image(imgb, ixp, iyp + imgposy);

	// Inner shadow -------------------
	let ishadow = drawingContext.createLinearGradient(ixp, iyp, ixp + iw, iyp);
	ishadow.addColorStop(0, color(0, 100));
	ishadow.addColorStop(0.05, color(0, 20));
	ishadow.addColorStop(0.1, color(0, 0));
	ishadow.addColorStop(0.9, color(0, 0));
	ishadow.addColorStop(0.95, color(0, 20));
	ishadow.addColorStop(1, color(0, 100));
	drawingContext.fillStyle = ishadow;
	rect(ixp, iyp - height, iw, ih + height * 2);
	// -------------- ------------------
	pop();

	// Preview -------------------------
	if (!loaded) {
		overlay.style.display = "none";
		loaded = true;
		setTimeout(function () {
			fxpreview();
			loop();
		}, 1000);
	}
}
function slice() {
	const rotIdx = int(random(8));
	const rot = (rotIdx * HALF_PI) / 2;
	push();
	// Inner shadow
	let ixp = width / 2 - (width * 0.1) / 2;
	let iyp = 0;
	let iw = width * 0.1;
	let ih = height;
	let imgposy = random(-800, 800);
	fill(0);
	let ishadow = drawingContext.createLinearGradient(ixp, iyp, ixp + iw, iyp);
	ishadow.addColorStop(0, color(0, 100));
	ishadow.addColorStop(0.05, color(0, 20));
	ishadow.addColorStop(0.1, color(0, 0));
	ishadow.addColorStop(0.9, color(0, 0));
	ishadow.addColorStop(0.95, color(0, 20));
	ishadow.addColorStop(1, color(0, 100));
	drawingContext.fillStyle = ishadow;
	let imgb = get(ixp, iyp, iw, ih);
	translate(width / 2, height / 2);
	rotate(rot);
	translate(-width / 2, -height / 2);
	image(imgb, ixp, iyp + imgposy);
	rect(ixp, iyp - height, iw, ih + height * 2);
	pop();
}
function bgNoise(vects) {
	// Noise
	stroke(255);
	const vdist = map(vects.length, 2, 6, width * 2, 200);
	const cels = int(random(200, 500));
	for (let x = width * 0.2; x < width - width * 0.2; x += width / cels) {
		for (
			let y = height * 0.2;
			y < height - height * 0.2;
			y += height / cels
		) {
			let nz = 0.001;
			// check distances to vector (attractor)
			let distances = [];
			vects.forEach((v) => {
				let d = dist(v.x, v.y, x, y);
				distances.push(d);
			});
			const minDist = Math.min.apply(null, distances);
			nz = map(constrain(minDist, 0.0, vdist), 0, vdist, 0.0003, 0.008);
			const n = noise(x * nz, y * nz, x * 0.001);
			const dx = cos(n * TAU) * 100;
			const dy = sin(n * TAU) * 100;
			strokeWeight(1.5);
			if (int(y) % int(random(80, 150)) == 0) {
				strokeWeight(3);
			}
			let str = 255;
			if (brightness(get(x + dx, y + dy)) > 50) {
				str = 0;
			}
			stroke(str);
			point(x + dx, y + dy);
		}
	}

	// Draw Vortices positions
	for (let i = 0; i < vects.length; i++) {
		fill(255, 60);
		noStroke();
		circle(vects[i].x, vects[i].y, random(20, 100));
	}
}
function cutCanvas() {
	for (let x = 200; x < width - 200; x += random(15, 40)) {
		for (
			let y = height / 2 + random(-200, 200);
			y < height;
			y += random(15, 40)
		) {
			//Cut
			let ddisty = round(
				map(y, height / 2, height, 0, random(50, 100)),
				0,
			);
			const ddistx = round(
				map(y, height / 2, height, 0, random(5, 20)),
				0,
			);
			const img = get(x, y, 30, random(15, 40));
			const ns = noise(x * 0.001, y * 0.001);
			const dispy = map(ns, 0, 1, -ddisty, ddisty);
			const dispx = map(ns, 0, 1, -ddistx, ddistx);
			// Shadow
			noStroke();
			fill(0, 60);
			rect(x + dispx + 5, y + dispy + 5, img.width, img.width);
			image(img, x + dispx, y + dispy);
			// Frame
			noFill();
			stroke(random(255), random(10, 80));
			rect(x + dispx, y + dispy, img.width, img.width);

			stroke(255, random(10, 40));
			line(x + dispx, y + dispy, x + dispx, y + dispy + 200);
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
		case "3":
			pixelDensity(3);
			break;
		case "4":
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
function colorStripes(_y, _h = 20, _sh = 200) {
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
	shadow.addColorStop(0.4, color(0, 20));
	shadow.addColorStop(0.5, color(0, 100));
	shadow.addColorStop(0.6, color(0, 20));
	shadow.addColorStop(1, color(0, 0));
	drawingContext.fillStyle = shadow;
	rect(-width, _y - 50, width * 3, _sh + 100);

	// Stripes
	let nums = 0;
	for (let y = _y; y < _sh + _y; y += _h) {
		push();
		fill(0);
		let rectFill = drawingContext.createLinearGradient(0, y, width, y);
		rectFill.addColorStop(0, color(0, 0));
		let from = color(random(255), random(255), random(255));
		let to = color(random(255));
		rectFill.addColorStop(0.2, from);
		rectFill.addColorStop(0.6, from);

		rectFill.addColorStop(0.7, to);
		rectFill.addColorStop(1, color(0, 0));
		drawingContext.fillStyle = rectFill;

		rect(-width, y, width * 3, _h);
		pop();
		nums++;
	}
	return nums;
}
