//liberies
//sprite : https://molleindustria.github.io/p5.play/docs/classes/Sprite.html
//p5 : https://p5js.org/reference/#/p5/text

//declaring varibles
var trex, trexAnimation, trexCollided;
var ground, groundImage;
var isvisibleGround;
var clouds, cloudImage;
var obstacles,
  obstacleImage1,
  obstacleImage2,
  obstacleImage3,
  obstacleImage4,
  obstacleImage5,
  obstacleImage6;
var play = 0;
var end = 1;
var cloudsGroup, ObstaclesGroup;
var score = 0
var gameOver, gameOverImage
var restart, restartImage
var checkpoint
var die
var jump

var gamestate = play;
localStorage["HighestScore"] = 0


//used to upload assets
function preload() {
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  trexCollided = loadAnimation("trex_collided.png")
  checkpoint = loadSound("checkpoint.mp3")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
}
//used to create objects one time
function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(windowWidth)
  console.log(windowHeight)
  console.log(width / 2)
  console.log(height / 2)
  trex = createSprite(30, height - 40, 50, 50);
  trex.addAnimation("trex", trexAnimation);
  trex.addAnimation("collided", trexCollided)
  trex.scale = 0.4;

  ground = createSprite(300, height - 40, width, 10);
  ground.addImage("floor", groundImage);

  isvisibleGround = createSprite(300, height - 35, width, 10);
  isvisibleGround.visible = false;

  gameOver = createSprite(width / 2 - 100, height / 2 + 60)
  gameOver.scale = 0.7
  gameOver.addImage("GameOver", gameOverImage)

  restart = createSprite(width / 2 - 100, height / 2 + 100)
  restart.scale = 0.3
  restart.addImage("restartButton", restartImage)

  // creating group
  cloudsGroup = new Group();
  ObstaclesGroup = new Group();
  //trex.setCollider("rectangle",0,0,120,100)
  trex.setCollider("circle", 0, 0, 40)
}
//used to display and hive instructions to objects multiple times

function draw() {
  background("black");
  drawSprites();

  if (gamestate === play) {
    gameOver.visible = false
    restart.visible = false
    ground.velocityX = -(4 + score / 1000);
    createClouds();
    createObstacles();
    //score = score + Math.round(frameCount % 10 === 0)
    score = score + Math.round(frameCount / 190)
    if (keyDown("space") && trex.y >= height - 120) {
      trex.velocityY = -7;
      jump.play()
    } else if (keyDown("up") && trex.y >= height - 120) {
      trex.velocityY = -7;
      jump.play()
    }
    else if (touches.length > 0 && trex.y >= height - 120) {
      trex.velocityY = -7;
      jump.play()
      touches = []
    }
    //infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //gravity to trex
    trex.velocityY = trex.velocityY + 0.5;
    // switching to end state
    if (ObstaclesGroup.isTouching(trex)) {
      trex.changeAnimation("collided", trexCollided)
      gamestate = end;
      die.play()
    }
    if (score % 300 === 0 && score > 0) {
      checkpoint.play()

    }
  } else if (gamestate === end) {
    ground.velocityX = 0;
    trex.velocityY = 0;

    gameOver.visible = true
    restart.visible = true

    cloudsGroup.setVelocityXEach(0)
    ObstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setLifetimeEach(-1)
    ObstaclesGroup.setLifetimeEach(-1)

    if (touches.length > 0 || mousePressedOver(restart)) {
      restartGame()
      touches = []
    }
  }
  //collide
  trex.collide(isvisibleGround);
  text("Score: " + score, width / 2 - 500, height / 2 + 100)
  text("Highest Score:  " + localStorage["HighestScore"], width / 2 - 500, height / 2 + 80)
  //check y position
  //console.log(trex.y)
  //check frame count
  //console.log("frame count"+ frameCount)
  //console.log(Math.round(random(100,200)))
  //console.log(Math.ceil(8.99))
  //console.log("trex depth is:" + trex.depth);
  //console.log("clouds depth is:" + clouds.depth);

  text(mouseX + "," + mouseY, mouseX, mouseY);
  //calling userdefined function
}

function createClouds() {
  if (frameCount % 150 === 0) {
    clouds = createSprite(width + 50, 35, 100, 10);
    clouds.addImage("cloud", cloudImage);
    clouds.scale = Math.random(0.4, 0.5);
    clouds.velocityX = -1;
    clouds.y = Math.round(random(35, height - 200));

    trex.depth = clouds.depth;
    trex.depth += 1;


    //lifetime= distance/speed
    //clouds.lifetime= 590/2 =295

    clouds.lifetime = (width + 50) / 2;

    cloudsGroup.add(clouds);
  }
}

function createObstacles() {
  if (frameCount % 60 === 0) {
    obstacles = createSprite(width + 50, height - 50, 10, 80);
    obstacles.velocityX = -(4 + score / 1000);
    obstacles.lifetime = (width + 50) / 4;
    obstacles.scale = 0.4;
    var number = Math.round(random(1, 6));
    ObstaclesGroup.add(obstacles);

    switch (number) {
      case 1:
        obstacles.addImage(obstacleImage1);
        break;
      case 2:
        obstacles.addImage(obstacleImage2);
        break;
      case 3:
        obstacles.addImage(obstacleImage3);
        break;
      case 4:
        obstacles.addImage(obstacleImage4);
        break;
      case 5:
        obstacles.addImage(obstacleImage5);
        break;
      case 6:
        obstacles.addImage(obstacleImage6);
        break;
      default:
        break;
    }
  }

  //   if(frameCount % 200 === 0){
  //  obstacles.velocityX -= 1
  //   }
}


function restartGame() {
  trex.changeAnimation("trex", trexAnimation)
  ObstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  gamestate = play
  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score
  }
  score = 0
}

// var number=[[1,2],[3,4],[5,6]]
// console.log(number.length)
// console.log(number[1][0])


