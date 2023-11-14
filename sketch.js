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
var fruit_con;

var bg_img;
var food;
var rabbit;
var button;
var rabbit_sprite;

var fruitIsntEated = true;
var ropeIsCut = false;
var executedAnimation = false;
var checkedDistance = false;

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
  createCanvas(500, 700);
  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200, 680, 600, 20);

  rope = new Rope(7, { x: 245, y: 30 });
  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);

  rabbit_sprite = createSprite(450, 630, 20, 20);
  rabbit_sprite.addAnimation("rabbit_animation", rabbit);
  rabbit_sprite.scale = 0.2;
  rabbit_sprite.addAnimation("rabbit_blink", blink);
  rabbit_sprite.addAnimation("rabbit_eat", eat);
  rabbit_sprite.addAnimation("rabbit_sad", sad);

  button = createImg("cut_button.png");
  button.position(100, 30);
  button.size(50, 50)
  button.mouseClicked(drop);

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

  image(food, fruit.position.x, fruit.position.y, 70, 70);
  rope.show();
  Engine.update(engine);
  ground.show();
  if (ropeIsCut) {
    ropeIsCut = false;
    setTimeout(() => {
      var distance = checkCollision(fruit, rabbit_sprite);
      if (distance < 50 && !checkedDistance) {
        fruitIsntEated = false;
        checkedDistance = false;
        //World.remove(world, fruit);
        //fruit = null;
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

function checkCollision(object, sprite) {
  var d = dist(object.position.x, object.position.y, sprite.x, sprite.y);
  console.log(object.position.x, object.position.y, sprite.x, sprite.y);
  console.log(d);
  return d;
}

function airing_fruit(){
  Body.applyForce(fruit,{x:0,y:0},{x:0.02,y:0})
}