const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit, rope;
var rope2;
var rope3;
var fruit_con;
var fruit_con2;
var fruit_con3;

var bg_img;
var food;
var rabbit;
var button;
var button2;
var button3;
var rabbit_sprite;

var fruitIsntEated = true;
var ropeIsCut = false;
var rope2IsCut = false;
var rope3IsCut = false;
var executedAnimation = false;
var checkedDistance = false;
var EatFruit = false;

function preload() {
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  sad.looping = false;
  eat.looping = false;
}

function setup() {


//android e apple
var celular = /iPhone|Android|iPad/i.test(navigator.userAgent)
if(celular)
{
  canW = displayWidth;
  canH = displayHeight;

  createCanvas(displayWidth+50, displayHeight);
}else{
  createCanvas(500, 700);
}

  
  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200, 680, 600, 20);

  //ropes
  rope = new Rope(7, { x: 245, y: 30 });
  rope2 = new Rope(10, {x:450, y: 30});
  rope3 = new Rope(10, {x:50, y: 30});
 
  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  //links
  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);
  

  

  rabbit_sprite = createSprite(450, 630, 20, 20);
  rabbit_sprite.addAnimation("rabbit_animation", rabbit);
  rabbit_sprite.scale = 0.2;
  rabbit_sprite.addAnimation("rabbit_blink", blink);
  rabbit_sprite.addAnimation("rabbit_eat", eat);
  rabbit_sprite.addAnimation("rabbit_sad", sad);

  //botões
  button = createImg("cut_button.png");
  button.position(200, 30);
  button.size(50, 50)
  button.mouseClicked(drop); 

  button2 = createImg("cut_button.png");
  button2.position(390,30);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("cut_button.png");
  button3.position(10,30);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  air_fruit = createImg("air-removebg-preview.png");
  air_fruit.position(0,320);
  air_fruit.size(100,200);
  air_fruit.mouseClicked(airing_fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);
}

function draw() {
  background(51);

  image(bg_img, width / 2, height / 2, 490, 690);

  if(!EatFruit){
  image(food, fruit.position.x, fruit.position.y, 70, 70);
  }

  //show elements
  rope.show();
  rope2.show();
  rope3.show();
  
  
  
  Engine.update(engine);
  ground.show();
 
 
  if (ropeIsCut && rope2IsCut && rope3IsCut) {
    ropeIsCut = false;
    setTimeout(() => {
      var distance = checkCollision(fruit, rabbit_sprite);
      if (distance < 50 && !checkedDistance) {
        fruitIsntEated = false;
        checkedDistance = false;
        EatFruit = true;
      }
      if (fruitIsntEated && !executedAnimation) {
        executedAnimation = true;
        rabbit_sprite.changeAnimation("rabbit_sad");
      } else if (!executedAnimation){
        executedAnimation = true;
        rabbit_sprite.changeAnimation("rabbit_eat");
      }
    }, 1000)

  }
  drawSprites();
}

function drop() {
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  ropeIsCut = true;
}

function drop2(){
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
  rope2IsCut = true;
}

function drop3(){
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
  rope3IsCut = true;
}

function checkCollision(object, sprite) {
  var d = dist(object.position.x, object.position.y, sprite.x, sprite.y);
  console.log(object.position.x, object.position.y, sprite.x, sprite.y);
  console.log(d);
  return d;
}

//exemplo
/*function remove_fruit()
{
  if(body!=null)
  {
    var d = dist(body.position.x, body.position.y, sprite.x, sprite.y);
    if(d <= 50 )
    {
      World.remove(engine.world, fruit);
      fruit = null
      return true;
    }else{
      return false
    }
  }
}*/

function airing_fruit(){
  Body.applyForce(fruit,{x:0,y:0},{x:0.02,y:0})
}