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

	var timer = 0;
	var total = 0;

	function preload() {
		//	37x45 is the size of each frame
		//	There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
		//	blank frames at the end, so we tell the loader how many to load
		game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
	}

	function create() {

		releaseMummy();

	}

	function releaseMummy() {

		var mummy = game.add.sprite(-(Math.random() * 800), game.world.randomY, 'mummy');

		mummy.animations.add('walk');
		mummy.animations.play('walk', 50, true);

		game.add.tween(mummy).to({ x: game.width + (1600 + mummy.x) }, 20000, Phaser.Easing.Linear.None, true);

		total++;
		timer = game.time.now + 100;

	}

	function update() {

		if (total < 200 && game.time.now > timer)
		{
			releaseMummy();
		}

	}

})();

</script>

</body>
</html>