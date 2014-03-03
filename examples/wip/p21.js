
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);

function preload() {

	game.load.image('box', 'assets/sprites/block.png');

}

var world;

var box;
var box2;

var boxShape;
var boxBody;

var boxShape2;
var boxBody2;

var planeShape;
var planeBody;

function p2px(v) {
	return v *= -20;
}

function px2p(v) {
	return v * -0.05;
}

function create() {

	game.renderer.roundPixels = true;

	box = game.add.image(300, 200, 'box');
	box.anchor.set(0.5);

	box2 = game.add.image(300, 10, 'box');
	box2.anchor.set(0.5);

    world = new p2.World();

    boxShape = new p2.Rectangle(px2p(box.width), px2p(box.height));
    boxBody = new p2.Body({ mass: 1, position:[px2p(box.x), px2p(box.y)], angularVelocity: 1 });
    boxBody.addShape(boxShape);

    boxShape2 = new p2.Rectangle(px2p(box2.width), px2p(box2.height));
    boxBody2 = new p2.Body({ mass: 1, position:[px2p(box2.x), px2p(box2.y)], angularVelocity: 1 });
    boxBody2.addShape(boxShape2);


    world.addBody(boxBody);
    world.addBody(boxBody2);

    // Add a plane
    planeShape = new p2.Plane();
    planeBody = new p2.Body({ mass: 0, position:[0, px2p(550)] });
    // planeBody = new p2.Body();
    planeBody.addShape(planeShape);
    world.addBody(planeBody);

}

function update() {

    // Move physics bodies forward in time
    world.step(1/60);

	box.x = p2px(boxBody.position[0]);
	box.y = p2px(boxBody.position[1]);
	box.rotation = boxBody.angle;  // Rotate to the box body frame

	box2.x = p2px(boxBody2.position[0]);
	box2.y = p2px(boxBody2.position[1]);
	box2.rotation = boxBody2.angle;  // Rotate to the box body frame

}

function render() {

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

