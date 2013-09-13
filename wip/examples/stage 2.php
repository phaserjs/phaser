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

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, true);

	var bunny;

	function preload() {
		game.load.atlasJSONHash('monsters', 'assets/sprites/pixi_monsters.png', 'assets/sprites/pixi_monsters.json');
	}

	function create() {

		//	This is created by the very act of loading a texture atlas in
		frameData = game.cache.getFrameData('monsters');

		//	Both of these work - they look fugly I know, but they'll be hidden behind a Phaser Sprite anyway
		bunny = PIXI.Sprite.fromFrame(frameData.getFrame(0).uuid);
		// bunny = PIXI.Sprite.fromFrame(frameData.getFrameByName('skully.png').uuid);
		
		bunny.anchor.x = 0.5;
		bunny.anchor.y = 0.5;
		
		bunny.position.x = game.world.centerX;
		bunny.position.y = game.world.centerY;
		
		game.world.add(bunny);

		n = game.time.now + 1000;

	}

	var frameData;
	var f = 0;
	var n = 0;

	function update() {

		if (game.time.now > n)
		{
			f = game.math.wrapValue(f, 1, 4);

			bunny.setTexture(PIXI.TextureCache[frameData.getFrame(f).uuid]);

			n = game.time.now + 500;
		}

	}

})();

</script>

</body>
</html>