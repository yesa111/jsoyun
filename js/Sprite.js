export class Sprite {

    constructor({
        position = {
            x: 0,
            y: 0
        },
        dimension = {
            width: 50,
            height: 150
        },
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = {
            x: 0,
            y: 0
        },
        canvas
    }) {
        this.position = position;
        this.width = dimension.width;
        this.height = dimension.height
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = frameMax;
        this.offset = offset;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.canvas = document.querySelector(canvas);
        this.c = this.canvas.getContext('2d');
    }

    draw() {
        this.c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
          if (this.framesCurrent < this.framesMax - 1) {
            this.framesCurrent++;
          } else {
            this.framesCurrent = 0;
          }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }

}