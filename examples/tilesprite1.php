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
		game.load.image('disk', 'assets/sprites/p2.jpeg');
	}

	var s;
	var count = 0;

	function create() {

		game.world._stage.backgroundColorString = '#182d3b';
		
		s = game.add.tileSprite(0, 0, 512, 512, 'disk');
		// s.rotation = 0.1;

	}

	function update() {

		count += 0.005

		// s.rotation += 0.01;

		s.tileScale.x = 2 + Math.sin(count);
		s.tileScale.y = 2 + Math.cos(count);
		
		s.tilePosition.x += 1;
		s.tilePosition.y += 1;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            s.x -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            s.x += 4;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            s.y -= 4;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            s.y += 4;
        }

	}

	function render() {

		// game.debug.renderSpriteCorners(s, true, true);

	}

})();

</script>

</body>
</html>