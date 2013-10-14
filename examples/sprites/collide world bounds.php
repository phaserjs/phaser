<?php
	$title = "Sprite is out of world bounds";
	require('../head.php');
?>

<script type="text/javascript">



	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create});

	function preload() {
		game.load.image('pineapple', 'assets/sprites/pineapple.png');

	}

	var pineapples;

	function create() {

		pineapples = game.add.group();

			for (var i = 0; i < 10; i++){

				var pineapple = pineapples.create(200 + i * 48,50, 'pineapple');
				//This allows your sprite to collide with the world bounds like they were rigid objects
				pineapple.body.collideWorldBounds=true;
				pineapple.body.gravity.x = game.rnd.integerInRange(-5,5);
				pineapple.body.gravity.y = 5 + Math.random() * 10;
				pineapple.body.bounce.setTo(0.7,0.4);
			}

	}


</script>

<?php
	require('../foot.php');
?>