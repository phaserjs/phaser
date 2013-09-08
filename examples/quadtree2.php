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
		game.load.image('ship', 'assets/sprites/xenon2_ship.png');
		game.load.image('baddie', 'assets/sprites/space-baddie.png');
	}

	var ship;
	var total;
	var aliens;

	function create() {

		aliens = [];

		for (var i = 0; i < 50; i++)
		{
			var s = game.add.sprite(game.world.randomX, game.world.randomY, 'baddie');
			s.name = 'alien' + s;
			s.body.collideWorldBounds = true;
			s.body.bounce.setTo(1, 1);
			s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
			aliens.push(s);
		}

		ship = game.add.sprite(400, 400, 'ship');
		ship.body.collideWorldBounds = true;
		ship.body.bounce.setTo(1, 1);

	}

	function update() {

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            ship.body.velocity.x -= 2;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            ship.body.velocity.x += 2;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            ship.body.velocity.y -= 2;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            ship.body.velocity.y += 2;
        }

		game.physics.collideGroup(aliens);
		total = game.physics.overlap(ship);

	}

	function render() {

		game.debug.renderQuadTree(game.physics.quadTree);
		game.debug.renderRectangle(ship.body);

		// game.debug.renderText('total: ' + total.length, 32, 50);

		game.debug.renderText('up: ' + ship.body.touching.up, 32, 70);
		game.debug.renderText('down: ' + ship.body.touching.down, 32, 90);
		game.debug.renderText('left: ' + ship.body.touching.left, 32, 110);
		game.debug.renderText('right: ' + ship.body.touching.right, 32, 130);

	}

})();

</script>

</body>
</html>