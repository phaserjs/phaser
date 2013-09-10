<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

	function preload() {
		game.load.image('disk', 'assets/sprites/ra_dont_crack_under_pressure.png');
        //game.load.audio('wizball', ['assets/mp3/oedipus_wizball_highscore.ogg', 'assets/mp3/oedipus_wizball_highscore.mp3']);
        game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3']);

	}

	var s;
	var music;

	function create() {

		game.stage.backgroundColor = '#182d3b';

        music = game.add.audio('boden');
        music.play();

		s = game.add.sprite(game.world.centerX, game.world.centerY, 'disk');
		s.anchor.setTo(0.5, 0.5);

	}

	function update() {
		s.rotation += 0.01;
	}

	function render() {
        game.debug.renderSoundInfo(music, 20, 32);
	}

})();

</script>

</body>
</html>