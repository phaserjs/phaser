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
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	var s;
	var c;
	var r;
	var p;

	function create() {

		//	Make our game world 2000x2000 pixels in size (the default is to match the game size)
		game.world.setSize(2000, 2000);

		s = game.add.sprite(400, 300, 'mushroom');

		//	do this on a texture basis!
        // this._halfSize.x = this.parent.width / 2;
        // this._halfSize.y = this.parent.height / 2;
        // this._offset.x = this.origin.x * this.parent.width;
        // this._offset.y = this.origin.y * this.parent.height;
        // this._angle = Math.atan2(this.halfHeight - this._offset.x, this.halfWidth - this._offset.y);
        // this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));



		// s.scale.setTo(2, 2);
		s.anchor.setTo(0.5, 0.5);
		s.angle = 45;

		r = new Phaser.Rectangle(0, 0, s.width, s.height);

		var newWidth = (s.width * Math.cos(s.rotation)) + (s.height * Math.sin(s.rotation));
		var newHeight = (s.width * Math.sin(s.rotation)) + (s.height * Math.cos(s.rotation));

		r.x = cx(s) - newWidth / 2;
		r.y = cy(s);
		r.width = newWidth;
		r.height = newHeight;

		// var max = Math.max(s.width, s.height);
		// c = new Phaser.Circle(0,0,max);
		// console.log(c);

		// p = new Phaser.Point(s.x, s.y);

		// s.angle = 90;

		//	PIXI worldTransform order:

		//	0 = scaleX
		//	1 = skewY
		//	2 = translateX
		//	3 = skewX
		//	4 = scaleY
		//	5 = translateY

		console.log(s.worldTransform);

	}

	function cx(sprite) {

		if (sprite.anchor.x == 0)
		{
			return sprite.x;
		}
		else
		{
			return sprite.x - (sprite.width * sprite.anchor.x);
		}
	}

	function cy(sprite) {

		if (sprite.anchor.y == 0)
		{
			return sprite.y;
		}
		else
		{
			return sprite.y - (sprite.height * sprite.anchor.y);
		}
	}

	function update() {

		s.rotation += 0.01;
		var newWidth = (s.width * Math.cos(s.rotation)) + (s.height * Math.sin(s.rotation));
		var newHeight = (s.width * Math.sin(s.rotation)) + (s.height * Math.cos(s.rotation));
		r.x = cx(s) - newWidth / 2;
		r.y = cy(s);
		r.width = newWidth;
		r.height = newHeight;

	}

	function render() {

		// game.debug.renderCameraInfo(game.camera, 32, 32);
		game.debug.renderInputInfo(32, 100);
		// game.debug.renderSpriteInfo(s, 32, 32);
		// game.debug.renderSpriteBounds(s);

		//p.rotate(s.x, s.y, s.angle, asDegrees, distance) {

		// game.debug.renderPoint(p);

		game.debug.renderRectangle(r);

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