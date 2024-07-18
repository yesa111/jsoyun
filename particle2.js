class Particle{

	constructor(){
		this.x = random(width);
		this.y = random(height);
		this.vx = random(-0.3, 0.3);
		this.vy = random(-0.1, 0.1);
		this.alpha = 255;
	}

	finished(){
		return this.alpha < 0;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.alpha -= 4;
	}

	show(){
		fill(200, 255, 0, this.alpha);
		noStroke();
		ellipse(this.x, this.y, 2);
	}
}
