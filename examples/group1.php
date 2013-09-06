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
	}

	var g;
	var t;
	var s;

	function create() {

		g = new Phaser.Group(game, 'aliens');

		for (var i = 0; i < 10; i++)
		{
			s = g.createSprite(100 + i * 64, 300, 'diamond');
			s.name = 'diamond' + i;
			s.body.collideWorldBounds = true;
			s.body.bounce.y = Math.random();
		}

		g.getRandom().y += 200;

		//g.setAll('body.velocity.y', 250);
		// g.divideAll('y', 2);
		// g.multiplyAll('y', 3);

	}

	function update() {


	}

	function render() {
	}

})();

</script>

</body>
</html>