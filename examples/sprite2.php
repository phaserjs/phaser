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

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	var bunny;

	function preload() {
		game.load.spritesheet('ms', 'assets/sprites/metalslug_mummy37x45.png', 37, 45);
	}

	function create() {

		bunny = new Phaser.Sprite(game, 0, 0, 'ms', 10);

		game.world.add(bunny);

	}

	function update() {
		bunny.postUpdate();
	}

})();

</script>

</body>
</html>