<?php
	$title = "Using samples and looping";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

	function preload() {

		game.load.image('spyro', 'assets/pics/spyro.png');

        //	Firefox doesn't support mp3 files, so use ogg
        game.load.audio('squit', ['assets/audio/SoundEffects/squit.mp3', 'assets/audio/SoundEffects/squit.ogg']);

	}

	var s;
	var music;

	function create() {

		game.stage.backgroundColor = '#255d3b';


        music = game.add.audio('squit',1,true);
        music.play();

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'spyro');
		s.anchor.setTo(0.5, 0.5);

	}

	function update() {
		//s.rotation += 0.01;
	}

	function render() {
        game.debug.renderSoundInfo(music, 20, 32);
	}

})();

</script>

<?php
	require('../foot.php');
?>
