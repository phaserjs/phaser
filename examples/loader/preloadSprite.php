<?php
	$title = "Preload sprite";
	require('../head.php');
?>

<script type="text/javascript">



	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

	function preload() {

		game.load.image('backdrop', 'assets/pics/remember-me.jpg');
        game.load.image('card', 'assets/sprites/mana_card.png');
        game.load.image('rewarding', 'assets/pics/destop-rewarding.png');
        game.load.image('unknown', 'assets/pics/destop-unknown.png');
        game.load.image('wheel', 'assets/pics/large-color-wheel.png');
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.image('atari4', 'assets/sprites/atari800.png');
        game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
        game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
        game.load.image('firstaid', 'assets/sprites/firstaid.png');
        game.load.image('diamond', 'assets/sprites/diamond.png');
        game.load.image('mushroom', 'assets/sprites/mushroom2.png');

        game.load.setPreloadSprite('unknown',1);
       
	}

	function create() {

		game.add.sprite(200, 200, 'rewarding');


	}



</script>

<?php
	require('../foot.php');
?>