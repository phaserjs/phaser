<?php
	$title = "Sprite Rotation";
	require('../head.php');
?>

<script type="text/javascript">

	// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {
		game.load.image('arrow', 'assets/sprites/arrow.png');
	}

	var sprite;

	function create() {

		game.stage.backgroundColor = '#0072bc';

		sprite = game.add.sprite(400, 300, 'arrow');
		sprite.anchor.setTo(0.5, 0.5);

	}

	function update() {

		sprite.angle += 1;

		//	Note: Due to a bug in Chrome the following doesn't work atm:
		//	sprite.angle++;
		//	See: https://code.google.com/p/chromium/issues/detail?id=306851


	}

	function render() {

        game.debug.renderSpriteInfo(sprite, 32, 32);
        game.debug.renderText('angularVelocity: ' + sprite.body.angularVelocity, 32, 200);
        game.debug.renderText('angularAcceleration: ' + sprite.body.angularAcceleration, 32, 232);
        game.debug.renderText('angularDrag: ' + sprite.body.angularDrag, 32, 264);
        game.debug.renderText('deltaZ: ' + sprite.body.deltaZ(), 32, 296);

	}

</script>

<?php
	require('../foot.php');
?>