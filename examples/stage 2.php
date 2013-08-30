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

		//var texture = PIXI.TextureCache['skully.png'];

		// PIXI.BaseTextureCache['monsters'] = new PIXI.BaseTexture(game.cache.getImage('monsters'));

		//	every image loaded should go into the BaseTextureCache, unique by URL (or maybe key)
		// var base = new PIXI.BaseTexture(game.cache.getImage('monsters'));

		//	Every FRAME needs a PIXI.Texture, related to the base (the source image) and the frame data
		// var texture = new PIXI.Texture(base, { x: 0, y: 0, width: 100, height: 100 });
		// var texture2 = new PIXI.Texture(base, { x: 0, y: 0, width: 100, height: 300 });

		//	PIXI.Sprite.fromFrame(key) pulls the texture from the TextureCache and returns a new Sprite made from it...
		// var texture = PIXI.TextureCache[frameId];


		// console.log(PIXI.TextureCache);

		// console.log(game.cache.getFrameData('monsters'));

		frameData = game.cache.getFrameData('monsters');

		// bunny = new PIXI.Sprite(texture2);

		bunny = PIXI.Sprite.fromFrame(frameData.getFrame(0).uuid);
		// bunny = PIXI.Sprite.fromFrame(frameData.getFrameByName('skully.png').uuid);

		// bunny = PIXI.Sprite.fromImage('monsters');
		
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

			n = game.time.now + 1000;
		}

	}

})();

</script>

</body>
</html>