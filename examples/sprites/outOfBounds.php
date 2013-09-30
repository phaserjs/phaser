<?php
	$title = "Sprite is out of world bounds";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create});

	function preload() {
		game.load.image('alien', 'assets/sprites/space-baddie.png');
		game.load.image('ship', 'assets/sprites/shmup-ship.png');
	}

	var player,
		aliens;

	function create() {

		player = game.add.sprite(400, 500, 'ship');
		player.anchor.setTo(0.5, 0.5);

		aliens = game.add.group();

		for (var y = 0; y < 4; y++)
		{
			for (var x = 0; x < 10; x++)
			{
				var alien = aliens.create(200 + x * 48, y * 50, 'alien');
				alien.name = 'alien' + x.toString() + y.toString();
				alien.events.onOutOfBounds.add(alienOut, this);
				alien.body.velocity.y = 50 + Math.random() * 200;
			}
		}

	}

	function alienOut(alien) {

		//	Move the alien to the top of the screen again
		alien.reset(alien.x, -32);
		//	And give it a new random velocity
		alien.body.velocity.y = 50 + Math.random() * 200;

	}

})();
</script>

<?php
	require('../foot.php');
?>