let Logo = function(position, img) {
    this.position = position.copy();
    this.lifetime = 300;
    this.img = img;
    if (random() > 0.5) {
        this.start = -1;
    } else {
        this.start = 1;
    }
};

Logo.prototype.run = function() {
    this.update();
    this.display();
};

Logo.prototype.update = function() {
    this.lifetime--;
};

// Method to display
Logo.prototype.display = function() {
    // push();
    if (notes[0]) {
        // translate(this.position.x, this.position.y);
        // rotate(this.start * PI/6);
        image(this.img, this.position.x, this.position.y, this.img.width*0.7, this.img.height*0.7);
    } else {
        image(this.img, this.position.x, this.position.y, this.img.width*0.9, this.img.height*0.9);
        // translate(this.position.x, this.position.y);
        // rotate(-this.start * PI/6);
    }
    // imageMode(CENTER);
    // pop();
};

// Is the particle still useful?
Logo.prototype.isDead = function(){
    return this.lifetime <= 0;
};

let LogoSystem = function() {
    this.logos = [];
};

LogoSystem.prototype.addLogo = function(position, img) {
    this.logos.push(new Logo(position, img));
};

LogoSystem.prototype.run = function() {
    for (let i = this.logos.length-1; i >= 0; i--) {
        let p = this.logos[i];
        p.run();
        if (p.isDead()) {
            this.logos.splice(i, 1);
        }
    }
};
