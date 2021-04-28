//Michael Lowe, January 2021

const generationSpeed = 50;

//Increase for better quality images but slower generation
const resolution = 3;

const palettes = [
	["#605063", "#248f8d", "#c2e5ca"],
	["#FFBE40", "#AB3E5B", "#ECF081"],
	["#233d4d", "#fe7f2d", "#fcc736"],
	["#C8C8A9", "#83AF9B", "#F9CDAD"]
];

const visitedGrid = [];

let colors, i, j, size, xSize, ySize, r, noiseScale;

function setup() {
	createCanvas(windowWidth, windowHeight);//min(windowWidth, windowHeight*2), windowHeight);
	
	colors = random(palettes);
	size = random(random(8, 16), random(37, 50));
	noiseScale = random(2e-3, 6e-3);
	if (random() < 0.15) noiseScale = 1;
	
	i = 1;
	j = 1;	
	ySize = size / 2;
	xSize = sqrt(3) / 2 * size;
	r = 2 * ySize / sqrt(3);
	
	background("#E8F2FC");
	pixelDensity(resolution);
	noStroke();
	
	for (let ii = 0; ii < width / xSize + 2; ii++) {
		visitedGrid[ii] = [];
		for (let jj = 0; jj < height / ySize + 2; jj++) {
			visitedGrid[ii][jj] = false;
		}
	}
}

function draw() {

	for (let iter = 0; iter < generationSpeed && j < visitedGrid[0].length; iter++) {
		if (!visitedGrid[i][j]) {
			let neighbours = [{
				ii: i,
				jj: j - 1,
				fillColor: colors[i % 2 == j % 2 ? 0 : 1],
			}, {
				ii: i,
				jj: j + 1,
				fillColor: colors[i % 2 == j % 2 ? 1 : 0],
			}, {
				ii: i % 2 == j % 2 ? i + 1 : i - 1,
				jj: j,
				fillColor: colors[2]
			}];

			let horizontalTile = curlNoise(i * xSize * noiseScale, j * ySize * noiseScale) < 0.5;
			if (horizontalTile) {
				neighbours = [neighbours[2]].concat(shuffle([neighbours[0], neighbours[1]]));
			} else {
				neighbours = shuffle([neighbours[0], neighbours[1]]).concat([neighbours[2]])
			}

			for (let {
					ii,
					jj,
					fillColor
				} of neighbours) {
				if (!visitedGrid[ii][jj]) {
					fill(fillColor)
					drawTriangle(i, j)
					drawTriangle(ii, jj)
					visitedGrid[i][j] = true;
					visitedGrid[ii][jj] = true;
					break
				}
			}
		}
		i++;
		if (i >= visitedGrid.length - 1) {
			i = 1;
			j++;
		}
	}
}

function getTrianglePoints(i, j, scaleFactor = 1) {
	
	//subtract (1,1) from the coordinates so it starts off screen
	i -= 1;
	j -= 1;
	
	//whether it is a left-pointing or right-pointing triangle
	const isPointingLeft = i % 2 == j % 2;

	let points = [];
	let center = {
		x: i * xSize + (isPointingLeft ? xSize / 3 : 0),
		y: j * ySize
	}
	for (let angle = isPointingLeft ? TAU / 6 : 0; angle < TAU; angle += TAU / 3) {
		points.push({
			x: center.x + r * scaleFactor * cos(angle),
			y: center.y + r * scaleFactor * sin(angle)
		})
	}
	return points;
}

function drawTriangle(i, j) {
	const points = getTrianglePoints(i, j, 1.043);

	beginShape();
	for (let point of points) {
		vertex(point.x, point.y);
	}
	endShape();
}

function curlNoise(x, y) {
	let eps = 10e-13;
	x += 123.243
	y += 234.123

	//Find rate of change in X direction
	let n1X = noise(x + eps, y, 0);
	let n2X = noise(x - eps, y, 0);

	//Average to find approximate derivative
	let a = (n1X - n2X) / (2 * eps);

	//Find rate of change in Y direction
	let n1Y = noise(x, y + eps, 0);
	let n2Y = noise(x, y - eps, 0);

	//Average to find approximate derivative
	let b = (n1Y - n2Y) / (2 * eps);

	let angle = createVector(a, -b).heading();
	if (angle < 0) angle += TAU;
	return angle / TAU;
}

function keyPressed() {

	if (key == "s") save();
	if (key == " ") {
		noiseSeed(random(10e9));
		setup();
	}
}