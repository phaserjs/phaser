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

	//	In this approach we're simply using functions in the current scope to do what we need
	var game = new Phaser.Game(800, 600, Phaser.RENDERER_AUTO, '', { preload: preload, create: create });

	function preload() {

		console.log('*** preload called');
		game.load.image('cockpit', 'assets/pics/cockpit.png');
		game.load.image('overdose', 'assets/pics/lance-overdose-loader_eye.png');

	}

	function create() {

		console.log('*** create called');
		document.body.appendChild(game.cache.getImage('cockpit'));

	}

})();

</script>

</body>
</html>