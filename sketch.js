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
    // capture = createCapture(VIDEO);
    // capture.size(windowWidth, windowHeight);

    shootingStarSystem = new ParticleSystem();
    particleSystem = new ParticleSystem();
    c = 0;
    gate = 0;
}

function draw() {
    background(51);
    colorMode(HSB);
    // console.log("webcam");
    // image(capture, (1280-960)/2, 0, 960, 720);

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

    console.log(notes);
    if (notes[38]) {
        fill(0, 0, 0);
        rect(0, 0, width, height);
    }
    if (notes[39]) {
        fill(0, 0, 100);
        rect(0, 0, width, height);
    }
}

// A simple Particle class
let Particle = function(position, velocity, lifespan) {
    this.acceleration = 1.2;
    this.velocity = velocity.copy();
    this.position = position.copy();
    this.lifespan = lifespan;
    this.maxlifespan = lifespan;
    this.trail = [];
    this.maxTrail = 10;
    this.size = 10;
};

Particle.prototype.run = function() {
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function(){
    this.velocity.mult(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
    this.trail.push(this.position.copy());
    //removes poses that are older than 50
    if (this.trail.length > this.maxTrail) {
  	    this.trail.shift();
    }
    for (let i = 0; i < this.trail.length; i +=1) {
        // how you want to draw the previous poses
        // relate it to i to change pose drawing over time
        trailVelocity = this.velocity.copy().mult(0.2);
        this.trail[i].add(trailVelocity);
    }
};

// Method to display
Particle.prototype.display = function() {
    noStroke();
    let s = (this.lifespan/this.maxlifespan) * 100;
    if (sliders[3]) {
        c = sliders[3] * 360;
    }
    fill(c, s, 255, this.lifespan/this.maxlifespan);
    sizeMult = this.maxlifespan / this.lifespan;
    ellipse(this.position.x, this.position.y, this.size*sizeMult);

    for (let i = 0; i < this.trail.length; i +=1) {
        // how you want to draw the previous poses
        // relate it to i to change pose drawing over time
        fill(c, s * (this.maxTrail/i), 255, this.lifespan/this.maxlifespan);
  	    ellipse(this.trail[i].x, this.trail[i].y, this.size * 5 * (i/this.maxTrail));
    }
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
    return this.lifespan < 0;
};

let ParticleSystem = function() {
    this.particles = [];
};

ParticleSystem.prototype.addParticle = function(position, velocity, lifespan) {
    this.particles.push(new Particle(position, velocity, lifespan));

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
