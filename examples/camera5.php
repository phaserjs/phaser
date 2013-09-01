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

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

	var core;
	var core2;

	function preload() {
		game.load.image('bling', 'assets/sprites/diamond.png');
	}

	function create() {

		core = game.add.sprite(game.world.centerX, game.world.centerY, 'bling');
		core.anchor.setTo(0.5, 0.5);

		core2 = game.add.sprite(game.world.centerX, game.world.centerY, 'bling');
		core2.anchor.setTo(0.5, 0.5);

		for (var i = 1; i < 50; i++)
		{
			var d = game.add.sprite(Math.cos(i) * 300, Math.sin(i) * 100, 'bling')
			d.anchor.setTo(0.5, 0.5);
			d.angle = Math.random() * 300;
			core.addChild(d);

			var d = game.add.sprite(Math.cos(i) * 360, Math.sin(i) * 100, 'bling')
			d.anchor.setTo(0.5, 0.5);
			d.angle = Math.random() * 300;
			core2.addChild(d);
		}

	}

	function update() {

		core.angle += 1;
		core2.angle -= 1;

		for (var d in core.children) {
			core.children[d].angle += 4;
		}

		for (var d in core2.children) {
			core2.children[d].angle -= 4;
		}

	}

	function render() {
	}

})();

</script>

</body>
</html>