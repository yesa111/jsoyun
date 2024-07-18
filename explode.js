function Explode(x, y){
	this.pos = createVector(x, y);
	this.vel = createVector(random(-2, 2), random(-2, 2));
	this.acc = createVector(0,0);
	this.alpha = 255;

	this.finished = function(){
		return this.alpha < 0;
	}

	this.applyForce = function(force){
		this.acc.add(force);
	}

	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.alpha -= 6;
	}

	this.show = function(){
		push();
		stroke(255, this.alpha);
		strokeWeight(2);
		point(this.pos.x, this.pos.y);
		pop();
	}
}
