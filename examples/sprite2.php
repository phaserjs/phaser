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
		//	37x45 is the size of each frame
		//	There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
		//	blank frames at the end, so we tell the loader how many to load
		game.load.spritesheet('ms', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
	}

	function create() {

		bunny = game.add.sprite(-40, 100, 'ms');

		bunny.animations.add('walk');

		bunny.animations.play('walk', 50, true);

		// bunny.scale.x = 8;
		// bunny.scale.y = 8;

		game.add.tween(bunny).to({ x: game.width }, 10000, Phaser.Easing.Linear.None, true);

	}

	function update() {
		bunny.postUpdate();
	}

})();

</script>

</body>
</html>