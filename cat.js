let Cat = function(position, img) {
    this.position = position.copy();
    this.lifetime = 300;
    this.img = img;
    if (random() > 0.5) {
        this.start = -1;
    } else {
        this.start = 1;
    }
};

Cat.prototype.run = function() {
    this.update();
    this.display();
};

Cat.prototype.update = function() {
    this.lifetime--;
};

// Method to display
Cat.prototype.display = function() {
    push();
    if (notes[0]) {
        translate(this.position.x, this.position.y);
        rotate(this.start * PI/6);
    } else {
        translate(this.position.x, this.position.y);
        rotate(-this.start * PI/6);
    }
    imageMode(CENTER);
    image(this.img, 0, 0, this.img.width*0.8, this.img.height*0.8);
    pop();
};

// Is the particle still useful?
Cat.prototype.isDead = function(){
    return this.lifetime <= 0;
};

let CatSystem = function() {
    this.cats = [];
};

CatSystem.prototype.addCat = function(position, img) {
    this.cats.push(new Cat(position, img));
};

CatSystem.prototype.run = function() {
    for (let i = this.cats.length-1; i >= 0; i--) {
        let p = this.cats[i];
        p.run();
        if (p.isDead()) {
            this.cats.splice(i, 1);
        }
    }
};
