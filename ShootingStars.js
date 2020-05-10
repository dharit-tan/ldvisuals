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
