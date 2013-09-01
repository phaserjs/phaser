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

	var tl;
	var tr;
	var bl;
	var br;

	var half = { width: 0, height: 0 };
	var angle = 0;
	var distance = 0;

	/**
    * Returns an array containing 4 Point objects corresponding to the 4 corners of the sprite bounds.
    * @method getAsPoints
    * @param {Sprite} sprite The Sprite that will have its cameraView property modified
    * @return {Array} An array of Point objects.
    */        
    function getAsPoints(sprite) {
        var out = [];
        //  top left
        out.push(new Phaser.Point(sprite.x, sprite.y));
        //  top right
        out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y));
        //  bottom right
        out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y + sprite.height));
        //  bottom left
        out.push(new Phaser.Point(sprite.x, sprite.y + sprite.height));

        return out;
    }

    var midpoint;

	function create() {

		//	Make our game world 2000x2000 pixels in size (the default is to match the game size)
		game.world.setSize(2000, 2000);

		s = game.add.sprite(400, 300, 'mushroom');

		midpoint = new Phaser.Point(s.x + s.width / 2, s.y + s.height / 2);

		var points = getAsPoints(s);
		tl = points[0];
		tr = points[1];
		br = points[2];
		bl = points[3];

		s.anchor.setTo(0, 0);
		s.angle = 5;

		//	get the distance between top-left and bottom-right
		// distance = Phaser.Math.distance(0,0,s.width,s.height);

		//	PIXI worldTransform order:

		//	|a c tx|
		//	|b d ty|
		//	|0 0  1|

		//	0 = scaleX (a)
		//	1 = skewY (c)
		//	2 = translateX
		//	3 = skewX (b)
		//	4 = scaleY (d)
		//	5 = translateY

	}

	function update() {

		s.angle += 0.5;
	}

	function render() {

		game.debug.renderSpriteInfo(s, 32, 32);

		// var p1 = getLocalPosition(midpoint.x, midpoint.y, s);

		var p1 = getLocalPosition(tl.x, tl.y, s);
		var p2 = getLocalPosition(tr.x, tr.y, s);
		var p3 = getLocalPosition(bl.x, bl.y, s);
		var p4 = getLocalPosition(br.x, br.y, s);

		// p1.add(100, 100);
		// p2.add(100, 100);
		// p3.add(100, 100);
		// p4.add(100, 100);
		// p1.add(s.x + (s.anchor.x * (s.width / 2)), s.y + (s.anchor.y * (s.height / 2)));
		p1.add(s.x, s.y);
		p2.add(s.x, s.y);
		p3.add(s.x, s.y);
		p4.add(s.x, s.y);

		// game.debug.renderPoint(tl, 'rgb(255,0,0)');
		// game.debug.renderPoint(tr, 'rgb(0,255,0)');
		// game.debug.renderPoint(bl, 'rgb(0,0,255)');
		// game.debug.renderPoint(br, 'rgb(255,0,255)');

		game.debug.renderPoint(p1, 'rgb(255,0,0)');
		game.debug.renderPoint(p2, 'rgb(0,255,0)');
		game.debug.renderPoint(p3, 'rgb(0,0,255)');
		game.debug.renderPoint(p4, 'rgb(255,0,255)');

		game.debug.renderText('tx: ' + tr.x, 32, 250);
		game.debug.renderText('ty: ' + tr.y, 32, 265);
		game.debug.renderText('px: ' + p2.x, 32, 280);
		game.debug.renderText('py: ' + p2.y, 32, 295);

	}

	function getLocalPosition (x, y, displayObject) {
		
		var a00 = displayObject.worldTransform[0];	//	scaleX
		var a01 = displayObject.worldTransform[1];	//	skewY
		var a02 = displayObject.worldTransform[2];	//	translateX
		var a10 = displayObject.worldTransform[3];	//	skewX
		var a11 = displayObject.worldTransform[4];	//	scaleY
		var a12 = displayObject.worldTransform[5];	//	translateY

		a01 *= -1;
		a10 *= -1;

		var id = 1 / (a00 * a11 + a01 * -a10);

		var dx = a11 * id * x + -a01 * id * y + (a12 * a01 - a02 * a11) * id;
		var dy = a00 * id * y + -a10 * id * x + (-a12 * a00 + a02 * a10) * id;

		return new Phaser.Point(dx, dy);

	}

})();

</script>

</body>
</html>