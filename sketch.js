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
    colorMode(HSB);
    ldlogo = loadImage('assets/ld-logo.png');
    ldlogolg = loadImage('assets/ld-logo-large.png');
    sdlogo = loadImage('assets/sd-logo.png');
    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);

    shootingStarSystem = new ParticleSystem();
    particleSystem = new ParticleSystem();
    c = 0;
    gate = 0;
}

function draw() {
    background(51);
    colorMode(HSB);
    image(capture, (1280-960)/2, 0, 960, 720);

    // console.log(width);
    if (notes[0]) {
        image(ldlogo, 15, 15, 60, 60);
        image(sdlogo, width-95, 15, 60, 60);
    } else {
        image(ldlogo, 10, 10, 70, 70);
        image(sdlogo, width-100, 10, 70, 70);
    }

    // Bongo fill D1 & Eb1
    if (notes[38]) {
        fill(0, 0, 0);
        rect(0, 0, width, height);
        image(ldlogolg, (width-ldlogolg.width)/2, (height-ldlogolg.height)/2);
    }
    if (notes[39]) {
        fill(0, 0, 100);
        rect(0, 0, width, height);
    }

    // Shooting stars on C4
    if (notes[48] && gate) {
        let position, velocity;
        var randomBoolean1 = random() >= 0.5;
        var randomBoolean2 = random() >= 0.5;
        if (randomBoolean2) { // on width edge case
            position = createVector(width*randomBoolean1, height*random());
            if (!randomBoolean1) {
                if (position.y >= height * 0.5) {
                    velocity = createVector(1, -random());
                } else {
                    velocity = createVector(1,random());
                }
            } else {
                if (position.y >= height * 0.5) {
                    velocity = createVector(-1,-random());
                } else {
                    velocity = createVector(-1,random());
                }
            }
        } else {
            position = createVector(width*random(0,1), height*randomBoolean1);
            if (!randomBoolean1) {
                if (position.x >= width * 0.5) {
                    velocity = createVector(-random(),1);
                } else {
                    velocity = createVector(random(),1);
                }
            } else {
                if (position.x >= width * 0.5) {
                    velocity = createVector(-random(),-1);
                } else {
                    velocity = createVector(random(),-1);
                }
            }
        }
        shootingStarSystem.addParticle(position, velocity.mult(2), 70);
        gate = 0;
    }
    if (!notes[48]) {
        gate = 1;
    }

    shootingStarSystem.run();

}
