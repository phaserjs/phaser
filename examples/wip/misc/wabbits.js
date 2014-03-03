// mods by Patrick OReilly
// twitter: @pato_reilly

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('analog', 'assets/tests/fusia.png');
	game.load.image('arrow', 'assets/sprites/longarrow2.png');
	game.load.image('ball', 'assets/sprites/pangball.png');    
	game.load.image('hill', 'assets/pics/atari_fujilogo.png');
	game.load.image('block', 'assets/sprites/block.png');
	game.load.image('wabbit', 'assets/sprites/wabbit.png');

}

var arrow;
var ball;
var catchFlag = false;
var wabbits;
var wab;
var launchVelocity = 0;
var shotCount = 0;
var wabbitCount = 0;

function create() {

	// set global gravity
	game.physics.gravity.y = 200;

	game.stage.backgroundColor = '#0072bc';
	
	var graphics = game.add.graphics(0, 0);
	graphics.beginFill(0x049e0c);
	graphics.drawRect(195, 450, 10, 150);
	
	wabbits = game.add.group();

	for (var i = 0; i < 5; i++)
	{
		wab = wabbits.create(game.rnd.integerInRange(575, 650), game.rnd.integerInRange(150, 260), 'wabbit');
		wab.name = 'wab' + i;
		wab.body.collideWorldBounds = true;
		wab.body.mass = 0.1;
		wab.body.linearDamping = 0.2;
	}
	
	hill = game.add.sprite(450, 400, 'hill');
	hill.body.collideWorldBounds = true;
	hill.body.mass = 10;
	hill.body.immovable = true;
	
	block = game.add.sprite(575, 300, 'block');
	block.body.collideWorldBounds = true;
	block.body.mass = 5;
	block.body.linearDamping = 0.4;
	
	analog = game.add.sprite(200, 450, 'analog');
	analog.body.allowGravity = false;
	analog.width = 8;
	analog.rotation = 220;
	analog.alpha = 0;
	analog.anchor.setTo(0.5, 0.0);
	
	arrow = game.add.sprite(200, 450, 'arrow');
	arrow.anchor.setTo(0.1, 0.5);
	arrow.body.allowGravity = false;
	arrow.alpha = 0;
	
	ball = game.add.sprite(100, 400, 'ball');
	ball.anchor.setTo(0.5, 0.5);
	ball.inputEnabled = true;
   	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(0.9, 0.9);
	ball.body.linearDamping = 0.2;
	ball.body.immovable = true;
	
	// Enable input.
	ball.input.start(0, true);
	ball.events.onInputDown.add(set);
	ball.events.onInputUp.add(launch);

}

function set(ball, pointer) {

	ball.body.velocity.setTo(0, 0);
	ball.body.allowGravity = false;
	catchFlag = true;

}

function launch() {

	catchFlag = false;
	shotCount++;
	arrow.alpha = 0;
	analog.alpha = 0;
	Xvector = (arrow.x - ball.x) * 4.1;
	Yvector = (arrow.y - ball.y) * 4.1;	
	ball.body.allowGravity = true;
	ball.body.velocity.setTo(Xvector,Yvector);

}

function update() {

    arrow.rotation = game.physics.angleBetween(arrow, ball);
	
	if (catchFlag == true)
	{
		//  Track the ball sprite to the mouse	
		ball.x = game.input.activePointer.worldX;	
		ball.y = game.input.activePointer.worldY;
		
		arrow.alpha = 1;	
		analog.alpha = 0.5;
		analog.rotation = arrow.rotation - 3.14 / 2;
		analog.height = game.physics.distanceToPointer(arrow);	
		launchVelocity = analog.height;
	}

	game.physics.collide(ball, wabbits);
	game.physics.collide(wabbits, wabbits);
	game.physics.collide(wabbits, hill);
	game.physics.collide(ball, hill);
	game.physics.collide(block, hill);
	game.physics.collide(block, ball);
	game.physics.collide(block, wabbits);
	
	//  check wabbits
	var wabs = 0;
	
	for (var i = 0; i < 5; i++)
	{
		thisWab = wabbits.getAt(i);

		if (thisWab.x > 770 && thisWab.y > 400) 
		{ 
			thisWab.alive = false;
			wabs++;
		}
	}

	wabbitCount = 5 - wabs;

	// console.log(ball.body.y, ball.body.motionVelocity.y);

}

function render() {

	// game.debug.spriteCollision(ball, 32, 32);

	// var graphics = game.add.graphics(0, 0);
	// game.context.fillStyle = 'rgba(0,0,255,0.5)';
	// game.context.fillRect(770, 400, 30, 200);	
	// game.debug.text("Drag the ball to launch", 32, 32);
	// game.debug.text("Try to get all 5 wabbits in the blue area with the least number of shots", 32, 64);
	// game.debug.text("Shot Count: " + shotCount, 32, 96);
	// game.debug.text("Wabbits Left: " + wabbitCount, 32, 128);

}
