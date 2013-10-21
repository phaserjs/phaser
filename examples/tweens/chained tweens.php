<?php
	$title = "Chained Tweens";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create });

	var p, tween, button, flag = false;

	function preload() {

		game.load.image('diamond', 'assets/sprites/diamond.png');
		game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

	}

	function create() {

		game.stage.backgroundColor = 0x2d2d2d;

		p = game.add.sprite(100, 100, 'diamond');
		p.alpha = 0.5;	
		
		tween = game.add.tweenGroup(true).to(p, { x: 400 }, 1000, Phaser.Easing.Linear.None)
		.to(p, { alpha: 0.2 }, 1000, Phaser.Easing.Linear.None, false, -500)
		.to(p, { y: 400 }, 1000, Phaser.Easing.Linear.None)
		.to(p, { x: 100 }, 1000, Phaser.Easing.Linear.None)
		.to(p, { alpha: 1 }, 1000, Phaser.Easing.Linear.None, false, -500)
		.to(p, { y: 100 }, 1000, Phaser.Easing.Linear.None)
		.loop();

		var normalTween = game.add.tween(game.add.sprite(300, 300, 'diamond')).to( { x: 450}, 5000);
		normalTween.start();

		button = game.add.button(game.world.centerX, 400, 'button', actionOnClick, this, 2, 1, 0);
	}

	function actionOnClick() {

		if (flag) {
			console.log('started');
			tween.resume();
		}
		else {
			console.log('stopped');
			tween.pause();
		}

		flag = !flag;

	}

</script>

<?php
	require('../foot.php');
?>