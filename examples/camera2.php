<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mana_card.png');
	}

	var s;
	var c;
	var r;
	var p;

	var half = { width: 0, height: 0 };
	var angle = 0;
	var distance = 0;

	function create() {

		//	Make our game world 2000x2000 pixels in size (the default is to match the game size)
		game.world.setSize(2000, 2000);

		s = game.add.sprite(400, 300, 'mushroom');
		console.log(s.width, s.height);

		//	get the distance between top-left and bottom-right
		distance = Phaser.Math.distance(0,0,s.width,s.height);

//	draw line from x/y
		s.anchor.setTo(1, 0);

		// c = new Phaser.Circle(s.x, s.y, distance);

		p = new Phaser.Point();

		//	PIXI worldTransform order:

		//	0 = scaleX
		//	1 = skewY
		//	2 = translateX
		//	3 = skewX
		//	4 = scaleY
		//	5 = translateY

	}

function getMidPoint(x, y, width, height, angle_degrees) {
    var angle_rad = angle_degrees * Math.PI / 180;
    var cosa = Math.cos(angle_rad);
    var sina = Math.sin(angle_rad);
    var wp = width/2;
    var hp = height/2;
    return { px: ( x + wp * cosa - hp * sina ),
             py: ( y + wp * sina + hp * cosa ) };
}


	function update() {


		s.rotation += 0.01;
		// var newWidth = (s.width * Math.cos(s.rotation)) + (s.height * Math.sin(s.rotation));
		// var newHeight = (s.width * Math.sin(s.rotation)) + (s.height * Math.cos(s.rotation));
		// r.x = cx(s) - newWidth / 2;
		// r.y = cy(s);
		// r.width = newWidth;
		// r.height = newHeight;

	}

	function render() {

		// var tt = getMidPoint(s.x,s.y,s.width,s.height,s.angle);
		// p.setTo(tt.px,tt.py);

		var originAngle = Math.atan2(centerY - originY, centerX - originX);		

		// game.debug.renderCameraInfo(game.camera, 32, 32);
		// game.debug.renderInputInfo(32, 100);
		// game.debug.renderSpriteInfo(s, 32, 32);
		// game.debug.renderSpriteBounds(s);

		//p.rotate(s.x, s.y, s.angle, asDegrees, distance) {

		game.debug.renderPoint(p);

		// game.debug.renderRectangle(r);
		// game.debug.renderCircle(c);

		// var p = getLocalPosition(game.input.x, game.input.y, s);

		// game.debug.renderPoint(p, 'rgb(255,0,255)');
		// game.debug.renderPixel(game.input.x, game.input.y);

	}

	function transformBox ( m, t, a ) {

		//	m = 3x3 matrix (may need to check entries)
		//	t = translation matrix
		//	a = rect



	}

	function getLocalPosition (x, y, displayObject)
	{
		//	Maps the point over the DO to local un-rotated, un-scaled space
		//	So you can then compare this point against a hitArea that was defined for the sprite to get detection

		var worldTransform = displayObject.worldTransform;
		var global = { x: x, y: y };
		
		// do a cheeky transform to get the mouse coords;
		var a00 = worldTransform[0], a01 = worldTransform[1], a02 = worldTransform[2],
	        a10 = worldTransform[3], a11 = worldTransform[4], a12 = worldTransform[5],
	        id = 1 / (a00 * a11 + a01 * -a10);
		// set the mouse coords...
		return new PIXI.Point(a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
								   a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id)
	}


})();

</script>

</body>
</html>