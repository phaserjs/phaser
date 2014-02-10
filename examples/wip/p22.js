
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('box', 'assets/sprites/block.png');

}

var box;
var box2;

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
	box2.body.mass = 2;

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

}

function render() {

	// game.debug.renderText('x: ' + p2px(boxBody.position[0]), 32, 32);
	// game.debug.renderText('y: ' + p2px(boxBody.position[1]), 32, 64);
	// game.debug.renderText('r: ' + boxBody.angle, 32, 96);

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

