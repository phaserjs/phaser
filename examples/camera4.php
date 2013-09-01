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

	var mummy;

	function preload() {
		game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
	}

	function create() {

		mummy = game.add.sprite(0, 300, 'mummy');

		mummy.scale.setTo(2, 2);
		mummy.animations.add('walk');
		mummy.animations.play('walk', 50, true);

		game.add.tween(mummy).to({ x: game.width - 100 }, 20000, Phaser.Easing.Linear.None, true);

	}

	function update() {

		mummy.angle += 1;

	}

	function render() {

		game.debug.renderPoint(mummy.topLeft, 'rgb(255,0,0)');
		game.debug.renderPoint(mummy.topRight, 'rgb(0,255,0)');
		game.debug.renderPoint(mummy.bottomLeft, 'rgb(0,0,255)');
		game.debug.renderPoint(mummy.bottomRight, 'rgb(255,0,255)');

	}

})();

</script>

</body>
</html>