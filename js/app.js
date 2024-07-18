import { Sprite } from "./Sprite.js";
import { Fighter } from "./Fighter.js";
import { JUMP, SPEED, TIME } from "./constant.js";
import { determineWiner, rectangularCollision } from "./utils.js";

const canvas = document.querySelector('#canvas');
canvas.width = 1024;
canvas.height = 576;
const c = canvas.getContext('2d');
c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position: {
      x: 0,
      y: 0
    },
    scale: 1,
    imageSrc: '../images/Background/Bg2.jpeg',
    canvas: '#canvas',
});

const player = new Fighter({
    name: "Player 1",
    position: {
      x: 150,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
      x: 90,
      y: 107,
    },
    imageSrc: '../images/Samurai/Idle.png',
    framesMax: 6,
    scale: 2,
    sprites: {
      idle: {
        imageSrc: '../images/Samurai/Idle.png',
        framesMax: 6
      },
      run: {
        imageSrc: '../images/Samurai/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: '../images/Samurai/Jump.png',
        framesMax: 6
      },
      fall: {
        imageSrc: '../images/Samurai/Fall.png',
        framesMax: 6
      },
      attack: {
        imageSrc: '../images/Samurai/Attack_1.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: '../images/Samurai/Hurt.png',
        framesMax: 2
      },
      death: {
        imageSrc: '../images/Samurai/Dead.png',
        framesMax: 3
      },
      idleL: {
        imageSrc: '../images/Samurai/IdleL.png',
        framesMax: 6
      },
      runL: {
        imageSrc: '../images/Samurai/RunL.png',
        framesMax: 8
      },
      jumpL: {
        imageSrc: '../images/Samurai/JumpL.png',
        framesMax: 6
      },
      fallL: {
        imageSrc: '../images/Samurai/FallL.png',
        framesMax: 6
      },
      attackL: {
        imageSrc: '../images/Samurai/Attack_1L.png',
        framesMax: 6
      },
      takeHitL: {
        imageSrc: '../images/Samurai/HurtL.png',
        framesMax: 2
      },
      deathL: {
        imageSrc: '../images/Samurai/DeadL.png',
        framesMax: 3
      }
    },
    attackBox: {
      width: 150,
      height: 50
    },
    canvas: '#canvas'
});

const enemy = new Fighter({
  name: "Player 2",
    position: {
      x: 800,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
      x: 90,
      y:107,
    },
    imageSrc: '../images/Shinobi/Idle.png',
    framesMax: 6,
    scale: 2,
    sprites: {
      idle: {
        imageSrc: '../images/Shinobi/Idle.png',
        framesMax: 6
      },
      run: {
        imageSrc: '../images/Shinobi/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: '../images/Shinobi/Jump.png',
        framesMax: 6
      },
      fall: {
        imageSrc: '../images/Shinobi/Fall.png',
        framesMax: 6
      },
      attack: {
        imageSrc: '../images/Shinobi/Attack_1.png',
        framesMax: 5
      },
      takeHit: {
        imageSrc: '../images/Shinobi/Hurt.png',
        framesMax: 2
      },
      death: {
        imageSrc: '../images/Shinobi/Dead.png',
        framesMax: 4
      },
      idleL: {
        imageSrc: '../images/Shinobi/IdleL.png',
        framesMax: 6
      },
      runL: {
        imageSrc: '../images/Shinobi/RunL.png',
        framesMax: 8
      },
      jumpL: {
        imageSrc: '../images/Shinobi/JumpL.png',
        framesMax: 6
      },
      fallL: {
        imageSrc: '../images/Shinobi/FallL.png',
        framesMax: 6
      },
      attackL: {
        imageSrc: '../images/Shinobi/Attack_1L.png',
        framesMax: 5
      },
      takeHitL: {
        imageSrc: '../images/Shinobi/HurtL.png',
        framesMax: 2
      },
      deathL: {
        imageSrc: '../images/Shinobi/DeadL.png',
        framesMax: 4
      }
    },
    attackBox: {
      width: 150,
      height: 50
    },
    faceLeft: true,
    canvas: '#canvas'
});

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
};

//Decrease timer
let timer = TIME;
let timeId;
function decreaseTimer(){
	if(timer > 0){
		timeId = setTimeout(decreaseTimer,1000);
		timer--;
		document.querySelector("#timer").innerHTML = timer;
	}
	if(timer === 0 ){
		determineWiner({
			element: "#result",
			fighter1: player,
			fighter2: enemy,
			timeId});
	}
}
decreaseTimer();

const playerAction = () => {
  //Run
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -SPEED;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = SPEED;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }
  //Jump
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }
}

const enemyAction = () => {
  //Run
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -SPEED;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = SPEED;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }
  //Jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }
}

/**
 * Update animation frame
 */
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  playerAction();
  enemyAction();

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    const enemyHealth = document.querySelector("#enemyHealth");
    enemyHealth.style.width = enemy.stats.health +'%';
		if(enemy.stats.health < 0){
			enemyHealth.style.width = '0';
		}
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 3
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    const playerHealth = document.querySelector("#playerHealth");
    playerHealth.style.width = player.stats.health +'%';
		if(player.stats.health < 0){
			playerHealth.style.width = '0';
		}
  }

  if (enemy.isAttacking && enemy.framesCurrent === 3) {
    enemy.isAttacking = false;
  }

  if (enemy.stats.health <= 0 || player.stats.health <= 0) {
    determineWiner({
			element: "#result",
			fighter1: player,
			fighter2: enemy,
			timeId});
  }
}

animate();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.faceLeft = false;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.faceLeft = true;
        player.lastKey = 'a';
        break
      case 'w':
        if(player.jumpStack++ < 2) player.velocity.y = -JUMP;
        break;
      case ' ':
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.faceLeft = false;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.faceLeft = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        if(enemy.jumpStack++ < 2) enemy.velocity.y = -JUMP;
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});