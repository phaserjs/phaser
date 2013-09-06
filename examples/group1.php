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
		game.load.image('diamond', 'assets/sprites/diamond.png');
		game.load.image('carrot', 'assets/sprites/carrot.png');
	}

	var g;
	var t;
	var s;

	function create() {

		t = game.add.sprite(100, 100, 'carrot');
		t.name = 'c0';
		t.body.bounce.y = Math.random();
		t.body.collideWorldBounds = true;

		g = game.add.group();
		// g.x = 400;
		// g.y = 300;
		// g._container.anchor.x = 0.5;
		// g._container.anchor.y = 0.5;

		for (var i = 0; i < 10; i++)
		{
			var x = (i * 64);
			s = g.create(x, 0, 'diamond');
			s.name = 'd' + i;
			s.anchor.setTo(0.5, 0.5);
		}

		// g.forEach(setAlpha, this);

		// g.dump();

		// g.replace(s, t);

		// g.dump();

		// g.callAll('dump', game, 123, 456, 789);

		// g.getRandom().y += 200;

		// g.setAll('body.velocity.y', 250);
		// g.divideAll('y', 2);
		// g.multiplyAll('y', 3);

	}

	function setAlpha (sprite) {
		sprite.alpha = 0.4;
	}

	function update() {

		// g.addAll('angle', 10);
		g.angle++;

	}

	function render() {
	}

})();

</script>

</body>
</html>