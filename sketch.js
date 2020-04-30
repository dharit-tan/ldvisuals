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

let system, c;

function setup() {
    createCanvas(windowWidth, windowHeight);
    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);
    colorMode(HSB);

    system = new ParticleSystem(createVector(width / 2, 50));
    c = 0;
}

function draw() {
    background(51);
    image(capture, (1280-960)/2, 0, 960, 720);

    translate(width/2+500,-height/2);
    rotate(PI / 4.0);
    system.addParticle();
    system.run();
}

// A simple Particle class
let Particle = function(position) {
    this.acceleration = createVector(0, 0.1);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 400;
};

Particle.prototype.run = function() {
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function(){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
    if (sliders[1]) {
        c = sliders[1] * 255;
    }
    stroke(c, 255, 255, (this.lifespan/400) * 255);
    strokeWeight(2);
    fill(c, 255, 255, this.lifespan);
    let sizeMult;

    if (sliders[3]){
        sizeMult = sliders[3];
    }
    ellipse(this.position.x, this.position.y, 12*sizeMult);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
    return this.lifespan < 0;
};

let ParticleSystem = function() {
    this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(createVector(windowWidth * random(-1,1), 50)));
};

ParticleSystem.prototype.run = function() {
    for (let i = this.particles.length-1; i >= 0; i--) {
        let p = this.particles[i];
        p.run();
        if (p.isDead()) {
            this.particles.splice(i, 1);
        }
    }
};
