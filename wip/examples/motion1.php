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
		game.load.image('car', 'assets/sprites/car90.png');
		game.load.image('ship', 'assets/sprites/xenon2_ship.png');
		game.load.image('baddie', 'assets/sprites/space-baddie.png');
	}

	var car;
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

		car = game.add.sprite(400, 300, 'car');
		car.anchor.setTo(0.5, 0.5);
		car.body.collideWorldBounds = true;
		car.body.bounce.setTo(0.5, 0.5);
		car.body.allowRotation = true;

		ship = game.add.sprite(400, 400, 'ship');
		ship.body.collideWorldBounds = true;
		ship.body.bounce.setTo(0.5, 0.5);

	}

	function update() {

        car.body.velocity.x = 0;
        car.body.velocity.y = 0;
		car.body.angularVelocity = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            car.body.angularVelocity = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            car.body.angularVelocity = 200;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            car.body.velocity.copyFrom(game.physics.velocityFromAngle(car.angle, 300));
        }

		game.physics.collideGroup(aliens);
		// total = game.physics.overlap(ship);

	}

	function render() {

		// game.debug.renderQuadTree(game.physics.quadTree);
		// game.debug.renderRectangle(ship.body.bounds);

		// game.debug.renderText('total: ' + total.length, 32, 50);

		// game.debug.renderText('up: ' + ship.body.touching.up, 32, 70);
		// game.debug.renderText('down: ' + ship.body.touching.down, 32, 90);
		// game.debug.renderText('left: ' + ship.body.touching.left, 32, 110);
		// game.debug.renderText('right: ' + ship.body.touching.right, 32, 130);

	}

})();

</script>

</body>
</html>