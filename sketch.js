var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var obstacleTop, obsTop1, obsTop2
var obstacleBottom, obsBottom1, obsBottom2, obsBottom3
var gameOver, gameOverImg
var restart, restartImg

var score = 0;

//estados do jogo     
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  bgImg = loadImage("assets/sky.jpg")

  balloonImg = loadAnimation("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png")

  obsTop1 = loadImage("assets/obsTop1.png")
  obsTop2 = loadImage("assets/obsTop2.png")

  obsBottom1 = loadImage("assets/obsBottom1.png")
  obsBottom2 = loadImage("assets/obsBottom2.png")
  obsBottom3 = loadImage("assets/obsBottom3.png")

  gameOverImg = loadImage("assets/gameOver.png")
  restartImg = loadImage("assets/restart.png")

}

function setup() {

  createCanvas(windowWidth / 2, windowHeight - 20)
  //imagem de fundo
  bg = createSprite(width / 2, height / 2);
  bg.addImage(bgImg);
  bg.scale = 0.5
  bg.velocityX = -1


  //criar solos superiores e inferiores
  bottomGround = createSprite(200, height - 10, 800, 20);
  bottomGround.visible = false;

  topGround = createSprite(200, 10, 800, 20);
  topGround.visible = false;

  //criar o balão      
  balloon = createSprite(100, 200, 20, 50);
  balloon.addAnimation("balloon", balloonImg);
  balloon.scale = 0.3 ;
  balloon.debug = false;

  //inicializar os grupos
  topObstaclesGroup = new Group();
  bottomObstaclesGroup = new Group();
  barGroup = new Group();

  //criar sprites game over (fim de jogo) e restart (reiniciar)
  gameOver = createSprite(220, 200);
  restart = createSprite(220, 240);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart.addImage(restartImg);
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
}

function draw() {

  background("black");



  if (gameState === PLAY) {

    //faça o balão de ar quente pular
    if (keyDown("space")) {
      balloon.velocityY = -15;

    }

    //adicione gravidade
    balloon.velocityY = balloon.velocityY + 2;


    Bar();

    //gerar obstáculos superiores e inferiores
    spawnObstaclesTop();
    spawnObstaclesBottom();

    //condição para o estado END (FIM)
    if (topObstaclesGroup.isTouching(balloon) || balloon.isTouching(topGround)
      || balloon.isTouching(bottomGround) || bottomObstaclesGroup.isTouching(balloon)) {

       gameState = END;

    }
  }

  if (gameState === END) {
    gameOver.visible = true;
    gameOver.depth = gameOver.depth + 1
    restart.visible = true;
    restart.depth = restart.depth + 1

    //todos os sprites devem parar de se mover no estado END (FIM)
    balloon.velocityX = 0;
    balloon.velocityY = 0;
    topObstaclesGroup.setVelocityXEach(0);
    bottomObstaclesGroup.setVelocityXEach(0);
    barGroup.setVelocityXEach(0);

    //definindo o tempo de vida como -1 para que os obstáculos não desapareçam no estado END (FIM)
    topObstaclesGroup.setLifetimeEach(-1);
    bottomObstaclesGroup.setLifetimeEach(-1);

    balloon.y = 200;

    bg.velocityX = 0

    //reiniciando o jogo
    if (mousePressedOver(restart)) {
      reset();
    }

  }

  drawSprites();
  Score();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  topObstaclesGroup.destroyEach();
  bottomObstaclesGroup.destroyEach();

  score = 0;
}


function spawnObstaclesTop() {
  intervals = [50,150,250,350]
  interval = random(intervals)
  if (World.frameCount % interval === 0) {
    obstacleTop = createSprite(width+20, 50, 40, 50);

    obstacleTop.velocityX = -4;

    //posições y aleatórias para os principais obstáculos
    obstacleTop.y = Math.round(random(50, height/2-150));

    //gerar obstáculos superiores aleatórios
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: 
        obstacleTop.addImage(obsTop1);
        obstacleTop.scale = 0.2;
        break;
      case 2: 
        obstacleTop.addImage(obsTop2);
        obstacleTop.scale = 0.1;
        break;
      default: break;
    }

    //atribuir tempo de vida à variável
    obstacleTop.lifetime = width/4+20;

    balloon.depth = balloon.depth + 1;

    topObstaclesGroup.add(obstacleTop);

  }
}

function spawnObstaclesBottom() {
  intervals = [100,150,200,250]
  interval = random(intervals)

  if (World.frameCount % interval === 0) {
    obstacleBottom = createSprite(width+10, height-100, 40, 50);

    obstacleBottom.addImage(obsBottom1);
    obstacleBottom.debug = false

    //obstacleBottom.scale = 0.07;
    obstacleBottom.velocityX = -4;



    //gerar obstáculos inferiores aleatórios
    var rand = Math.round(random(1, 3));
    //var rand = 1
    switch (rand) {
      case 1: 
        obstacleBottom.addImage(obsBottom1);
        obstacleBottom.scale = 0.2;
        obstacleBottom.y = height - 180
        break;
      case 2: 
        obstacleBottom.addImage(obsBottom2);
        obstacleBottom.scale = 0.15;
        obstacleBottom.y = height - 130
        break;
      case 3: 
        obstacleBottom.addImage(obsBottom3);
        obstacleBottom.scale = 0.25;
        obstacleBottom.y = height - 220
        break;
      default: break;
    }

    //atribuir tempo de vida à variável
    obstacleBottom.lifetime = width/4+20;

    balloon.depth = balloon.depth + 1;

    bottomObstaclesGroup.add(obstacleBottom);

  }
}

function Bar() {
  if (World.frameCount % 60 === 0) {
    var bar = createSprite(400, 200, 10, 800);
    bar.velocityX = -6


    bar.velocityX = -6
    bar.depth = balloon.depth;
    bar.lifetime = 70;
    bar.visible = false;

    barGroup.add(bar);
  }
}

function Score() {
  if (balloon.isTouching(barGroup)) {
    barGroup.destroyEach()
    score = score + 1;
  }
  textFont("algerian");
  textSize(30);
  fill("green");
  text("Pontuação: " + score, width-300, 50);


}


