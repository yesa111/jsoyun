var ship;
var asteroids = [];
var lasers = [];
var socket;
var other_asteroids = [];
var other_ship = [];
var lasers_data = [];
var particles = [];
var fireworks = [];
var score_list = [];
var my_id = null;
var isFinished = false;
var game_board = document.getElementById("defaultCanvas0");

function preload(){
	shoot = loadSound('sound/laser.wav');
	bomb = loadSound('sound/bomb.mp3');
}

function setup(){
  //createCanvas(windowWidth * 0.99, windowHeight * 0.973);
  createCanvas(windowWidth-50, windowHeight-25);
  ship = new Ship();

  socket = io.connect('http://192.168.0.7:3000');
  var data = {
    x: ship.pos.x,
    y: ship.pos.y,
    h: ship.heading
  };
  socket.emit('start', data);
  socket.on('heartbeat', function(data) {
    other_asteroids = data[0];
    other_ship = data[1];
    console.log(data);
  });

  socket.on('explode', function(data) {
    fireworks.push(new Firework(data.x, data.y));
    bomb.play();
  });

	socket.on('score', function(data)
	{
		score_list=data;
		console.log(score_list);
		my_id = socket.id;
		document.body.innerHTML = "<iframe src='result_page.html' width='1000px' height='1000px'></iframe>";
		socket.emit('disconnect', null);
		socket.close();
	});
}

function draw(){
	if(!isFinished){
  background(0);
  lasers_data = [];
  var myIndex = null;

  var p = new Particle();
  	particles.push(p);
  	for(let i = particles.length-1; i >= 0; i--){
  		particles[i].update();
  		particles[i].show();
  		if(particles[i].finished()){
  			particles.splice(i, 1);
  		}
  	}

  for(var i = 0; i < fireworks.length; i++){
    	fireworks[i].run();
    	if(fireworks.length>10){
    		fireworks.splice(0, 1);
    	}
  	}

  for(var i=0; i<lasers.length; i++)
  {
    lasers_data[i] = {x: lasers[i].pos.x, y: lasers[i].pos.y};
  }
  var data = {
    x: ship.pos.x,
    y: ship.pos.y,
    h: ship.heading,
  };
  socket.emit('update', data);


    for(var i=0; i<other_asteroids.length; i++) {
      push();
      noFill();
      stroke(255);
      translate(other_asteroids[i].x, other_asteroids[i].y);
      //ellipse(0, 0, this.r*2);
      beginShape();
      for (var j=0; j<other_asteroids[i].offset.length; j++){
        var angle = map(j, 0, other_asteroids[i].offset.length, 0, TWO_PI);
        var r = other_asteroids[i].r + other_asteroids[i].offset[j];
        var x = r * cos(angle);
        var y = r * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    }

  fill(255);
  textAlign(CENTER);
  text("Leader Board", width-100, 20);

  for(var i=0; i<other_ship.length; i++){
    fill(255);
    textAlign(CENTER);
    text(other_ship[i].id + ": " + (parseInt(other_ship[i].s) + parseInt(other_ship[i].t)), width-100, 20*(i+2));

      if(other_ship[i].id != socket.id){
        for(var j=0; j<other_ship[i].l.length; j++)
        {
          push();
          stroke(255, 0, 0);
          strokeWeight(4);
          point(other_ship[i].l[j].px, other_ship[i].l[j].py);
          pop();
        }

        push();
        translate(other_ship[i].x, other_ship[i].y);
        rotate(other_ship[i].h + PI/2);
        //noFill();
        fill(0);
        stroke(255, 0, 0);
        triangle(ship.r, ship.r, -ship.r, ship.r, 0, -ship.r);

        fill(255);
        textAlign(CENTER);
        textSize(6);
        text(other_ship[i].id, 0, 30);
        pop();
      }else {

        myIndex = i;

        ship.render(other_ship[myIndex].d);
        ship.turn();
        ship.update();
        ship.edges();

        push();
        fill(255);
        textAlign(CENTER);
        textSize(25);
        text('HP ' + other_ship[i].hp, 50, 30);
				if(other_ship[i].hp<=0)
				{
					socket.emit('score', data);


					//var restart = document.getElementById('restart');
					//restart.addEventListener('click',function(){window.location.href=window.location.href});

					isFinished = true;

				}
        pop();
        for(var j=0; j<other_ship[i].l.length; j++)
        {
          push();
          stroke(255);
          strokeWeight(4);
          point(other_ship[i].l[j].px, other_ship[i].l[j].py);
          pop();
        }
      }
  }





 /*
  for (var i=0; i<asteroids.length; i++){
    if (ship.hits(asteroids[i])){
      console.log('die');
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }
  */

/*
  for (var i=lasers.length-1; i>=0; i--){
    lasers[i].render();
    lasers[i].update();
    console.log(lasers.length);
    if(lasers[i].outOfScreen())
    {
      lasers.splice(i, 1);
      continue;
    }

    for (var j=asteroids.length-1; j>=0; j--){
      if(lasers[i].hits(asteroids[j])){
        if(asteroids[j].r > 10){
          var newAsteroids = asteroids[j].breakup();
          asteroids = asteroids.concat(newAsteroids);
        }else{
          // increae the score
        }
          asteroids.splice(j, 1);
          lasers.splice(i, 1);
          break;
      }
    }
  }
*/
	}
}

function mousePressed(mouse){
  //fireworks.push(new Firework(mouse.x, mouse.y));
}

function keyReleased(){
  ship.setRotation(0);
  ship.boosting(false);
}

function keyPressed(){
  if (key == ' '){
    //lasers.push(new Laser(ship.pos, ship.heading));
    var v = p5.Vector.fromAngle(ship.heading);
    var vx = v.x;
    var vy = v.y;
    var data = {px: ship.pos.x, py: ship.pos.y, vx:vx, vy:vy};
    socket.emit('laser', data);
    shoot.play();
  }
  if (keyCode == RIGHT_ARROW){
    ship.setRotation(0.1);
  }else if (keyCode == LEFT_ARROW){
    ship.setRotation(-0.1);
  }else if (keyCode == UP_ARROW){
    ship.boost();
    ship.boosting(true);
  }
}
