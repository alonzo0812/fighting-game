const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
/*
THINGS TO ADD:
1. opposite sprites priority - DONE

1.Player 2 is randomly winning - DONE
3. jump cooldowns / distance mechanic basically 
4. Restart screen or reset after a bit


1. down attack
2. dashes?
3. character select screen
4. diff abilities
5. organize js files
*/
//Tried doing in CSS but px values do not match and it's hard to estimate
canvas.width = 1800;
canvas.height = 900;

c.fillRect(0,0,canvas.width,canvas.height);

//changable speed for gravity
const gravity = 0.4;

//initializing animations
const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc: './assets/background.jpg'
})
// initializing the player and enemy
const player = new Fighter({
  position: {
    x: 50,
    y: 1 //changed to 1 because he takes roof damage at spawn LMAO
  },
  velocity: {
    x:0,
    y:0,
  },
  attackBox: {
    atkoffset: {
      x: 0,
      y: 0,
    },
    width: 245,
    height: 110
  },
  color: 'blue',
  imageSrc: './assets/King/Sprites/Idle.png',
  scale: 3.5,
  framesMax: 8,
  offset: {
    x: 275,
    y: 220
  },
  sprites: {
    idle: {
      imageSrc: './assets/King/Sprites/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './assets/King/Sprites/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './assets/King/Sprites/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './assets/King/Sprites/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './assets/King/Sprites/Attack1.png',
      framesMax: 4
    },
    leftAttack: {
      imageSrc: './assets/King/Sprites/leftAttack.png',
      framesMax: 4
    },
    leftRun: {
      imageSrc: './assets/King/Sprites/leftRun.png',
      framesMax: 8
    },
    leftJump: {
      imageSrc: './assets/King/Sprites/leftJump.png',
      framesMax: 2
    },
    leftIdle: {
      imageSrc: './assets/King/Sprites/leftIdle.png',
      framesMax: 8
    },
    leftFall: {
      imageSrc: './assets/King/Sprites/leftFall.png',
      framesMax: 2
    },
    leftTakeHit: {
      imageSrc: './assets/King/Sprites/leftTakeHit.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './assets/King/Sprites/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './assets/King/Sprites/Death.png',
      framesMax: 6
    },
  }
});


const enemy = new Fighter({
  position: {
    x: 1700,
    y: 100
  },
  velocity: {
    x:0,
    y:0,
  },
  attackBox: {
    atkoffset: {
      x: 0,
      y: -70
    },
    width: 140,
    height: 210
  },
  color: 'red',
  imageSrc: './assets/Hero/Sprites/Idle.png',
  scale: 3.5,
  framesMax: 11,
  offset: {
    x: 320,
    y: 250
  },
  sprites: {
    idle: {
      imageSrc: './assets/Hero/Sprites/Idle.png',
      framesMax: 11
    },
    run: {
      imageSrc: './assets/Hero/Sprites/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './assets/Hero/Sprites/Jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './assets/Hero/Sprites/Fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './assets/Hero/Sprites/Attack1.png',
      framesMax: 7
    },
    leftAttack: {
      imageSrc: './assets/Hero/Sprites/leftAttack.png',
      framesMax: 7
    },
    leftRun: {
      imageSrc: './assets/Hero/Sprites/leftRun.png',
      framesMax: 8
    },
    leftJump: {
      imageSrc: './assets/Hero/Sprites/leftJump.png',
      framesMax: 3
    },
    leftIdle: {
      imageSrc: './assets/Hero/Sprites/leftIdle.png',
      framesMax: 11
    },
    leftFall: {
      imageSrc: './assets/Hero/Sprites/leftFall.png',
      framesMax: 3
    },
    leftTakeHit: {
      imageSrc: './assets/Hero/Sprites/leftTakeHit.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './assets/Hero/Sprites/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './assets/Hero/Sprites/Death.png',
      framesMax: 11
    },
  }
});

//An array of objects used for the x axis keys
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
  },
}

//Collision fuction
function rectangularCollision({
  rectangle1,
  rectangle2
}){
  return ( 
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position .y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height

  )
}
//WIN CHECKER
function checkWin({player, enemy, timerID}){

  if(player.health === enemy.health){
    document.querySelector('#end-screen').innerHTML = 'TIE';
    player.health = 0;
    enemy.health = 0;
    player.switchSprite('death');
    enemy.switchSprite('death');
  }
  else if (player.health > enemy.health){
    document.querySelector('#end-screen').innerHTML = 'PLAYER 1 WIN';
    enemy.health = 0;
    enemy.switchSprite('death');
  }
  else {
    document.querySelector('#end-screen').innerHTML = 'PLAYER 2 WIN';
    player.health = 0;
    player.switchSprite('death');
  }
  clearTimeout(timerID);
  document.querySelector('#end-screen').style.opacity = 1;
}

//Function to decrease time while the game is on going
let timer = 62;
let timerID; //To prevent ongoing timer on hp 0
function decreaseTimer(){
  if(timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer -= 1;
    document.querySelector('#timer').innerHTML = timer;
  }
  else{
    checkWin({player, enemy, timerID});
  }
}

decreaseTimer();

//Main function that animates the sprites fighting
function animate(){
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0,0,canvas.width,canvas.height);
  background.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player horizontal movement
  if(keys.a.pressed && keys.d.pressed){
    player.velocity.x = 0;
    player.switchSprite('idle');
  }
  else if (keys.a.pressed && player.extraKey === true) {
    player.velocity.x = -4;
    player.switchSprite('leftRun');
  }
  else if (keys.d.pressed && player.extraKey === true) {
    player.velocity.x = 4;
    player.switchSprite('run');
  }
  else if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -4;
    player.switchSprite('leftRun');
  }
  else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 4;
    player.switchSprite('run');
  }
  else if (player.image !== player.sprites.death.image && player.lastKey === 'd'){
    player.switchSprite('idle');
  }
  else if (player.image !== player.sprites.death.image && player.lastKey === 'a'){
    player.switchSprite('leftIdle');
  }
  // player vertical movement
  if(player.velocity.y<0 && player.lastKey === 'd'){
    player.switchSprite('jump');
  }
  else if(player.velocity.y<0 && player.lastKey === 'a'){
    player.switchSprite('leftJump');
  }
  else if (player.velocity.y > 0 && player.lastKey === 'd'){
    player.switchSprite('fall');
  }
  else if (player.velocity.y > 0 && player.lastKey === 'a'){
    player.switchSprite('leftFall');
  }


  // enemy horizontal movement
  
  if(keys.ArrowLeft.pressed && keys.ArrowRight.pressed){
    enemy.velocity.x = 0;
    enemy.switchSprite('idle');
  }
  else if (keys.ArrowLeft.pressed && enemy.extraKey === true) {
    enemy.velocity.x = -3;
    enemy.switchSprite('leftRun');
  }
  else if (keys.ArrowRight.pressed && enemy.extraKey === true) {
    enemy.velocity.x = 3;
    enemy.switchSprite('run');
  }
  else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -3;
    enemy.switchSprite('leftRun');
  }
  else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 3;
    enemy.switchSprite('run');
  }
  else if (enemy.image !== enemy.sprites.death.image && enemy.lastKey === 'ArrowRight'){
    enemy.switchSprite('idle');
  }
  else if (enemy.image !== enemy.sprites.death.image && enemy.lastKey === 'ArrowLeft'){
    enemy.switchSprite('leftIdle');
  }
  //enemy vertical movement
  if(enemy.velocity.y<0 && enemy.lastKey === 'ArrowRight'){
    enemy.switchSprite('jump');
  }
  else if(enemy.velocity.y<0 && enemy.lastKey === 'ArrowLeft'){
    enemy.switchSprite('leftJump');
  }
  else if (enemy.velocity.y > 0 && enemy.lastKey === 'ArrowRight'){
    enemy.switchSprite('fall');
  }
  else if (enemy.velocity.y > 0 && enemy.lastKey === 'ArrowLeft'){
    enemy.switchSprite('leftFall');
  }



  //Collision Detection & animation on hits
  if ( rectangularCollision({rectangle1: player,rectangle2: enemy}) && player.isAttacking && player.currentFrame === 0){
    //console.log("collision");
    player.isAttacking = false;

    //This can be a function inside our class ata yeah
    
    enemy.health -= 4;
    if(enemy.health <= 0) {
      enemy.switchSprite('death');
    }
    else if(enemy.lastKey === 'ArrowRight'){
      enemy.switchSprite('takeHit');
    }
    else if(enemy.lastKey === 'ArrowLeft'){
      enemy.switchSprite('leftTakeHit');
    }
    //This can be a function inside our class ata yeah
  }
  //Placed it here so that "fall damage" is updated
  //document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  gsap.to('#enemyHealth', {
    width: enemy.health + '%'
  })
  if ( rectangularCollision({rectangle1: enemy,rectangle2: player}) && enemy.isAttacking && enemy.currentFrame === 0){
    //console.log("collision");
    enemy.isAttacking = false;

    //This can be a function inside our class ata yeah
    
    player.health -= 6;
    if(player.health <= 0) {
      player.switchSprite('death');
    }
    else if(player.lastKey === 'd'){
      player.switchSprite('takeHit');
    }
    else if(player.lastKey === 'a'){
      player.switchSprite('playerTakeHit');
    }
    //This can be a function inside our class ata yeah
  }
  //Placed it here so that "fall damage" is updated
  //document.querySelector('#playerHealth').style.width = player.health + '%';
  gsap.to('#playerHealth', {
    width: player.health + '%'
  })

  //Missing attacks
  if(player.isAttacking && player.currentFrame === 2){
    player.isAttacking = false;
  }
  if(enemy.isAttacking && enemy.currentFrame === 4){
    enemy.isAttacking = false;
  }

  // GAME OVER CHECKER
  if(player.health <=0 || enemy.health <=0) {
    checkWin({player, enemy, timerID});
  }
}


animate();

//Event Listener for Key downs
window.addEventListener('keydown', (event) => {
  //Player Keys
  if(!(player.image === player.sprites.death.image)){
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break
      case 'w':
        player.velocity.y = -10;
        break
      case ' ':
        player.attack()
        break
    }
  }
  
  if(!(enemy.image === enemy.sprites.death.image)){ //cant use this.dead bcs masisira kailangan upon first death frame cant move
    switch(event.key){
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break
      case 'ArrowUp':
        enemy.velocity.y = -10;
        break
      case 'Enter':
        enemy.attack();
        break
    }
  }
    //Enemy Keys
    
})

//Event Listener for Key up events, Extra Key is for the case of pressing A D letting go of D and A moving still. Last Key is to prevent overrides
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      if(keys.d.pressed && keys.a.pressed){
        player.extraKey = true;
      }
      keys.d.pressed = false;
      break
    case 'a':
      if(keys.d.pressed && keys.a.pressed){
        player.extraKey = true;
      }
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case 'ArrowRight':
      if(keys.ArrowRight.pressed && keys.ArrowLeft.pressed){
        enemy.extraKey = true;
      }
      keys.ArrowRight.pressed = false;
      break
    case 'ArrowLeft':
      if(keys.ArrowRight.pressed && keys.ArrowLeft.pressed){
        enemy.extraKey = true;
      }
      keys.ArrowLeft.pressed = false;
      break;
  }
})


//functions for post game
function revealHeader(){
  if(document.getElementById("header").style.opacity === "0"){
    document.getElementById("header").style.opacity = "1";
  }
  else{
    document.getElementById("header").style.opacity = "0";
  }
}
function revealFooter(){
  if(document.getElementById("footer").style.opacity === "0"){
    document.getElementById("footer").style.opacity = "1";
  }
  else{
    document.getElementById("footer").style.opacity = "0";
  }
}