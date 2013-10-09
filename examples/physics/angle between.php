<?php
	$title = "Angle between two Sprites";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.image('arrow', 'assets/sprites/longarrow.png');
		game.load.image('ball', 'assets/sprites/pangball.png');

	}

	var arrow;
	var target;

	function create() {

		game.stage.backgroundColor = '#0072bc';

		arrow = game.add.sprite(200, 250, 'arrow');
		arrow.anchor.setTo(0.1, 0.5);

		target = game.add.sprite(600, 400, 'ball');
		target.anchor.setTo(0.5, 0.5);
		target.inputEnabled = true;
		target.input.enableDrag(true);

	}

	function update() {

		arrow.rotation = game.physics.angleBetween(arrow, target);

	}

	function render() {

        game.debug.renderText("Drag the ball", 32, 32);
        game.debug.renderSpriteInfo(arrow, 32, 100);

	}

</script>

<?php
	require('../foot.php');
?>