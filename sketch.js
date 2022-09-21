var trex, trex_running;
var solo,soloImg, soloInvisivel;
var nuvem, nuvemImg;
var obstaculo1, obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6,obstaculo;
var pontuacao = 0;
var PLAY = 1;
var END = 0;
var estadoJogo = PLAY;
var grupoNuvens, grupoObstaculos;
var gameOverImg, gameOver, restartImg, restart;
var trexColisao;
var jumpSound, dieSound, checkpointSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  soloImg = loadAnimation("ground2.png");
  nuvemImg = loadAnimation("cloud.png");
  obstaculo1 = loadAnimation("obstacle1.png");
  obstaculo2 = loadAnimation("obstacle2.png");
  obstaculo3 = loadAnimation("obstacle3.png");
  obstaculo4 = loadAnimation("obstacle4.png");
  obstaculo5 = loadAnimation("obstacle5.png");
  obstaculo6 = loadAnimation("obstacle6.png");
  gameOverImg = loadAnimation("gameOver.png");
  restartImg = loadAnimation("restart.png");
  trexColisao = loadAnimation("trex_collided.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("correndo",trex_running);
  trex.addAnimation("colisao",trexColisao);
  trex.scale = 0.5;

  //solo
  solo = createSprite(width/2,height-20,width,20);
  solo.addAnimation("solo",soloImg);
  solo.velocityX = -2;

  //solo invisivel
  soloInvisivel = createSprite(width/2,height-10,width,20);
  soloInvisivel.visible = false;

  //grupos
  grupoNuvens = new Group();
  grupoObstaculos = new Group();

  gameOver = createSprite(width/2,height/2);
  gameOver.addAnimation("gameOver",gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(width/2,height/2 + 30);
  restart.addAnimation("restart",restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  //var numero = Math.round(random(1,100));
  //console.log(numero);
  //trex.debug = true;
  trex.setCollider("circle",0,0,35);
}

function draw(){
  background("white");
  textSize(16);
  text("Pontuação: "+ pontuacao,width/2,80);
  trex.collide(soloInvisivel);
  
  if(estadoJogo == PLAY){
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    solo.velocityX = -(2 + 3*pontuacao/1000);
    console.log(trex.y);
    if((keyDown("space") || touches.length > 0) && trex.y >= height - 50){
      jumpSound.play();
      trex.velocityY = -10;
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.5;
    if(solo.x<width/2){
      solo.x = solo.width/2;
    }
    gerarNuvens();
    gerarObstaculos();

    if(pontuacao > 0 && pontuacao%1000 == 0){
      checkpointSound.play();
    }

    if(grupoObstaculos.isTouching(trex)){
      dieSound.play();
      estadoJogo = END;
    }
  }else
  if(estadoJogo == END){
    trex.changeAnimation("colisao");
    solo.velocityX = 0;
    trex.velocityY = 0;
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  drawSprites();
}

function gerarNuvens(){
  if(frameCount%60 == 0){
    nuvem = createSprite(width,200,40,10);
    nuvem.addAnimation("nuvem",nuvemImg);
    nuvem.y = Math.round(random(10,200));
    nuvem.scale = 0.4;
    nuvem.velocityX = -3;
    //console.log("TREX: "+ trex.depth);
    //console.log("NUVEM: " + nuvem.depth);

    //ajustar as camadas
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //atribuir um tempo de vida para a nuvem
    nuvem.lifetime = width;
    grupoNuvens.add(nuvem);
  }
  
}

function gerarObstaculos(){
  if(frameCount%60 == 0){
    obstaculo = createSprite(width,height-30,10,40);
    obstaculo.velocityX = -(3 + pontuacao/1000);

    var numero = Math.round(random(1,6));
    switch(numero){
      case 1: obstaculo.addAnimation("cacto1",obstaculo1);
      break;
      case 2: obstaculo.addAnimation("cacto2",obstaculo2);
      break;
      case 3: obstaculo.addAnimation("cacto3",obstaculo3);
      break;
      case 4: obstaculo.addAnimation("cacto4",obstaculo4);
      break;
      case 5: obstaculo.addAnimation("cacto5",obstaculo5);
      break;
      case 6: obstaculo.addAnimation("cacto6",obstaculo6);
      break;
      default:break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width;
    grupoObstaculos.add(obstaculo);
  }
}

function reset(){
  estadoJogo = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  trex.changeAnimation("correndo");
  pontuacao = 0;

}
