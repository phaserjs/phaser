<?php
	$title = "Shoot the Pointer";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.image('arrow', 'assets/sprites/arrow.png');
		game.load.image('bullet', 'assets/sprites/purple_ball.png');
		
	}

	var sprite;
	var bullets;

	var fireRate = 100;
	var nextFire = 0;

	function create() {

		game.stage.backgroundColor = '#313131';

		bullets = game.add.group();
		bullets.createMultiple(50, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('outOfBoundsKill', true);

		sprite = game.add.sprite(400, 300, 'arrow');
		sprite.anchor.setTo(0.5, 0.5);

	}

	function update() {

		sprite.rotation = game.physics.angleToPointer(sprite);

		if (game.input.activePointer.isDown)
		{
			fire();
		}

	}

	function fire() {

		if (game.time.now > nextFire && bullets.countDead() > 0)
		{
			nextFire = game.time.now + fireRate;

			var bullet = bullets.getFirstDead();

			bullet.reset(sprite.x, sprite.y);

			bullet.rotation = game.physics.moveToPointer(bullet, 300);
		}

	}

	function render() {

        game.debug.renderText('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
        game.debug.renderSpriteInfo(sprite, 32, 450);

	}

</script>

<?php
	require('../foot.php');
?>