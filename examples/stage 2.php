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

		var base = new PIXI.BaseTexture(game.cache.getImage('monsters'));
		var texture = new PIXI.Texture(base);
		bunny = new PIXI.Sprite(texture);
		
		bunny.anchor.x = 0.5;
		bunny.anchor.y = 0.5;
		
		bunny.position.x = game.world.centerX;
		bunny.position.y = game.world.centerY;
		
		game.world.add(bunny);

	}

	function update() {

		if (game.paused == false)
		{
		    // bunny.rotation += 0.01;
		    // bunny.scale.x += 0.01;
		    // bunny.scale.y += 0.01;
		}

	}

})();

</script>

</body>
</html>