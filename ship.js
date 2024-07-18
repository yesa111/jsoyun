
function Ship() {
  this.pos = createVector(width/2, height/2);
  this.r = 20;
  this.heading = PI/2;
  this.angle = 0.1;
  this.rotation = 0;
  this.isBoosting = false;
  this.vel = createVector(0, 0);

  this.boosting = function(b){
    this.isBoosting = b;
  }

  this.update = function(){
    if(this.isBoosting){
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.95);
  }

  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading);
    this.vel.add(force);
  }

  this.edges = function(){
    //console.log(this.pos.x, this.pos.y);
    if (this.pos.x > width + this.r){
      this.pos.x = -this.r;
    } else if(this.pos.x < -this.r){
      this.pos.x = width + this.r;
    }

    if (this.pos.y > height + this.r){
      this.pos.y = -this.r;
    } else if(this.pos.y < -this.r){
      this.pos.y = height + this.r;
    }
  }

  this.hits = function(asteroid){
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r){
      return true;
    }
    return false;
  }

  this.render = function(hit){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI/2);
    //noFill();
    if(hit)
    fill(255, 0, 0);
    else
    fill(0);

    stroke(255);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }

  this.setRotation = function(a){
    this.rotation = a;
  }

  this.turn = function(angle){
    this.heading += this.rotation;
  }
}
