function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

var isDrawing, lastPoint;



// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/chunk.png');

}

var mushroom;
var texture;
var image;

var down;
var p;

function create() {

	texture = game.add.renderTexture(800, 600, 'mousetrail', true);

	//	We create a sprite (rather than using the factory) so it doesn't get added to the display, as we only need its texture data.
	mushroom = new Phaser.Sprite(game, 0, 0, 'mushroom');
	mushroom.anchor.setTo(0.5, 0.5);

	//	This is the sprite that is drawn to the display. We've given it the renderTexture as its texture.
	image = game.add.image(0, 0, texture);
		
	domElement = document.getElementById('phaser-example');

	p = new Phaser.Point();

    domElement.addEventListener('mousemove',  onMouseMove, true);
    domElement.addEventListener('mousedown',  onMouseDown, true);
    // domElement.addEventListener('mouseout',   onMouseOut, true);
    domElement.addEventListener('mouseup',   onMouseUp, true);

	texture.render(mushroom, p, false);

}

function onMouseDown(e) {
  isDrawing = true;
  lastPoint = { x: e.clientX, y: e.clientY };
}

function onMouseUp(e) {
  isDrawing = false;
}

function onMouseMove(e) {
	
  if (!isDrawing) return;

  var currentPoint = { x: e.clientX, y: e.clientY };
  var dist = distanceBetween(lastPoint, currentPoint);
  var angle = angleBetween(lastPoint, currentPoint);
  
  for (var i = 0; i < dist; i+=5) {
    x = lastPoint.x + (Math.sin(angle) * i) - 25;
    y = lastPoint.y + (Math.cos(angle) * i) - 25;
    p.set(x, y);
	texture.render(mushroom, p, false);

    // ctx.beginPath();
    // ctx.arc(x+10, y+10, 20, false, Math.PI * 2, false);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
  }
  
  lastPoint = currentPoint;

}

function tint() {

	image.tint = Math.random() * 0xFFFFFF;

}

function update() {

	// if (down)
	// {
	// }

}

function render() {

}
