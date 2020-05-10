let UFO = function(position, velocity) {
    this.velocity = velocity.copy();
    this.position = position.copy();
    this.g = 0;
};

UFO.prototype.run = function() {
    this.update();
    this.display();
};

// Method to update position
UFO.prototype.update = function(){
    this.position.add(this.velocity);
};

// Method to display
UFO.prototype.display = function() {
    push();
    if (this.g) {
        // rotate(PI/4);
        this.g = 0;
    } else {
        // rotate(-PI/4);
        this.g = 1;
    }
    image(ufo, this.position.x, this.position.y, ufo.width/2, ufo.height/2);
    pop();
};

// Is the particle still useful?
UFO.prototype.isDead = function(){
    return this.position.x > width;
};

let UFOSystem = function() {
    this.ufos = [];
};

UFOSystem.prototype.addUFO = function(position, velocity) {
    this.ufos.push(new UFO(position, velocity));

};

UFOSystem.prototype.run = function() {
    for (let i = this.ufos.length-1; i >= 0; i--) {
        let p = this.ufos[i];
        p.run();
        if (p.isDead()) {
            this.ufos.splice(i, 1);
        }
    }
};
