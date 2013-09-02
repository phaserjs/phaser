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

	function preload() {
		game.load.image('mushroom', 'assets/sprites/mana_card.png');
	}

	var s;
	var t;

	function create() {

		//	Make our game world 2000x2000 pixels in size (the default is to match the game size)
		game.world.setSize(2000, 2000);

		s = game.add.sprite(180, 400, 'mushroom');
		s.autoCull = true;
		
		// s.visible = false;
		// t = game.time.now + 2000;
		// s.scrollFactor.setTo(0.5, 0.5);

	}

	function update() {

		// if (game.time.now > t && s.visible == false)
		// {
		// 	console.log('visible');
		// 	s.visible = true;
		// }

		// s.rotation += 0.01;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            game.camera.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            game.camera.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.camera.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.camera.y += 4;
        }

	}

	function render() {

		// game.debug.renderRectangle(game.world.camera.view, 'rgba(200,0,0,0.2)');
		// game.debug.renderRectangle(s.bounds);
		game.debug.renderSpriteCorners(s, true);

		game.debug.renderSpriteInfo(s, 400, 32);
		game.debug.renderWorldTransformInfo(s, 32, 32);
		// game.debug.renderLocalTransformInfo(s, 200, 32);
		game.debug.renderCameraInfo(game.world.camera, 32, 200);

	}

})();

</script>

</body>
</html>