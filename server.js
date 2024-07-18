var ships = [];
var asteroids = [];
var asteroids_data = [];
var score_list = [];

function createVector(x_in, y_in){
  return {x: x_in, y: y_in};
}

function random(x){
  return (Math.random()*x);
}

function random_two(a, b){
  return (Math.random()*(b-a))+a;
}

function compress(index){
    for(var i=index; i<asteroids.lenght-1;i++)
    {
      asteroids[i] = i+1;
    }
}

function Asteroid(pos, r){
  this.width = 1000;
  this.height = 1000;

  if (pos){
    var x=pos.x;
    var y=pos.y;
    var new_pos = {x:x, y:y};
    this.pos = new_pos;
  }else {
    this.pos = createVector(random(this.width), random(this.height));
  }

  if(r){
    this.r = r*0.5;
  }else{
    this.r = random_two(30,50);
  }

  this.vel = createVector(random_two(-2, 2), random_two(-2, 2));
  this.total = random_two(5, 15);
  this.offset = [];
  for (var i=0; i< this.total; i++){
    this.offset[i] = random_two(this.r*-0.3, this.r*0.3);
  }

  this.update = function(){
    this.pos.x = this.pos.x + this.vel.x * 1.5;
    this.pos.y = this.pos.y + this.vel.y * 1.5;
    //console.log(this.vel);
  }

  this.breakup = function(){
    var newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;
  }

  this.edges = function(){
    if (this.pos.x > this.width*2 + this.r){
      this.pos.x = -this.r;
    } else if(this.pos.x < -this.width-this.r){
      this.pos.x = this.width + this.r;
    }

    if (this.pos.y > this.height*2 + this.r){
      this.pos.y = -this.r;
    } else if(this.pos.y < -this.height-this.r){
      this.pos.y = this.width + this.r;
    }
  }
}

function server_game_init(){
  for(var i=0; i<10; i++)
  {
    var temp_ast = new Asteroid();
    asteroids[i] = temp_ast;
  }
}


const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

server_game_init();
setInterval(heartbeat, 30);
setInterval(asteroid_generator, 500);

function heartbeat() {
  if(asteroids.length != 0)
  {
    var ast_data = [];
    var total_data = [];

    for(var i=0; i<ships.length; i++)
    {
      ships[i].t +=1;
    }

    for(var i=0; i<ships.length; i++)
    {
      for(var j=0; j<ships[i].l.length; j++)
      {
        ships[i].l[j].px = ships[i].l[j].px + ships[i].l[j].vx * 10;
        ships[i].l[j].py = ships[i].l[j].py + ships[i].l[j].vy * 10;
      }
    }

    for(var i=0; i<ships.length; i++)
    {
      for(var j=0; j<ships[i].l.length; j++)
      {
        if(ships[i].l[j].px < 0 || ships[i].l[j].px > 1000 || ships[i].l[j].py < 0 ||  ships[i].l[j].py > 1000)
            ships[i].l.splice(j,1);
      }
    }

    for(var i=0; i<ships.length; i++)
    {
      for(var a=asteroids.length-1; a>=0; a--)
      {
        var d = Math.sqrt((asteroids[a].pos.x-ships[i].x)*(asteroids[a].pos.x-ships[i].x) + (asteroids[a].pos.y-ships[i].y)*(asteroids[a].pos.y-ships[i].y));
        //console.log(d);
        if(d < 20 + asteroids[a].r)
        {
            //onsole.log('hit');
            ships[i].hp -= 1;
            ships[i].d = true;
            break;
        }
        ships[i].d = false;
      }
    }

    var flag = true;
      for(var i=0; i<ships.length && flag; i++){
        for(var j=ships[i].l.length-1; j>=0 && flag; j--){
          for(var a=asteroids.length-1; a>=0 && flag; a--){
            var d = Math.sqrt((asteroids[a].pos.x-ships[i].l[j].px)*(asteroids[a].pos.x-ships[i].l[j].px) + (asteroids[a].pos.y-ships[i].l[j].py)*(asteroids[a].pos.y-ships[i].l[j].py));
            if(d < asteroids[a].r)
            {
              if(asteroids[a].r > 10){
                //var newAsteroids = asteroids[a].breakup();
                //asteroids = asteroids.concat(newAsteroids)

                var temp_ast = new Asteroid(asteroids[a].pos, asteroids[a].r);
                asteroids.push(temp_ast);
                var temp_ast = new Asteroid(asteroids[a].pos, asteroids[a].r);
                asteroids.push(temp_ast);
                  ships[i].s += 100;
                //console.log('breakup');
              }
                var data = {x: asteroids[a].pos.x, y: asteroids[a].pos.y}
                io.sockets.emit('explode', data);
                ships[i].l.splice(j, 1);
                asteroids.splice(a, 1);
                flag=false;
                break;
            }
        }
      }
    }

    for(var i=0; i<asteroids.length; i++)
    {
      asteroids[i].update();
      var temp_ast_data_format = {x:asteroids[i].pos.x, y:asteroids[i].pos.y, r:asteroids[i].r, offset:asteroids[i].offset}
      ast_data[i] = temp_ast_data_format;

      if(asteroids[i].pos.x < -asteroids[i].r || asteroids[i].pos.y < -asteroids[i].r || asteroids[i].pos.x > 2*asteroids[i].width + asteroids[i].r || asteroids[i].pos.y > 2*asteroids[i].height + asteroids[i].r)
        {
          asteroids.splice(i, 1);
        }
    }

    //console.log(ast_data);
    total_data[0] = ast_data;
    total_data[1] = ships;
    io.sockets.emit('heartbeat', total_data);
  }
}

function asteroid_generator(){
    var temp_ast = new Asteroid();
    asteroids.push(temp_ast);
    //console.log('new Asteroid : ' + temp_ast.pos.x + temp_ast.pos.y);
}

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.on('start', function(data) {
    var server_data = {
      id: socket.id,
      x: data.x,
      y: data.y,
      h: data.h,
      l: [],
      s: 0,
      hp: 100,
      t: 0,
      d: false
    };
    ships.push(server_data);
    console.log(server_data);
    console.log(ships);
  });

  socket.on('update', function(data) {
    //console.log(data);
    for (var i=0; i<ships.length; i++){
      if(socket.id == ships[i].id){
        ships[i].x = data.x;
        ships[i].y = data.y;
        ships[i].h = data.h;
        break;
      }
    }
});

  socket.on('laser', function(data) {
    for (var i=0; i<ships.length; i++){
      if(socket.id == ships[i].id){
        ships[i].l.push(data);
        //console.log(ships[i].l);
        break;
      }
    }
  });

  socket.on('score', function(){
    for (var i=0; i<ships.length; i++){
      if(socket.id == ships[i].id){
          var data = {id:ships[i].id, s:ships[i].s, t:ships[i].t}
          score_list[score_list.length] = data;
          break;
      }
    }
    io.sockets.connected[socket.id].emit('score', score_list);
    console.log(score_list);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected : ' + socket.id);
    for (var i=0; i<ships.length; i++){
        if(socket.id == ships[i].id){
          ships.splice(i, 1);
          break;
        }
      }
      console.log(ships);
  });

});

http.listen(3000, () => {
  console.log('Connected at 3000');
});
