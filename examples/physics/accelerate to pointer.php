<?php
	$title = "Accelerate to the Active Pointer";
	require('../head.php');
?>

<script type="text/javascript">

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

		sprite.rotation = game.physics.accelerateToPointer(sprite, this.game.input.activePointer, 500, 500, 500);

	}

	function render() {

        game.debug.renderSpriteInfo(sprite, 32, 32);

	}

</script>

<?php
	require('../foot.php');
?>