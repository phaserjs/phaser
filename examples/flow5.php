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

	var state = {

		preload: function() {

			console.log('state preload called');
			game.load.image('rememberMe', 'assets/pics/remember-me.jpg');
			game.load.text('copyright', 'assets/warning - copyright.txt');

		},

		create: function() {

			console.log('state create called');

			//	Let's try adding an image to the DOM
			document.body.appendChild(game.cache.getImage('rememberMe'));

			//	And some text
			var para = document.createElement('pre');
			para.innerHTML = game.cache.getText('copyright');
			document.body.appendChild(para);

		}
	}

	var game = new Phaser.Game(800, 600, Phaser.RENDERER_AUTO, '');

	//	In this instance we'll change to the state ourselves rather than pass it in the game constructor


})();

</script>

</body>
</html>