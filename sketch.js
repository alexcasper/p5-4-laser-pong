class Paddle {
    /* The constructor is a function that is called when the  new commmand is used with a class. It will return 'this' with all the properties in the constructor, and all the methods specialised below.
    */
  constructor(side)
  {
    /* Uses a terary operator 
    (condition) ? if condition is true : otherwise.
    Checks to see if the result is left, puts the q position accordingly */
    this.x = side=="LEFT"?20:380
    /* Side is passed in from the arguments as either "LEFT" or "RIGHT" */
    this.side = side
    // The Y position is set to 100
    this.y = 100
    // The height of the paddle is specified
    this.height = 30
    // The width of the paddle is specified
    this.width = 10
    // Keys are set depending on the paddle side 
    this.keys = side=="LEFT"?[81,65]:[80,76]
    // The speed is specified
    this.speed = 2
    // The colour is specified based on the paddle side
    this.colour = side=="LEFT"?[200,0,0]:[0,0,200]
  }
  draw() {
    // draw method uses the colour specified in the constructor
    fill(...this.colour)
    // rectangle drawn using object values
    rect(this.x,this.y,this.width,this.height)
  }
  move() {
    // moves if either of the keys are specified
    if(keyIsDown(this.keys[0])) {
      this.y-=this.speed
    }
    if(keyIsDown(this.keys[1])) {
      this.y+=this.speed
    }
  }

}


class Ball {
  // The constructor is a function that is called when the new commmand is used with a class. It will return 'this' with all the properties in the constructor, and all the methods specialised below.
  constructor(id) {
    this.x = width/2
    this.y = 3
    this.ballSize = 6
    // Speed is set to a random direction
    this.xSpeed = Math.random()>0.5?3:-3
    this.ySpeed = 1
    this.colour = [0,256,0]
    this.id = id
  }
  // draws the ball based on the current object properties
  draw() {
    /* the ... destructures the array, i.e. ([a,b,c]) becomes (a,b,c) . this is needed because RBG takes three arguments */
    fill(...this.colour)
    rect(this.x,this.y,this.ballSize,this.ballSize)
  }
  /* moves the ball unless it will be off screen, in which case the direction is changes. changes in horizontal speed is changed by the check function*/
  move() {
    if( this.y-(this.ballSize/2)<0
                    || this.y+(this.ballSize/2)>height) {
      this.ySpeed*=-1
    }
    this.x+=this.xSpeed
    this.y+=this.ySpeed
  }
  /* scores the ball if it is off a side. this means the reset function is called and the global score variable is changed. the colour of the scoring side is also flashed */
  score() {
    if (this.x<0) {
      score.right++
      this.reset(this.id)
      background(0,0,256,255);
    }
    if (this.x>width) {
      score.left++
      this.reset(this.id)
      background(256,0,0,255);
    }
  }
  /* removes this ball from the global array of balls. then creates a new ball with a randomised array. coded this way in case we want to put multiple balls in play */
  reset(id) {
    balls = balls.filter((x)=>x.id!=id)
    balls.push(new Ball(Math.floor(Math.random()*10000)))
  }

  check() {
  /* checks the position of the paddles and adjusts ball direction and speed for each hit */
    for (paddle of paddles) {
      if (
          // checks if balls will share a space with a paddle next frame
        ((this.x+this.xSpeed<=(paddle.x+(paddle.width/2)))&&
        (this.x+this.xSpeed>=(paddle.x-(paddle.width/2))))
          &&
        ((this.y+this.ySpeed<=(paddle.y+(paddle.height/2)))&&
        (this.y+this.ySpeed>=(paddle.y-(paddle.height/2))))
          )
          {
            // if there's a hit, mark the screen
        paddle.side=="LEFT"?
            background(256,0,0,200):
            background(0,0,256,200)
            //increase speed slightly
        this.xSpeed*=-1.03
        // A hit on the middle of the pad will keep it in the same direction
        // A hit on the outer quarters will cause it to redirect, get faster
        if((this.y>paddle.y+(paddle.height/4)) 
        ||(this.y<paddle.y-(paddle.height/4)))  {
        this.ySpeed*=-1.05
        } 
         
      }
    
    }
  }
}

/* global variables to store blur setting, paddles, balls and score */
let blur = true;
let paddles = [];
let balls = [];
let score = {left:0, right:0};

function setup() {
  // sets the rectangle draw mode
  rectMode(CENTER);
  // turns off stroke
  noStroke();
  createCanvas(400, 200);
  frameRate(30);
  // creates left and right paddles
  let leftPaddle = new Paddle("LEFT");
  let rightPaddle = new Paddle("RIGHT");
  // pushes to paddle array
  paddles.push(leftPaddle)
  paddles.push(rightPaddle)
  // creates a new ball
  balls.push(new Ball(1))

}

function draw() {
  // sets background, with lower opacity if blur is turned on
  background(0,blur?10:256);
  // displays scores
  fill(255,0,0);
  text(score.left,120,20)

  fill(0,0,255);
  text(score.right,280,20)
  // loops through b
  for (paddle of paddles) {
    paddle.draw()
    paddle.move()
    
  }

  /* loops through array of balls, drawing them, moving them, scoring them and then checking for paddle collisions. we draw them first and then caculate based on future movement since this avoids awkwardness where balls are inside paddles, etc. */
  for (ball of balls) {
    ball.draw()
    ball.move()
    ball.score()
    ball.check()

  }
  // CALL DEBUG
  // This puts some details on screen for easier debugging.
  // debug()

}

// add a debug method
function debug() {
    blur = false
    text(`ball : ${round(balls[0].x)},${round(balls[0].y)}`
    ,140,200) 
    text(`l: ${round(paddles[0].x)},${round(paddles[0].y)}`
    ,80,200) 
    text(`r: ${round(paddles[1].x)},${round(paddles[1].y)}`,220,200) 
}


