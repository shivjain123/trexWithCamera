var trex, trexRunning, trexCollided
var ground, invisibleGround, groundImage
var ground2, invisibleGround2;
var CloudsGroup, cloudImage
var ObstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6

var score = 0

var PLAY = 1
var END = 0
var gameState = PLAY

var gameOver, gameOverImage
var restart, restartImage;

var dist;
var flag = 0;

function preload() {
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth - 20, windowHeight);

  //create a trex sprite
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trexRunning);

  //scale the trex
  trex.scale = 0.5;
  trex.addAnimation("collided", trexCollided);

  //set collision radius for the trex
  //trex.setCollider("rectangle",0,0,50, trex.height);
  //trex.debug = true;
  
  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2;

  ground2 = createSprite(200, 180, 400, 20);
  ground2.addImage("ground", groundImage);
  ground2.x = ground.width + ground.width/2

  //invisible Ground to support trex
  invisibleGround = createSprite(ground.x, 190, ground.width, 10);
  invisibleGround.visible = false;

  invisibleGround2 = createSprite(ground.x, 190, ground.width, 10);
  invisibleGround2.visible = false;

  ObstaclesGroup = new Group();
  CloudsGroup = new Group();

  dist = ground.width;

  //place gameOver and restart icon on the screen
  gameOver = createSprite(1000,250);
    gameOver.addImage("gameover", gameOverImage);
    gameOver.scale = 0.6;
  
  restart = createSprite(1000,280);
    restart.addImage("restart", restartImage);
    restart.scale = 0.6;

    gameOver.visible = false;
    restart.visible = false;

    score = 0;
  
  //set text
  textSize(26);
  textFont("Georgia");
  fill("blue");
  //textStyle(BOLD);
}

function draw() {

  //set background to white
  background("white");

  if(gameState === PLAY){

  trex.velocityX = 5;
    
  //update the score
  score = score + Math.round(getFrameRate() / 60);

  //display score
  text("Score : " + score, trex.x + 350, 40);

  //jump when the space key is pressed
  if (keyDown("space") && trex.y >= 162) {
    trex.velocityY = -18;
  }
  console.log(trex.y)

  //add gravity
  trex.velocityY = trex.velocityY + 0.7;


  camera.position.x = trex.x + 600;

  if(trex.x >= dist - displayWidth){
    if(flag == 0){
      ground2.x = dist + ground.width/2
      invisibleGround2.x = ground2.x;
      flag = 1;
    }
    else{
      ground.x = dist + ground.width/2;
      invisibleGround.x = ground.x;
      flag = 0;
    }
    dist += ground.width;
  }

  //spawn the clouds
  spawnClouds();

  //spawn obstacles
  spawnObstacles();
    
  //End the game when trex is touching the obstacle
    if(trex.isTouching(ObstaclesGroup)){
      gameState = END;
    }
  }
  else if(gameState === END) {
    
    gameOver.x = trex.x + 200;
    restart.x = trex.x + 200;

    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0

    trex.velocityX = 0;
    trex.velocityY = 0;

    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.addAnimation("collided", trexCollided);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);

  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
    
  //stop trex from falling down
  trex.collide(invisibleGround);
  trex.collide(invisibleGround2);
  
  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trexRunning);
  
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {
    var obstacle = createSprite(trex.x + displayWidth - 100, 165, 10, 40);
    //obstacle.velocityX = -(6 + score / 100);

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth/trex.velocityX + 30;
    
    //obstacle.debug = true;
    
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //add each obstacle to the group
    obstacle.addToGroup(ObstaclesGroup);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(trex.x + displayWidth - 100, 120, 40, 10);
    cloud.y = Math.round(random(50, 110));
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.6;
    //cloud.velocityX = -3;
    // cloud.debug = true;

    //assign lifetime to the variable
    cloud.lifetime = displayWidth/trex.velocityX + 30;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloud.addToGroup(CloudsGroup);
  }

}