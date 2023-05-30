//Sprite class
class Sprite {
  constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0,y: 0}}){
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.delayFrame = 0;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesMax), // width divided by frames is per frame in png or jpg file ncnc
      0, 
      this.image.width / this.framesMax, 
      this.image.height, 
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      this.image.width / this.framesMax * this.scale, 
      this.image.height * this.scale
      );
  }

  update(){
    this.draw();
    //Animation process conditional statement  can be put in a function to animate frames
    //possible waste of space probs need conditional statement to fix
    this.frameCounter++;
    if(this.frameCounter % this.delayFrame === 0){
      if(this.currentFrame < this.framesMax - 1){
        this.currentFrame++;
      }
      else{
        this.currentFrame = 0;
      }
    }
    
  }


}

//Fighter class
class Fighter extends Sprite{
  constructor({position, velocity, attackBox = { atkoffset: {}, width: undefined, height: undefined}, color,imageSrc, scale = 1, framesMax = 1, offset = {x: 0,y: 0}, sprites}){
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
    this.color = color;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.extraKey;
    //Attack properties
    this.health = 100;
    this.isAttacking
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      atkoffset: attackBox.atkoffset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.dead = false;
    //Animation stuff
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.delayFrame = 7;
    this.sprites = sprites;

    for (const x in this.sprites) {
      sprites[x].image = new Image();
      sprites[x].image.src = sprites[x].imageSrc
    }

  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesMax), // width divided by frames is per frame in png or jpg file ncnc
      0, 
      this.image.width / this.framesMax, 
      this.image.height, 
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      this.image.width / this.framesMax * this.scale, 
      this.image.height * this.scale
      );
  }
/*  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x,this.position.y, this.width, this.height);

    //attackbox
    if(this.isAttacking){
      c.fillStyle = 'yellow';
      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }
*/
  animateSprite(){
    this.frameCounter++;
      if(this.frameCounter % this.delayFrame === 0){
        if(this.currentFrame < this.framesMax - 1){
          this.currentFrame++;
        }
        else{
          //AHHHHHHHH PUTANGINA NETONG PIECE OF CODE NA TO KAYA AYAW GUMANA NG CONDITIONAL PUTANGINAMOOOO
          //check logic neto
          // all not death frames
          // death frame but not max
          if(this.image != this.sprites.death.image){
            this.currentFrame = 0;
          }
          else if(this.image === this.sprites.death.image && this.currentFrame === this.sprites.death.framesMax ){
            this.currentFrame = 0;
          }
        }
      }
  }
  update(){
    this.draw();
    //Animation stuff, can be put in a function to animate frames
    //we just dont want it to animate past last death frame
    if(!this.dead){
      this.animateSprite();
    }

    //If statements to control that they attack depending on the direction they are facing
    //offset is for direction
    if (this.velocity.x > 0){
      this.attackBox.atkoffset.x = 0;
    }
    else if(this.velocity.x < 0){
      this.attackBox.atkoffset.x = -1 * this.attackBox.width; // offset is just x axis displacement, no confuse 
    }
    this.attackBox.position.x = this.position.x + this.attackBox.atkoffset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.atkoffset.y;

    //commenting out this code that checks attack range, okay naman ung range for now
    //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

    //IF conditionals to help with left screen and top screen and right screen
    if(this.position.x + this.velocity.x >= 0 && this.position.x + this.velocity.x <= 1750){ //this num because 1800 - size of character
      this.position.x += this.velocity.x;
    }
    if(this.position.y + this.velocity.y <= 0){
      this.position.y += this.velocity.y;
      this.velocity.y += 10;
      this.health -= 2;

    }
    else{
      this.position.y += this.velocity.y;
    }
    
    
    if(this.position.y + this.height + this.velocity.y >= canvas.height - 150){
      this.velocity.y = 0;
    }
    else{
      this.velocity.y += gravity;
    }
    
  }
  //maybe can do similar func for jump?
  attack() {
    if (this.attackBox.atkoffset.x === 0){ // if it's 0 it's going to the right
      this.switchSprite('attack1');
      this.isAttacking = true;
    }
    else if(this.attackBox.atkoffset.x < 0) {// if negative going to the left
      this.switchSprite('leftAttack');
      this.isAttacking = true;
    }

  }

  switchSprite(sprite) {
    //death override
    if(this.image === this.sprites.death.image){ 
      if(this.currentFrame === this.sprites.death.framesMax-1){
        this.dead = true;
      }
      return;
    }
    //animation override for hits
    if(this.image === this.sprites.attack1.image && this.currentFrame < this.sprites.attack1.framesMax -1 && sprite != 'death') { //2nd conditional to prevent animation loop, 3rd condition to prevent attack animation during death
      return;
    }
    else if(this.image === this.sprites.leftAttack.image && this.currentFrame < this.sprites.leftAttack.framesMax -1 && sprite != 'death') { //2nd conditional to prevent animation loop, 3rd condition to prevent attack animation during death
      return;
    }
    //animation override for getting hit
    // might want to change this 
    else if (this.image === this.sprites.takeHit.image && this.currentFrame< this.sprites.takeHit.framesMax - 1 && sprite != 'death'){
      return;
    }
    else if (this.image === this.sprites.leftTakeHit.image && this.currentFrame< this.sprites.leftTakeHit.framesMax - 1 && sprite != 'death'){
      return;
    }
    else{
      switch(sprite){
        case 'idle':
          if(this.image !== this.sprites.idle.image){
            this.framesMax = this.sprites.idle.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.idle.image;
          }
          break
        case 'run':
          if(this.image !== this.sprites.run.image){
            this.framesMax = this.sprites.run.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.run.image;
          }
          break
        case 'jump':
          if(this.image !== this.sprites.jump.image){
            this.framesMax = this.sprites.jump.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.jump.image;
          }
          break
        case 'fall':
          if(this.image !== this.sprites.fall.image){
            this.framesMax = this.sprites.fall.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.fall.image;
          }
          break
        case 'attack1':
          if(this.image !== this.sprites.attack1.image){
            this.framesMax = this.sprites.attack1.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.attack1.image;
          }
          break
        case 'leftAttack':
          if(this.image !== this.sprites.leftAttack.image){
            this.framesMax = this.sprites.leftAttack.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.leftAttack.image;
          }
          break
        case 'leftRun':
          if(this.image !== this.sprites.leftRun.image){
            this.framesMax = this.sprites.leftRun.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.leftRun.image;
          }
          break
        case 'leftJump':
          if(this.image !== this.sprites.leftJump.image){
            this.framesMax = this.sprites.leftJump.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.leftJump.image;
          }
          break
        case 'leftIdle':
          if(this.image !== this.sprites.leftIdle.image){
            this.framesMax = this.sprites.leftIdle.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.leftIdle.image;
          }
          break
        case 'takeHit':
          if(this.image !== this.sprites.takeHit.image){
            this.framesMax = this.sprites.takeHit.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.takeHit.image;
          }
          break
        case 'leftFall':
          if(this.image !== this.sprites.leftFall.image){
            this.framesMax = this.sprites.leftFall.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.leftFall.image;
          }
          break
        case 'leftTakeHit':
          if(this.image !== this.sprites.leftTakeHit.image){
            this.framesMax = this.sprites.leftTakeHit.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.leftTakeHit.image;
          }
          break
        case 'death':
          if(this.image !== this.sprites.death.image){
            this.framesMax = this.sprites.death.framesMax;
            this.currentFrame = 0;
            this.image = this.sprites.death.image;
          }
          break
      }
    }
    
  }
}