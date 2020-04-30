let sliders = {};
let notes = {};
// Enable WebMidi.js
WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        // Retrieve an input by name, id or index
        var input = WebMidi.getInputByName("IAC Driver Bus 1");

        // Listen for a 'cc' message on all channels
        input.addListener('controlchange', "all", function (e) {
            sliders[e.controller.number] = e.value/127;
        });

        input.addListener('noteon', "all", function (e) {
            notes[e.note.number] = e.rawVelocity/127;
        });

        input.addListener('noteoff', "all", function (e) {
            notes[e.note.number] = 0;
        });
  };
});

let numBubbles = 100;
var bubbles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);

	  for (var i = 0; i < numBubbles; i++) {
		    bubbles.push({
			      x: random(width),
			      y: random(height),
			      radius: random(2, 20)
		    });
	  }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(220);
    image(capture, (1280-960)/2, 0, 960, 720);
    // translate(200,200);

    translate(width / 2, -height / 2);
    rotate(PI / 3.0);

    let x = 0, y = 0, vx = 0;

    if (sliders[1]){
        x = sliders[1]*width;
    }

    if (sliders[2]){
        y = sliders[2]*height;
    }

    if (sliders[3]){
        vx = sliders[3] * 100;
    }

    if (sliders[5]){
        let c = color(255, 204, 0); // Define color 'c'
        // stroke(c); // Use color variable 'c' as fill color
        fill(c); // Use color variable 'c' as fill color
        noStroke(); // Don't draw a stroke around shapes
        // noFill(); // Don't draw a stroke around shapes
        ellipse(x, y, sliders[3]*200);
    }

    for (var i = 0; i < bubbles.length; i++) {
		    var bubble = bubbles[i];

        if (dist(mouseX, mouseY, bubble.x, bubble.y) < bubble.radius) {
			      if (mouseIsPressed) {
				        bubbles.splice(i, 1); // remove this bubble!
			      }
            let c = color(255, 200, 200, 200); // Define color 'c'
			      fill(c);
		    } else {
            let c = color(255, 220, 200, 200); // Define color 'c'
			      fill(c);
		    }

        ellipse(bubble.x, bubble.y, bubble.radius*2);
		    bubble.x += random(-1,1) + vx;
		    bubble.y += random(-1,1);
	  }

    // if(notes[65]){
    //     ellipse(x, y, 200);
    // }

    // if(notes[64]){
    //     ellipse(x, y, 100);
    // }
}
