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

let particleSystem, shootingStarSystem, c, gate;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ldlogo = loadImage('assets/ld-logo.png');
    ldlogolg = loadImage('assets/ld-logo-large.png');
    sdlogo = loadImage('assets/sd-logo.png');
    ufo = loadImage('assets/ufo.png');
    space = createVideo(['assets/space3.mp4'], vidLoad);
    // capture = createCapture(VIDEO);
    // capture.size(windowWidth, windowHeight);

    ufos = new UFOSystem();

    shootingStarSystem = new ParticleSystem();
    particleSystem = new ParticleSystem();
    c = 0;
    gate = 0;
}

function vidLoad() {
    space.loop();
    space.volume(0);
}

function draw() {
    background(51);
    colorMode(HSB);
    rectMode(CENTER);
    imageMode(CENTER);

    // image(capture, width/2, height/2, 960, 720);
    image(space, width/2, height/2, width, height);

    push();
    imageMode(CORNER);
    if (notes[0]) {
        image(ldlogo, 15, 15, 60, 60);
        image(sdlogo, width-95, 15, 60, 60);
    } else {
        image(ldlogo, 10, 10, 70, 70);
        image(sdlogo, width-100, 10, 70, 70);
    }
    pop();

    // Shooting stars on C4
    if (notes[48] && gate) {
        ufos.addUFO(createVector(0, height/2 * random()), createVector(10, 0));
        gate = 0;
    }
    if (!notes[48]) {
        gate = 1;
    }

    ufos.run();
    // colorMode(RGB);
    // fill(340, 3.5, 78);
	  // fill(0, 50);
    // noStroke();
	  // var ang1 = TWO_PI * noise(0.01*frameCount + 10);
	  // var ang2 = TWO_PI * noise(0.01*frameCount + 20);
	  // var ang3 = TWO_PI * noise(0.01*frameCount + 30);
	  // var rx = 60 * noise(0.01*frameCount + 40);
	  // var tx = 200 * noise(0.01*frameCount + 50);
	  // var size1 = 200 * noise(0.01*frameCount + 60);
	  // var size2 = 50 * noise(0.01*frameCount + 60);

    // push();
	  // translate(width/2, height/2);
	  // for (var i = 0; i < 8; i++) {
		//     push();
		//     rotate(ang1 + TWO_PI * i / 8);
		//     translate(tx, 0);
		//     rect(0, 0, size1, size1);
		//     for (var j = 0; j < 6; j++) {
		// 	      push();
		// 	      rotate(ang2 + TWO_PI * j / 6);
		// 	      translate(rx, 0);
		// 	      rotate(ang3);
		// 	      rect(rx, 0, size2, size2);
		// 	      pop();
		//     }
		//     translate();
		//     pop();
	  // }
    // pop();

    // Bongo fill D1 & Eb1
    if (notes[38]) {
        fill(0, 0, 0);
        rect(width/2, height/2, width, height);
        image(ldlogolg, width/2, height/2);
    }
    if (notes[39]) {
        fill(0, 0, 100);
        rect(width/2, height/2, width, height);
    }
    // // Shooting stars on C4
    // if (notes[48] && gate) {
    //     let position, velocity;
    //     var randomBoolean1 = random() >= 0.5;
    //     var randomBoolean2 = random() >= 0.5;
    //     if (randomBoolean2) { // on width edge case
    //         position = createVector(width*randomBoolean1, height*random());
    //         if (!randomBoolean1) {
    //             if (position.y >= height * 0.5) {
    //                 velocity = createVector(1, -random());
    //             } else {
    //                 velocity = createVector(1,random());
    //             }
    //         } else {
    //             if (position.y >= height * 0.5) {
    //                 velocity = createVector(-1,-random());
    //             } else {
    //                 velocity = createVector(-1,random());
    //             }
    //         }
    //     } else {
    //         position = createVector(width*random(0,1), height*randomBoolean1);
    //         if (!randomBoolean1) {
    //             if (position.x >= width * 0.5) {
    //                 velocity = createVector(-random(),1);
    //             } else {
    //                 velocity = createVector(random(),1);
    //             }
    //         } else {
    //             if (position.x >= width * 0.5) {
    //                 velocity = createVector(-random(),-1);
    //             } else {
    //                 velocity = createVector(random(),-1);
    //             }
    //         }
    //     }
    //     shootingStarSystem.addParticle(position, velocity.mult(2), 70);
    //     gate = 0;
    // }
    // if (!notes[48]) {
    //     gate = 1;
    // }
    // shootingStarSystem.run();

}
