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
		game.load.image('disk', 'assets/sprites/ra_dont_crack_under_pressure.png');
	}

	var s;

	function create() {

		game.world._stage.backgroundColorString = '#182d3b';

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'disk');
		s.anchor.setTo(0.5, 0.5);

	}

	function update() {

		s.rotation += 0.01;

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

		game.debug.renderSpriteCorners(s, true, true);
		game.debug.renderSpriteInfo(s, 20, 32);

	}

})();

</script>

</body>
</html>