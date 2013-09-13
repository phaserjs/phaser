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

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update }, false, false);

	var bunny;

	function preload() {
		game.load.spritesheet('metalslug', 'assets/sprites/metalslug_monster39x40.png', 39, 40);
	}

	function create() {

		//	This is created by the very act of loading a sprite sheet in
		frameData = game.cache.getFrameData('metalslug');

		//	Both of these work - they look fugly I know, but they'll be hidden behind a Phaser Sprite anyway
		bunny = PIXI.Sprite.fromFrame(frameData.getFrame(0).uuid);
		
		bunny.anchor.x = 0.5;
		bunny.anchor.y = 0.5;

		bunny.scale.x = 6;
		bunny.scale.y = 6;

		bunny.position.x = game.world.centerX;
		bunny.position.y = game.world.centerY;
		
		game.world.add(bunny);

		n = game.time.now + 20;

	}

	var frameData;
	var f = 0;
	var n = 0;

	function update() {

		if (game.time.now > n)
		{
			f = game.math.wrapValue(f, 1, frameData.total);

			bunny.setTexture(PIXI.TextureCache[frameData.getFrame(f).uuid]);

			n = game.time.now + 40;
		}

	}

})();

</script>

</body>
</html>