<?php
	$title = "Scaling a sprite";
	require('../head.php');
?>

<script type="text/javascript">

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create});

	function preload() {

		game.load.image('disk', 'assets/sprites/darkwing_crazy.png');

	}

	function create() {

		for(var i=0;i<15;i++){

			var sprite=game.add.sprite(game.world.randomX, game.world.randomY, 'disk');
			var rand=game.rnd.realInRange(-2,6);
			sprite.scale.setTo(rand,rand);

		}

		
	}

</script>

<?php
	require('../foot.php');
?>