import { Sprite } from "./Sprite.js";
import { DAMAGE, GRAVITY, GROUNDHEIGHT } from "./constant.js";

export class Fighter extends Sprite {

    constructor({
      position = { x: 0, y: 0 },
      dimension = { width: 50, height: 150 },
      velocity = { x: 0, y: 0 },
      name = 'Player',
      imageSrc,
      stats = { health: 100, speed: 5, jumping: 15 },
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 },
      sprites,
      attackBox = {width: undefined, height: undefined},
      faceLeft = false,
      canvas
    }) {
      super({position, dimension, imageSrc, scale, framesMax, offset, canvas});
      this.velocity = velocity;
      this.name = name;
      this.dead = false;
      this.isAttacking = false;
      this.stats = stats;
      this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        ...attackBox
      };
      this.lastKey = '';
      this.sprites = sprites;
      this.faceLeft = faceLeft;
      this.jumpStack = 0;

      for (const sprite in this.sprites) {
        sprites[sprite].image = new Image()
        sprites[sprite].image.src = sprites[sprite].imageSrc
      }
    }

    run() {
      if(this.position.x + this.velocity.x > 0 && this.position.x + this.width + this.velocity.x <= this.canvas.width) {
        this.position.x += this.velocity.x;
      }
    }

    gravity() {
      const groundHeight = GROUNDHEIGHT ?? 0;
      this.position.y += this.velocity.y;
      if (this.position.y + this.height + this.velocity.y >= this.canvas.height - groundHeight) {
          this.velocity.y = 0;
          this.position.y = this.canvas.height - (groundHeight + this.height);
          this.jumpStack = 0;
      } else this.velocity.y += GRAVITY;
    }

    update() {
      this.draw();
      if (!this.dead) this.animateFrames();
      this.attackBox.position.x = this.position.x;
      if(this.faceLeft) this.attackBox.position.x = this.position.x - this.attackBox.width + this.width;
      this.attackBox.position.y = this.position.y;

      this.run();
      this.gravity();
    }

    attack() {
      if(this.dead) return;
      this.switchSprite('attack');
      this.isAttacking = true;
    }

    switchSprite(sprite) {
      const deathSprite = this.faceLeft ? this.sprites.deathL : this.sprites.death;
      if (this.image === deathSprite.image) {
        if (this.framesCurrent === deathSprite.framesMax - 1)
          this.dead = true;
        return;
      }
  
      const spriteAttack = this.faceLeft ? this.sprites.attackL : this.sprites.attack;
      if (
        this.image === spriteAttack.image &&
        this.framesCurrent < spriteAttack.framesMax - 1
      ) return;
  
      const spriteTakeHit = this.faceLeft ? this.sprites.takeHitL : this.sprites.takeHit;
      if (
        this.image === spriteTakeHit.image &&
        this.framesCurrent < spriteTakeHit.framesMax - 1
      ) return;
  
      switch (sprite) {
        case 'idle': {
          const idle = this.faceLeft ? this.sprites.idleL : this.sprites.idle;
          if (this.image !== idle.image) {
            this.image = idle.image;
            this.framesMax = idle.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
        case 'run': {
          const run = this.faceLeft ? this.sprites.runL : this.sprites.run;
          if (this.image !== run.image) {
            this.image = run.image;
            this.framesMax = run.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
        case 'jump': {
          const jump = this.faceLeft ? this.sprites.jumpL : this.sprites.jump;
          if (this.image !== jump.image) {
            this.image = jump.image;
            this.framesMax = jump.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
        case 'fall': {
          const fall = this.faceLeft ? this.sprites.fallL : this.sprites.fall;
          if (this.image !== fall.image) {
            this.image = fall.image;
            this.framesMax = fall.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
        case 'attack': {
          const attack = this.faceLeft ? this.sprites.attackL : this.sprites.attack;
          if (this.image !== attack.image) {
            this.image = attack.image;
            this.framesMax = attack.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
        case 'takeHit': {
          const takeHit = this.faceLeft ? this.sprites.takeHitL : this.sprites.takeHit;
          if (this.image !== takeHit.image) {
            this.image = takeHit.image;
            this.framesMax = takeHit.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
        case 'death': {
          const death = this.faceLeft ? this.sprites.deathL : this.sprites.death;
          if (this.image !== death.image) {
            this.image = death.image;
            this.framesMax = death.framesMax;
            this.framesCurrent = 0;
          }
          break;
        }
      }
    }

    takeHit() {
      this.stats.health -= DAMAGE;
      if (this.stats.health <= 0) {
          this.switchSprite('death');
      } else this.switchSprite('takeHit');
    }

}