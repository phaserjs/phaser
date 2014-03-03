
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('box', 'assets/sprites/block.png');

}

var box;
var box2;
var cursors;

function p2px(v) {
	return v *= -20;
}

function px2p(v) {
	return v * -0.05;
}

function create() {

	box = game.add.sprite(200, 0, 'box');

	box2 = game.add.sprite(400, 0, 'box');
	box2.physicsEnabled = true;

	box2.body.setZeroDamping();

    cursors = game.input.keyboard.createCursorKeys();


	// box2.body.mass = 2;

	/*
    // Add a plane
    planeShape = new p2.Plane();
    planeBody = new p2.Body({ mass: 0, position:[0, px2p(550)] });
    // planeBody = new p2.Body();
    planeBody.addShape(planeShape);
    world.addBody(planeBody);
    */

}

function update() {

	box2.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
    	box2.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
    	box2.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
    	box2.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
    	box2.body.moveDown(200);
    }

}

function render() {

	game.debug.text('x: ' + box2.body.velocity.x, 32, 32);
	game.debug.text('y: ' + box2.body.velocity.y, 32, 64);

	// game.debug.text('x: ' + p2px(boxBody.position[0]), 32, 32);
	// game.debug.text('y: ' + p2px(boxBody.position[1]), 32, 64);
	// game.debug.text('r: ' + boxBody.angle, 32, 96);

	// drawbox();

}

function drawbox() {

	var ctx = game.context;

    ctx.save();
    ctx.translate(game.width/2, game.height/2);  // Translate to the center
    ctx.scale(50, -50);       // Zoom in and flip y axis

	ctx.lineWidth = 0.05;
	ctx.strokeStyle = 'rgb(255,255,255)';


	ctx.beginPath();
	var x = boxBody.position[0],
	    y = boxBody.position[1];
	ctx.save();
	ctx.translate(x, y);        // Translate to the center of the box
	ctx.rotate(boxBody.angle);  // Rotate to the box body frame
	ctx.rect(-boxShape.width/2, -boxShape.height/2, boxShape.width, boxShape.height);
	ctx.stroke();
	ctx.closePath();
	// ctx.restore();

 //    ctx.save();
 //    ctx.translate(game.width/2, game.height/2);  // Translate to the center
 //    ctx.scale(50, -50);       // Zoom in and flip y axis

	// ctx.lineWidth = 0.05;
	// ctx.strokeStyle = 'rgb(255,255,255)';
	// ctx.beginPath();

 //        var y = planeBody.position[1];
	// 	ctx.rotate(0);  // Rotate to the box body frame
 //        ctx.moveTo(-game.width, y);
 //        ctx.lineTo( game.width, y);
 //        ctx.stroke();

	// ctx.closePath();
	ctx.restore();
}

