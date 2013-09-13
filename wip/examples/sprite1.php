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
		game.load.image('mushroom', 'assets/sprites/mushroom2.png');
	}

	function create() {

		var test = new Phaser.Sprite(game, 0, 0, 'mushroom');

		test.x = 200;

		game.world.add(test);

		console.log(test.alpha);

	}

	function update() {
	}

})();

</script>

</body>
</html>