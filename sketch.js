// Palette: https://coolors.co/5aa9e6-7fc8f8-f9f9f9-ffe45e-ff6392
// Song: Raucous Rancor -- Kevin Macleod  (https://youtu.be/B1Yn0ItRS94)
// Font: Karrik -- Jean-Baptiste Morizot, Lucas Le Bihan (Velvetyne Type Foundry)

var spectrum;
var sound;
var font;

let maxSize = 5;
let streamW = 1024;
let streamH = 640;

let numLines = 100;

let color_1, color_2, bgColor;


function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

// ******** MAIN METHODS ******** //
function preload() {
    sound = loadSound('assets/rancor.mp3');
    font = loadFont('assets/karrik.otf');
}

function mouseClicked() {
    togglePlay();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    fft = new p5.FFT();
    color_1 = color(255, 99, 146);
    color_2 = color(90, 169, 230);
    bgColor = color(255, 228, 94);

    textFont(font);
    textSize(height / 8);
    textAlign(CENTER, CENTER);

    sound.amp(0.2);

    background(bgColor);

    imageMode(CENTER);

	noStroke();
}

function draw(){
    let spectrum = fft.analyze();
    let waveform = fft.waveform();

    let mid = fft.getEnergy("bass");
    let high = fft.getEnergy("treble");
    let highMid = fft.getEnergy("highMid");

    let center = fft.getCentroid();
	
    background(bgColor);
	strokeWeight(1);

    let maxSpec = max(spectrum);
    let maxWav = max(waveform);
    
    let colorLerp = map(high, 0, 255, 0, 1);
    let xxx = lerpColor(color_2, color_1, colorLerp);

    for(let i=0; i < numLines; i++) {
        let paint = map(i, 0, numLines, 0, 255);
        let strk = map(i, 0, numLines, 0, 100);

        xxx.setAlpha(paint);
        fill(xxx);
        
        stroke(255 - strk);
		
        beginShape();

        for(let y = -width; y < width; y += 18){
            let s = map(center, 0, 255, .01, .5, true);
            let n = noise(y * 0.01, i * waveform[i] * s * 0.1, frameCount * 0.005);
            let x = map(n, .1, .5, -height, height) + map(i,10, numLines - 10,-height,height);
			
            let d = dist(y, high, mid, x);
			
            let dx = 0;
            let dy = 0;

            dx = maxSpec - x;
            dy = maxWav - y;

            let factor = map(d, 0, height, 1, 0);

            dx *= factor;
            dy *= factor;
            vertex(x + dx,y + dy);
        }

        endShape();
    }

    if (!sound.isPlaying()) {
        let textFill = lerpColor(color_1, color_2, colorLerp);
        fill(textFill);
        text("CLICK TO PLAY", width / 2, height / 2);
    }
}
