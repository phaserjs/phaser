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

	// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

	var bunny;

	function preload() {

		console.log('***> preload called');
		game.load.image('cockpit', 'assets/pics/cockpit.png');
		game.load.image('overdose', 'assets/pics/lance-overdose-loader_eye.png');

	}

	function create() {

		console.log('***> create called');

		//	Create a basetexture
		var base = new PIXI.BaseTexture(game.cache.getImage('overdose'));
		var texture = new PIXI.Texture(base);
		bunny = new PIXI.Sprite(texture);
		
		// center the sprites anchor point
		bunny.anchor.x = 0.5;
		bunny.anchor.y = 0.5;
		
		// move the sprite t the center of the screen
		bunny.position.x = 200;
		bunny.position.y = 150;
		
		game.stage._s.addChild(bunny);

	}

	function update() {

		if (game.paused == false)
		{
		    bunny.rotation += 0.1;
		    bunny.scale.x += 0.01;
		    bunny.scale.y += 0.01;
		}

	}

})();

</script>

</body>
</html>