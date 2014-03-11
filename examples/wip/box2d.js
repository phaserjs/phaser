var game = new Phaser.Game(768, 624, Phaser.CANVAS, 'pinball', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.physics('physicsData', 'assets/physics/sprites.json');
  
  game.load.image('ball', 'assets/sprites/ball.png');
  game.load.image('tetrisblock1', 'assets/sprites/tetrisblock1.png');
  game.load.image('tetrisblock2', 'assets/sprites/tetrisblock2.png');
  game.load.image('tetrisblock3', 'assets/sprites/tetrisblock3.png');
}


function create() {
  console.log('created')
  game.physics.startSystem(Phaser.Physics.BOX2D);
  
  //create some balls
  
  var n = 0
  while(++n < 5){
    createBall(Math.random() * 400, 20)
  }
  

  //create a tetris block
  ball = game.add.sprite(260,100,'tetrisblock1')
  game.physics.enable(ball, Phaser.Physics.BOX2D, true)
  ball.body.dynamic = true
  ball.body.loadPolygon('physicsData','tetrisblock1')

  //create a tetris block
  ball = game.add.sprite(260,200,'tetrisblock2')
  game.physics.enable(ball, Phaser.Physics.BOX2D, true)
  ball.body.dynamic = true
  ball.body.loadPolygon('physicsData','tetrisblock2')

  //create a tetris block
  ball = game.add.sprite(260,300,'tetrisblock3')
  game.physics.enable(ball, Phaser.Physics.BOX2D, true)
  ball.body.dynamic = true
  ball.body.loadPolygon('physicsData','tetrisblock3')

  //create a body without a sprite
  rawBody = new Phaser.Physics.Box2D.Body(game,null, 400, 400)
  rawBody.testEdgeShape()

  game.input.onDown.add(createObject, this);

  //sth wrong with performance with this
  //createChain()
  //testBuoyancy()
}

var bc;
function testBuoyancy(){
  bc = new box2d.b2BuoyancyController()
  bc.normal.SetXY(0.0, 1.0);
  bc.offset = Phaser.Physics.Box2D.Utils.px2b(100) //height of fluid 
  bc.density = 5.0;
  bc.linearDrag = 1.0;
  bc.angularDrag = 2.0;

  game.physics.box2d.world.AddController(bc);
}

function createChain(){
  var shape = new box2d.b2PolygonShape();
  shape.SetAsBox(0.6, 0.125);

  var fd = new box2d.b2FixtureDef();
  fd.shape = shape;
  fd.density = 20.0;
  fd.friction = 0.2;

  var jd = new box2d.b2RevoluteJointDef();
  jd.collideConnected = false;

  y = -5.0;
  prevBody = game.physics.box2d.ground;

  for(var i=0;i<5;i++){
    ball = game.add.sprite(Phaser.Physics.Box2D.Utils.b2px(0.5 + i), Phaser.Physics.Box2D.Utils.b2pxi(y),'ball')
    game.physics.enable(ball, Phaser.Physics.BOX2D, true)
    bb = ball.body
    bb.setCircle(20)
    bb.dynamic = true
    bb.createFixture(fd)

    anchor = new box2d.b2Vec2(i, y);
    jd.Initialize(prevBody, bb.data, anchor);
    game.physics.box2d.world.CreateJoint(jd);

    prevBody = bb.data;
  }
}

function createObject(){
  //ball = createBallRaw(game.input.mousePointer.x, game.input.mousePointer.y, 10)
  //bc.AddBody(ball.data);
  
  if(Math.random() > 0.5){
    createBallAt()
  }else{
    createSquareAt()
  }
}

function createBallAt(){
  return createBall(game.input.mousePointer.x + Math.random() * 20, game.input.mousePointer.y + Math.random() * 20)
}

function createSquareAt(){
  return createSquare(game.input.mousePointer.x + Math.random() * 20, game.input.mousePointer.y + Math.random() * 20,true)
}

function createSquare(x, y){
  square = new Phaser.Physics.Box2D.Body(game,null, x, y)
  square.gravityScale = 1 + 0.5 + Math.random()/2
  square.setRectangle(30,30)
  square.debug = true
  square.dynamic = true
  return square
}

function createBall(x, y, r){
  r = r || 20
  ball = game.add.sprite(x,y,'ball')
  game.physics.enable(ball, Phaser.Physics.BOX2D, true)
  ball.body.setCircle(r)
  ball.body.gravityScale = 1 + 0.5 + Math.random()/2
  ball.body.dynamic = true

  return ball
}

function createBallRaw(x, y, r){
  r = r || 20
  ball = new Phaser.Physics.Box2D.Body(game,null, x, y)
  ball.gravityScale = 1 + 0.5 + Math.random()/2
  ball.setCircle(r)
  ball.debug = true
  ball.dynamic = true

  return ball
}

function update() {


}

function render() {

}