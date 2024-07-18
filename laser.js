function Laser(spos, angle) {
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  console.log(this.vel);
  this.vel.mult(10);

  this.update = function() {
    this.pos.add(this.vel);
  }

  this.hits = function(asteroid){
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if(d < asteroid.r){
      return true;
    }
    return false;
  }

  this.render = function(){
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }

  this.outOfScreen = function(){
    if(this.pos.x > width*2 || this.pos.x < 0 || this.pos.y > height*2 || this.pos.y < 0)
    {
      return true;
    }
    return false;
  }
}
