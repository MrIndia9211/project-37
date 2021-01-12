var database 
var position
var button
//var form
var feed,addFood,lastFed
var foodObj
var Feedtime
var Lastfeed,currentTime
var dog,sadDog,happyDog
var gameState,readState
var garden,bedroom,washroom;
var foodStock,foodS,fedTime

//Create variables here

function preload(){
  sadDog = loadImage("images/Dog.png")

  happyDog = loadImage("images/happy dog.png")

  garden = loadImage("images/Garden.png")

  bedroom = loadImage("images/Bed Room.png")

  washroom = loadImage("images/Wash Room.png")
	//load images here
}

function setup() {

  database = firebase.database();
  createCanvas(900, 500);
 
 
  foodObj=new Food();
  dog = createSprite(700,250,10,10);
  dog.addImage(sadDog)
  dog.scale=0.2

 
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);


  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  var input = createInput("Name");
  var button = createButton('NEXT');
  
  input.position(130, 160);
  button.position(250, 200);
 
  button.mousePressed(function(){
 
    button.hide();
 
    var name = input.value();
    
    var greeting = createElement('h3');
    greeting.html("Hello " + name )
    greeting.position(130, 160)
  });
} 

function draw(){

 
 currentTime=hour();
 if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
  }else if(currentTime==(lastFed+2)){
   update("Sleeping");
     foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("Bathing");
     foodObj.washroom();
  }else{
   update("Hungry")
   foodObj.display();
  }
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
  }
 

drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}